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
   * @param {object} responseFile - Content of the file
   * @returns {bool} | {object} A false boolean if file is not valid
   *
   * or a JSON object if valid file
   */
  static checkJSON(responseFile) {
    if (responseFile.length > 0
      && responseFile[0].title && responseFile[0].text) {
      return responseFile;
    }
    return false;
  }

  /**
   * tidyText
   *
   * Removes punctuation and whitespace
   *
   * @param {string} values - String of words in file as a value
   * @returns {array} An array of words with no whitespace or punctuation
   */
  static tidyText(values) {
    const words = values.toLowerCase()
      .replace(/\W+/g, ' ')
      .trim()
      .split(' ');
    return this.arrangeWords(words);
  }

  /**
   * arrangeWords
   *
   * bring out an array the contain properly arranged words
   * @param {array} words words in each file
   * @returns {array} returns an array of arranged words
   *
   */
  static arrangeWords(words) {
    return words.filter((item, position) => words.indexOf(item) === position);
  }

  /**
   * createIndex
   *
   * Creates the index from the file passed
   *
   * @param {string} fileName - Name of the file
   * @param {object} file - Content of the file
   * @returns {object} An object of created indices
   */
  createIndex(fileName, file) {
    file = Index.checkJSON(file);
    if (!file) {
      return false;
    }

    const wordsIndex = {};
    file.forEach((document, index) => {
      const fileString = Index.tidyText(document.text);
      fileString.forEach((word) => {
        if (wordsIndex[word]) {
          wordsIndex[word].push(index);
        } else {
          wordsIndex[word] = [index];
        }
      });
    });
    if (!this.index[fileName]) {
      this.index[fileName] = wordsIndex;
    }
    this.files[fileName] = file.length;
    return this.index;
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
  static searchWords(...terms) {
    let toSearch = '';

    for (let word = 0; word < terms.length; word += 1) {
      if (Array.isArray(...[word])) {
        terms[word].join(' ');
      }
      toSearch += `${terms[word]} `;
    }
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
    const toSearch = Index.searchWords(...terms);

    searchTerms = Index.tidyText(toSearch.toLowerCase());
    if (!fileName) {
      Array.prototype.forEach.call(this.index, (file) => {
        results[file] = Index.searchResult(searchTerms, this.index[file]);
      });
    } else {
      const searchFile = this.index[fileName];
      results[fileName] = Index.searchResult(searchTerms, searchFile);
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
  static searchResult(searchTerms, file) {
    const results = {};

    searchTerms.forEach((term, index) => {
      if (file[term]) {
        results[searchTerms[index]] = file[term];
      }
    });
    return results;
  }
}
