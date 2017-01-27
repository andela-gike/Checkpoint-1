/* eslint no-undef:0 */
/* eslint no-unused-vars:0 */

const app = angular.module('invIndex', []);

app.controller('MainController', ['$scope', ($scope) => {
  $scope.indexInstance = new Index();
  $scope.indexReveal = false;
  $scope.searchTable = false;
  $scope.searchFile = {};
  $scope.uploadFile = {};
  $scope.indexFile = {};
  $scope.keys = Object.keys;
  $scope.arrayCount = (number) => {
    return new Array(number);
  };

  const retMsg = (msg) => {
    $scope.message = msg;
    $('.modal').modal();
  };

  $scope.uploadedFile = (file) => {
    const regxp = /\.json/;
    if (!regxp.test(file.name.toString())) {
      retMsg('Upload a valid JSON file');
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
    $scope.newIndex = [];
    if (!addFile) {
      retMsg('No file selected');
    }
    if (addFile === 'all') {
      for (const file of Object.keys($scope.uploadFile)) {
        $scope.indices = $scope.indexInstance.createIndex(file, $scope.uploadFile[file]);
        $scope.newIndex.push($scope.indices);
      }
    } else {
      $scope.indices = $scope.indexInstance.createIndex(addFile, $scope.uploadFile[addFile]);
      $scope.newIndex.push($scope.indices);
      if ($scope.newIndex[0] === false) {
        retMsg('Invalid file type');
      }
    }
    $scope.newIndex.forEach((obj) => {
      for (const i in obj) {
        $scope.indexFile[i] = {
          name: i,
          index: obj[i]
        };
      }
    });
    $scope.indexReveal = true;
    $scope.searchTable = false;
  };

  $scope.searchIndex = () => {
    const searchValue = $scope.searchWord;
    const fileSearch = $scope.searchedFile;
    $scope.results = [];
    if (!fileSearch) {
      retMsg('No file selected');
    } else if (searchValue === '' || searchValue === undefined) {
      retMsg('Search field cannot be blank');
    } else if (Object.keys($scope.indexFile).length === 0) {
      retMsg('Create an index first');
    }
    if (fileSearch === 'all') {
      for (const file of Object.keys($scope.indexFile)) {
        $scope.result = $scope.indexInstance.searchIndex(file, searchValue);
        $scope.results.push($scope.result);
      }
    } else {
      $scope.result = $scope.indexInstance.searchIndex(fileSearch, searchValue);
      $scope.results.push($scope.result);
    }
    $scope.results.forEach((result) => {
      for (const i in result) {
        $scope.searchFile[i] = {
          name: i,
          index: result[i]
        };
      }
    });
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
