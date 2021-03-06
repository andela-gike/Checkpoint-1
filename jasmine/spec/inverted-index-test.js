
let index;
const goodJSON = require('../books.json');
const badJSON = require('../sample.json');
const invalid = require('../empty.json');

describe('Inverted Index Test Suite', () => {
  beforeAll(() => {
    index = new Index();
  });

  /**
   * Index instance test suit
   */
  describe('If instantiated', () => {
    it('should be an instance of the Index class', () => {
      expect(index instanceof Object).toBeTruthy();
      expect(index instanceof Object).not.toBeFalsy();
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

    it('should map words to document location accurately', () => {
      expect(index.index.goodJSON.and).toEqual([0, 1]);
      expect(index.index.goodJSON.into).toEqual([0]);
      expect(index.index.goodJSON.powerful).not.toBe([0]);
      expect(index.index.goodJSON.rabbit).not.toBe([1]);
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
    beforeEach(() => {
      index.createIndex('goodJSON', goodJSON);
    });

    it(`should return search result if
    a single word is passed`, () => {
      searchResults = index.searchIndex('goodJSON', 'alice');
      expect(Array.isArray(searchResults.goodJSON)).toBeFalsy();
      expect(searchResults.goodJSON.alice).toEqual([0]);
    });

    it(`should result search result if multi-word
    is passed as value`, () => {
      searchResults = index.searchIndex('goodJSON', 'alice ring ');
      expect(Array.isArray(searchResults.goodJSON)).toBeFalsy();
      expect(typeof searchResults.goodJSON).toEqual('object');
      expect(searchResults.goodJSON.alice &&
          searchResults.goodJSON.ring)
        .toEqual([0] && [1]);
    });

    it('ensure searchIndex can handle complex data types', () => {
      expect(index
        .searchIndex('goodJSON', ['a', 'dwarf', 'elf', 'and'])).toEqual({
          goodJSON: {
            a: [0, 1],
            dwarf: [1],
            elf: [1],
            and: [0, 1]
          }
        });
    });

    it('searches for terms with non-word characters', () => {
      searchResults = index.searchIndex('goodJSON',
        'dwarf. ^###*% wizard, of:');
      expect(searchResults).toEqual({
        goodJSON: {
          dwarf: [1],
          wizard: [1],
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
      expect(searchResults).toEqual({
        goodJSON: {},
      });
    });

    it(`should return search result when no file
    name is specified`, () => {
      searchResults = index.searchIndex(null, 'a dwarf elf and');
      expect(searchResults).toEqual({
        goodJSON: {
          a: [0, 1],
          dwarf: [1],
          elf: [1],
          and: [0, 1]
        }
      });
    });
  });
});
