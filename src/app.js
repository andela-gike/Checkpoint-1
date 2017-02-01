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

  const modalMessage = (msg) => {
    $scope.message = msg;
    $('.modal').modal();
  };

  $scope.uploadedFile = (file) => {
    const regxp = /\.json/;
    if (!regxp.test(file.name.toString())) {
      modalMessage('Upload a valid JSON file');
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
      modalMessage('No file selected');
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
        modalMessage('Invalid file type');
      }
    }
    $scope.newIndex.forEach((obj) => {
      for (const item in obj) {
        $scope.indexFile[item] = {
          name: item,
          index: obj[item]
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
      modalMessage('No file selected, please select the file(s) you want to saerch');
    } else if (searchValue === '' || searchValue === undefined) {
      modalMessage('Search field cannot be blank, please write the word(s) you want to find.');
    } else if (Object.keys($scope.indexFile).length === 0) {
      modalMessage('Create an index first, before you can search.');
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
      for (const item in result) {
        $scope.searchFile[item] = {
          name: item,
          index: result[item]
        };
      }
    });
    $scope.indexReveal = false;
    $scope.searchTable = true;
  };

  const fileUpload = document.getElementById('indexUploadFile');
  fileUpload.addEventListener('change', (e) => {
    for (let item = 0; item < (e.target.files.length); item += 1) {
      $scope.uploadedFile(e.target.files[item]);
    }
  });
}]);
