const app = angular.module('invIndex', ['toastr']);

app.controller('MainController', ($scope, toastr) => {
  $scope.indexInstance = new Index();
  $scope.indexReveal = false;
  $scope.searchTable = false;
  $scope.searchFile = {};
  $scope.uploadFile = {};
  $scope.indexFile = {};
  $scope.keys = Object.keys;
  toastr.success('Hello world!', 'Toastr fun!');

  $scope.arrayCount = number => new Array(number);


  $scope.uploadedFile = (file) => {
    if (!/\.json$/g.test(file.name.toString())) {
      toastr.error('Your file does not match the specified format',
        'Error');
      return;
    }

    const reader = new FileReader();
    let fileContent;
    reader.readAsText(file);
    console.log(file, 'herehrer');
    if (file.type !== 'application/json') {
      toastr.error('Your file does not match the specified format',
      'Error');
    } else {
      reader.onload = (e) => {
        fileContent = JSON.parse(e.target.result);
        const checkJSON = fileContent.length > 0
          && fileContent[0].title && fileContent[0].text;
        if ((fileContent && checkJSON) !== false) {
          $scope.uploadFile[file.name] = fileContent;
          // toastr.success(`${$scope.file.name} has been uploaded`);
          $scope.$apply();
        } else {
          toastr.error('Your file does not match the specified format',
          'Error');
        }
      };
    }
  };

  $scope.createIndex = () => {
    const addFile = $scope.addFile;
    $scope.newIndex = [];
    if (!addFile) {
      toastr.error('Please select a file to upload', 'Error');
    }

    if (addFile === 'all') {
      Object.keys($scope.uploadFile).forEach((file) => {
        $scope.indices = $scope.indexInstance
          .createIndex(file, $scope.uploadFile[file]);
        console.log(file, 'here');
        $scope.newIndex.push($scope.indices);
      });
    } else {
      $scope.indices = $scope.indexInstance.createIndex(addFile, $scope.uploadFile[addFile]);
      console.log(addFile, $scope.indices, 'here');
      $scope.newIndex.push($scope.indices);
      if ($scope.newIndex[0] === false) {
        toastr.error('Invalid file type',
        'Error');
      }
    }

    $scope.newIndex.forEach((indexObject) => {
      for (const item in indexObject) {
        $scope.indexFile[item] = {
          name: item,
          index: indexObject[item]
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
    $scope.searchTable = false;
    if (!fileSearch) {
      toastr.warning(`No file selected, please select the file(s)
       you want to search`, 'Warning');
    } else if (searchValue === '' || searchValue === undefined) {
      toastr.error('Please enter a search word', 'Error');
    } else if (Object.keys($scope.indexFile).length === 0) {
      toastr.error('Create an index first, before you can search.', 'Error');
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
    $scope.indexReveal = true;
    $scope.searchTable = true;
  };

  const fileUpload = document.getElementById('indexUploadFile');
  fileUpload.addEventListener('change', (e) => {
    for (let item = 0; item < (e.target.files.length); item += 1) {
      $scope.uploadedFile(e.target.files[item]);
    }
  });
});
