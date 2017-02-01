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
    it('should ensure that JSON file is not empty', () => {
      expect(goodJSON.length > 0).toBeTruthy();
    });
    it('reads valid and populated JSON files', () => {
      expect(index.checkJSON(goodJSON)).toBeTruthy();
    });
    it('Should throw an error if a json file is empty or badly formatted', () => {
      expect(() => {
        index.checkJSON('invalid', invalid);
      }).toThrow(new Error('Invalid JSON file! Please ensure it is properly formatted and try again. Thank you'));
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
    it('reads file when an index is created', () => {
      expect(index.getIndex('goodJSON').length).not.toEqual(0);
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
      expect(searchResults.goodJSON.alice && searchResults.goodJSON.rings).toEqual([0] && [1]);
    });
    it('should successfully searches an array of words', () => {
      searchResults = index.searchIndex('goodJSON', '[dwarf elf]');
      expect(searchResults).toEqual({
        goodJSON: {
          dwarf: [1],
          elf: [1]
        }
      });
    });
    it('searches all file when a file name is not specified', () => {
      searchResults = index.searchIndex(null, 'lord of the rings');
      expect(searchResults).toEqual({
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
      expect(searchResults).toEqual({
        goodJSON: {}
      });
    });
  });
});
