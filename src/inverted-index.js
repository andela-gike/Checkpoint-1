/* eslint no-undef:0 */
/* eslint no-unused-vars:0 */

/**
 * Index Class
 *
 * Creates an Index Class
 * @class
 */
class Index {
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
  checkJSON(file) {
    const resFile = JSON.parse(file);
    if (resFile[0] && resFile[0].title) {
      return resFile;
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
  tidyText(words) {
    const tidiedWords = words.replace(/\W+/g, ' ').trim().split(' ');
    return tidiedWords;
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
    file = this.checkJSON(file);
    if (!file) {
      return false;
    }
    const fileWords = [];
    const wordsIndex = {};
    for (const doc of file) {
      const fileString = (`${doc.title} ${doc.text}`).toLowerCase();
      fileWords.push(this.tidyText(fileString));
    }
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
    if (!this.index.hasOwnProperty(filePath)) {
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
   * @param {string} filePath - Path to the file
   * @returns {object} An object of available files
   */
  getFiles(filePath) {
    if (Object.keys(this.files) === 0) {
      return false;
    } else if (typeof filePath !== 'string' || typeof filePath === 'undefined') {
      return this.files;
    }
    return this.files[filePath];
  }

  /**
   * getIndex
   *
   * Returns the index
   *
   * @param {string} filePath - Path to the file
   * @returns {object} An object of indices
   */
  getIndex(filePath) {
    if (Object.keys(this.index) === 0) {
      return false;
    } else if (typeof filePath !== 'string' || typeof filePath === 'undefined') {
      return this.index;
    }
    return this.index[filePath];
  }

  /**
   * searchWords
   *
   * Gets the search words passed, refactors them for searching
   *
   * @params {string} terms
   * @returns {string} A string of words to search
   */
  searchWords(terms) {
    let toSearch = '';
    for (let i = 0; i < arguments.length; i += 1) {
      if (Array.isArray(arguments[i])) {
        arguments[i].join(' ');
      }
      // toSearch += arguments[i] + ' ';
      toSearch += `${arguments[i]} `;
    }
    return toSearch.split(',').join(' ');
  }

  /**
   * searchIndex
   *
   * Checks whether searched terms are in the created index
   *
   * @param {string} filePath
   * @param {string} terms
   * @returns {object} An object of the results
   */
  searchIndex(filePath, ...terms) {
    const results = {};
    let searchTerms = [];
    const toSearch = this.searchWords(...terms);
    searchTerms = this.tidyText(toSearch.toLowerCase());
    if (!filePath) {
      for (const file in this.index) {
        results[file] = this.searchResult(searchTerms, this.index[file]);
      }
    } else {
      const searchFile = this.index[filePath];
      results[filePath] = this.searchResult(searchTerms, searchFile);
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
      if (file.hasOwnProperty(term)) {
        results[searchTerms[index]] = file[term];
      }
    });
    return results;
  }
}
