/**
 * Index Class
 *
 * Creates an Index Class
 * @class
 */
class Index {
  /**
   *
   *
   * @constructor
   */
  constructor() {
    this.index = {};
    this.files = {};
  }

  /**
   * checkJSON
   *
   * Checks whether the file is a JSON file
   *
   * @param {object} file - Content of the file
   * @returns {bool} | {object} A false boolean if file is not valid
   * or a JSON object if valid file
   */
  static checkJSON(file) {
    const responseFile = JSON.parse(file);
    if (responseFile[0] && responseFile[0].title) {
      return responseFile;
    }
    return false;
  }

  /**
   * tidyText
   *
   * Removes punctuation and whitespace
   *
   * @param {string} words - Words in file
   * @returns {array} An array of words with no whitespace or punctuation
   */
  static tidyText(words) {
    return words.replace(/\W+/g, ' ')
      .trim().split(' ').filter(text =>
        text
      );
  }

  /**
   * createIndex
   *
   * Creates the index from the file passed
   *
   * @param {string} filePath - Path to the file
   * @param {object} file - Content of the file
   * @returns {object} An object of created indices
   */
  createIndex(filePath, file) {
    file = Index.checkJSON(file);
    if (!file) {
      return false;
    }
    const fileWords = [];
    const wordsIndex = {};
    file.forEach((doc) => {
      const fileString = (`${doc.title} ${doc.text}`).toLowerCase();
      fileWords.push(Index.tidyText(fileString));
    });
    for (const indexNo in fileWords) {
      const position = parseInt(indexNo, 10);
      fileWords[indexNo].forEach((word) => {
        if (wordsIndex[word]) {
          if (wordsIndex[word].indexOf(position) === -1) {
            wordsIndex[word].push(position);
          }
        } else {
          wordsIndex[word] = [position];
        }
      });
    }
    if (!this.index[filePath]) {
      this.index[filePath] = wordsIndex;
    }
    this.files[filePath] = file.length;
    return this.index;
  }

  /**
   * getFiles
   *
   * Returns the available files
   *
   * @param {string} fileName - Name of the file
   * @returns {object} An object of available files
   */
  getFiles(fileName) {
    if (Object.keys(this.files).length === 0) {
      return false;
    } else if (typeof fileName !== 'string') {
      return this.files;
    }
    return this.files[fileName];
  }

  /**
   * getIndex
   *
   * Returns the index
   *
   * @param {string} fileName - Name to the file
   * @returns {object} An object of indices
   */
  getIndex(fileName) {
    return this.index[fileName];
  }

  /**
   * searchIndex
   * Search for terms in a file
   * @param {String} terms word(s) to be searched in the index
   * @param {String} filename file to search for words
   * @return {Object} words and their index
   */
  searchWords(terms) {
    let toSearch = '';
    for (let word = 0; word < arguments.length; word += 1) {
      if (Array.isArray(...[word])) {
        arguments[word].join(' ');
      }
      toSearch += `${arguments[word]} `;
    }
    this.toSearch = toSearch;
    return toSearch.split(',').join(' ');
  }

  /**
   * searchIndex
   *
   * Checks whether searched terms are in the created index
   *
   * @param {string} fileName
   * @param {string} terms
   * @returns {object} An object of the results
   */
  searchIndex(fileName, ...terms) {
    const results = {};
    let searchTerms = [];
    const toSearch = this.searchWords(...terms);
    searchTerms = Index.tidyText(toSearch.toLowerCase());
    if (!fileName) {
      for (const file in this.index) {
        results[file] = this.searchResult(searchTerms, this.index[file]);
      }
    } else {
      const searchFile = this.index[fileName];
      results[fileName] = this.searchResult(searchTerms, searchFile);
    }
    return results;
  }

  /**
   * searchResult
   *
   * Returns the search results
   *
   * @param {array} searchTerms
   * @param {object} file
   * @returns {object} results
   */
  searchResult(searchTerms, file) {
    const results = {};

    searchTerms.forEach((term, index) => {
      if (file[term]) {
        results[searchTerms[index]] = file[term];
      }
    });
    this.results = results;
    return results;
  }
}
