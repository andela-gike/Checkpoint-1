[![Build Status](https://travis-ci.org/andela-gike/Checkpoint-1.svg?branch=master)](https://travis-ci.org/andela-gike/Checkpoint-1)
[![Coverage Status](https://coveralls.io/repos/github/andela-gike/Checkpoint-1/badge.svg?branch=master)](https://coveralls.io/github/andela-gike/Checkpoint-1?branch=master)
[![Code Climate](https://codeclimate.com/github/andela-gike/Checkpoint-1/badges/gpa.svg)](https://codeclimate.com/github/andela-gike/Checkpoint-1)
[![Test Coverage](https://codeclimate.com/github/andela-gike/Checkpoint-1/badges/coverage.svg)](https://codeclimate.com/github/andela-gike/Checkpoint-1/coverage)
[![Issue Count](https://codeclimate.com/github/andela-gike/Checkpoint-1/badges/issue_count.svg)](https://codeclimate.com/github/andela-gike/Checkpoint-1)
# inverted-index

Inverted index is designed to allow very fast full-text searches. it consists of a list of all the unique words that appear in any document, and for each word, a list of the documents in which it appears.
To create an inverted index, we first split the content field of each document into separate words (which we call terms, or tokens), create a sorted list of all the unique terms, and then list in which document each term appears.

####Installation Process

1. Clone the repository.
2. Run `npm install`
3. Run `gulp browserSync` to startup browsersync

####Testing Process
To see the results of the test, run the gulp jasmine task on the command line with `gulp jasmine`, it opens up the specrunner browser.

#### Major Dependecies
3. Run `gulp` to startup browsersync

####Testing Process
Run the `SpecRunner.html` in the base dir

####Dependencies
* [Gulp](http://gulpjs.com/)
* [Angular1x](https://angularjs.org/)
* [Jasmine](http://jasmine.github.io/2.4/introduction.html)
* [BrowserSync](https://www.browsersync.io/)

## Technology
  1. HTML5
  2. Javascript (NODEJS Environment)
  3. Jasmine for Testing

### References
* [Inverted index - wikipedia.com](https://en.wikipedia.org/wiki/Inverted_index)

* [Inverted index - elastic search](https://www.elastic.co/guide/en/elasticsearch/guide/current/inverted-index.html)


####Licence

MIT License

Copyright (c) 2016 GRACE IKE

