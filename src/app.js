/* eslint no-undef:0 */
/* eslint no-unused-vars:0 */

const app = angular.module('indexapp', []);

app.controller('MainCtrller', ['$scope', ($scope) => {
  $scope.indexInstance = new Index();
  $scope.indexReveal = false;
  $scope.searchTable = false;
  $scope.searchFile = {};
  $scope.uploadFile = {};
  $scope.indexFile = {};
  $scope.keys = Object.keys;
  $scope.arrayCount = (num) => {
    return new Array(num);
  };

  const resMsg = (msg) => {
    $scope.message = msg;
    $('.modal').modal();
  };

  $scope.uploadedFile = (file) => {
    const regexp = /\.json/;
    if (!regexp.test(file.name.toString())) {
      resMsg('Upload a valid JSON file');
    }
    const reader = new FileReader();
    let fileContent;
    reader.readAsText(file);
    reader.onload = (e) => {
      fileContent = e.target.result;
      $scope.uploadFile[file.name] = fileContent;
      $scope.$apply();
    };
  };
  $scope.createIndex = () => {
    const addFile = $scope.addFile;
    if (!addFile) {
      resMsg('No file selected');
    }
    if ($scope.indexInstance.createIndex(addFile, $scope.uploadFile[addFile])) {
      $scope.indexReveal = true;
      $scope.searchTable = false;
      $scope.indexFile[addFile] = {
        name: addFile,
        index: $scope.indexInstance.getIndex(addFile)
      };
    } else {
      resMsg('There was a problem creating an index from the file');
    }
  };

  $scope.searchIndex = () => {
    const searchValue = $scope.searchWord;
    const fileSearch = $scope.searchedFile;
    if (!fileSearch) {
      resMsg('No file selected');
    } else if (searchValue === '' || searchValue === undefined) {
      resMsg('Search field cannot be blank');
    } else if (Object.keys($scope.indexFile).length === 0) {
      resMsg('Create an index first');
    } else {
      $scope.results = $scope.indexInstance.searchIndex(fileSearch, searchValue);
    }
    for (const result in $scope.results) {
      $scope.searchFile[result] = {
        name: result,
        index: $scope.results[result]
      };
    }
    $scope.indexReveal = false;
    $scope.searchTable = true;
  };

  const fileUpload = document.getElementById('indexUploadFile');
  fileUpload.addEventListener('change', (e) => {
    for (let i = 0; i < (e.target.files.length); i += 1) {
      $scope.uploadedFile(e.target.files[i]);
    }
  });
}]);
