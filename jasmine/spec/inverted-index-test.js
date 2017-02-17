
let index;
const goodJSON = require('../books.json');
const badJSON = require('../sample.json');
const invalid = require('../empty.json');


describe('Inverted Index Test Suite', () => {
  beforeAll(() => {
    index = new Index();
    index.createIndex('goodJSON', goodJSON);
    index.createIndex('invalid', invalid);
    index.createIndex('badJSON', badJSON);
  });

  /**
   * Index instance test suit
   */
  describe('If instantiated', () => {
    it('should be an instance of the Index class', () => {
      expect(index instanceof Index).toBeTruthy();
    });
  });


  /**
   * Read book data test suite
   */

  describe('Read book data', () => {
    it('should ensure that JSON file is not empty', () => {
      expect(goodJSON.length > 0).toBeTruthy();
      expect(invalid.length > 0).not.toBeTruthy();
    });

    it('reads valid and populated JSON files', () => {
      expect(Index.checkJSON(goodJSON)).toBeTruthy();
      expect(Index.checkJSON(badJSON)).not.toBeTruthy();
    });

    it('rejects an invalid file', () => {
      expect(index.createIndex('invalid', invalid)).toBeFalsy();
    });

    it(`asserts that JSON files have title-text
      pairs as object keys`, () => {
      expect(index.createIndex('badJSON', badJSON)).toBeFalsy();
      expect(index.createIndex('goodJSON', goodJSON)).toBeTruthy();
    });
  });

  /**
   * Populate index test suite
   */
  describe('Populate Index', () => {
    it('reads file when an index is created', () => {
      expect(index.getIndex('goodJSON').length).not.toEqual(0);
    });
  });

  /**
   * Test suite to ensure the getIndex method returns an object of
   * the correct index mapping
   */
  describe('Get index', () => {
    it(`should verify that the correct object
      of index map is returned`, () => {
      expect(index.getIndex('goodJSON').and).toEqual([0, 1]);
      expect(index.getIndex('goodJSON')).not.toBe(null);
      expect(typeof index.getIndex('goodJSON')).toBe('object');
      expect(!Array.isArray(index.getIndex('goodJSON'))).toBeTruthy();
    });
  });

  /**
   * Search index test suite
   */
  describe('Search Index', () => {
    let searchResults;
    it('does a single-word search', () => {
      searchResults = index.searchIndex('goodJSON', 'alice');
      expect(Array.isArray(searchResults.goodJSON)).toBeFalsy();
      expect(typeof searchResults.goodJSON).toEqual('object');
      expect(searchResults.goodJSON.alice).toEqual([0]);
    });

    it('should ensure it does a multi-word search', () => {
      searchResults = index.searchIndex('goodJSON', 'alice rings ');
      expect(Array.isArray(searchResults.goodJSON)).toBeFalsy();
      expect(typeof searchResults.goodJSON).toEqual('object');
      expect(searchResults.goodJSON.alice &&
        searchResults.goodJSON.rings).toEqual([0] && [1]);
    });

    it('should successfully searches an array of words', () => {
      searchResults = index
        .searchIndex('goodJSON', '[dwarf elf]');
      expect(searchResults).toEqual({
        goodJSON: {
          dwarf: [1],
          elf: [1]
        }
      });
    });

    it('searches for terms with non-word characters', () => {
      searchResults = index.searchIndex('goodJSON',
        'The. ^###*% Fellowship, of:');
      expect(searchResults).toEqual({
        goodJSON: {
          the: [1],
          fellowship: [1],
          of: [0, 1]
        }
      });
    });

    it('returns nothing if word is not found', () => {
      searchResults = index.searchIndex('goodJSON', 'Ike Grace');
      expect(searchResults).toEqual({
        goodJSON: {}
      });
    });

    it('returns nothing if no terms are passed', () => {
      searchResults = index.searchIndex('');
      expect(searchResults).toEqual({});
    });

    it('should not take long to execute.', () => {
      expect(() => {
        index.searchIndex('alice', 'fellowship');
      }).not.toThrowError('Search took too long.');
    });
  });
});
