/* eslint no-undef:0 */
describe('Inverted Index Test Suite', () => {
  let index;
  const goodJSON = `[
    {
      "title": "Alice in Wonderland",
      "text": "Alice falls into a rabbit hole and enters a world full of imagination."
    },
    {
      "title": "The Lord of the Rings: The Fellowship of the Ring.",
      "text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
    }
  ]`;
  const badJSON = `[
    {
      "A Good Book": "Great Expectations",
      "Description": "Pip's great expectations"
    },
    {
      "A Another Good Book": "Becoming Beyonce",
      "Description": "The untold story as told by J. Randy Taraborrelli."
    }
  ]`;

  const invalid = '[]';

  beforeEach(() => {
    index = new Index();
    index.createIndex('goodJSON', goodJSON);
    index.createIndex('invalid', invalid);
    index.createIndex('badJSON', badJSON);
  });

  /**
  * Index instance test suit
  */
  describe('Inverted Index Instance', () => {
    describe('If instantiated', () => {
      it('should be an instance of the Index class', () => {
        expect(index instanceof Index).toBeTruthy();
      });
    });
  });

  /**
  * Read book data test suite
  */

  describe('Read book data', () => {
    beforeEach(() => {
      index.createIndex('goodJSON', goodJSON);
      index.createIndex('invalid', invalid);
    });
    it('should ensure that JSON file is not empty', () => {
      expect(goodJSON.length > 0).toBeTruthy();
    });
    it('reads valid and populated JSON files', () => {
      expect(index.createIndex('goodJSON', goodJSON)).toBeTruthy();
    });
    it('rejects an invalid file', () => {
      expect(index.createIndex('invalid', invalid)).toBeFalsy();
    });
    it('asserts that JSON files have title-text pairs as object keys', () => {
      expect(index.createIndex('badJSON', badJSON)).toBeFalsy();
    });
  });

  /**
  * Populate index test suite
  */
  describe('Populate Index', () => {
    beforeEach(() => {
      index.createIndex('goodJSON', goodJSON);
    });
    it('reads file when an index is created', () => {
      expect(index.getIndex('goodJSON')).not.toEqual({});
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
    it('does a single-word search', () => {
      searchResults = index.searchIndex('goodJSON', 'alice');
      expect(searchResults).toEqual({
        goodJSON: {
          alice: [0]
        }
      });
    });
    it('should ensure it does a multi-word search', () => {
      searchResults = index.searchIndex('goodJSON', 'alice rings ');
      expect(searchResults).toEqual(
        {
          goodJSON: {
            alice: [0],
            rings: [1]
          }
        });
    });
    it('successfully searches if search terms are an array', () => {
      searchResults = index.searchIndex('goodJSON', '[dwarf elf]');
      expect(searchResults).toEqual(
        {
          goodJSON: {
            dwarf: [1],
            elf: [1]
          }
        });
    });
    it('searches without passing a file argument', () => {
      searchResults = index.searchIndex(null, 'lord of the rings');
      expect(searchResults).toEqual(
        {
          goodJSON: {
            lord: [1],
            of: [0, 1],
            the: [1],
            rings: [1]
          }
        });
    });
    it('searches for terms with non-word characters', () => {
      searchResults = index.searchIndex('goodJSON', 'The. ^###*% Fellowship, of:');
      expect(searchResults).toEqual(
        {
          goodJSON: {
            the: [1],
            fellowship: [1],
            of: [0, 1]
          }
        });
    });
    it('returns nothing if word is not found', () => {
      searchResults = index.searchIndex('goodJSON', 'Ike Grace');
      expect(searchResults).toEqual({ goodJSON: {} });
    });
    it('returns nothing if no terms are passed', () => {
      searchResults = index.searchIndex('');
      expect(searchResults).toEqual({ goodJSON: {} });
    });
  });
});
