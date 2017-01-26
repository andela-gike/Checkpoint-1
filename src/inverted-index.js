/* eslint no-undef:0 */
/* eslint no-unused-vars:0 */

/**
* The Index Class
*/
class Index {
  constructor() {
    this.index = {};
    this.files = {};
  }

  /**
  * Checks whether the file is a JSON file
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
  * Removes punctuation and whitespace
  * @param {string} words - Words in file
  * @returns {array} An array of words with no whitespace or punctuation
  */
  tidyText(words) {
    const punctRegex = () => {
      // Return an array of full words
      const splitAllWords = words.toString().split('/s*\bs*/');
      for (let arr = 0; arr < splitAllWords.length; arr += 1) {
        // Remove punctuation and return string
        const splitText = splitAllWords.toString().replace(/[(~|`|!|@|#|$|%|^|&|*|(|)|{|}|[|\]|;|:|"|'|<|,|.|>|?|/|\\|||-|_|+|=)]/g, '');
        // Return an array of cleaned text
        return splitText.replace(/\s+/g, ' ').split(' ');
      }
    };
    return punctRegex();
  }

  /**
  * Creates the index from the file passed
  * @param {string} filePath - Path to the file
  * @param {object} file - Content of the file
  */
  createIndex(filePath, file) {
    file = this.checkJSON(file);
    if (!file) {
      return false;
    }
    const fileWords = [];
    const wordsIndex = {};
    for (const doc of file) {
      const fileStr = (`${doc.title} ${doc.text}`).toLowerCase();
      fileWords.push(this.tidyText(fileStr));
    }
    for (const indexNum in fileWords) {
      const locate = parseFloat(indexNum);
      fileWords[indexNum].forEach((word) => {
        if (wordsIndex[word]) {
          if (wordsIndex[word].indexOf(locate) === -1) {
            wordsIndex[word].push(locate);
          }
        } else {
          wordsIndex[word] = [locate];
        }
      });
    }
    if (!this.index.hasOwnProperty(filePath)) {
      this.index[filePath] = wordsIndex;
    }
    this.files[filePath] = file.length;
    return true;
  }

  /**
  * Returns the available files
  * @param {string} filePath - Path to the file
  * @returns {object} - An object of available files
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
  * Returns the index
  * @param {string} filePath - Path to the file
  * @returns {object} - An object of indices
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
  * Gets the search words passed, refactors them for searching
  * @params {terms} a term to search
  * @returns {string} A string of words to search
  */
  searchWord(terms) {
    let toSearch = '';
    let value;
    for (value = 0; value < arguments.length; value += 1) {
      if (Array.isArray(arguments[value])) {
        arguments[value].join(' ');
      }
      toSearch += `${arguments[value]}`;
    }
    return toSearch.split(',').join(' ');
  }

  /**
  Checks whether searched terms are in the created index
  * @param {string} filePath
  * @param {string} terms
  * @returns {object} An object of the results
  */
  searchIndex(filePath, ...terms) {
    const results = {};
    let searchTerms = [];
    const toSearch = this.searchWord(...terms);
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
  * Returns the search results
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
