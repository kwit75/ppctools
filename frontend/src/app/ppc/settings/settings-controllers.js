/**
 * This file contains all necessary Angular controller definitions for 'frontend.ppc.product' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
  'use strict';

  // Controller to show single product on GUI.
  angular.module('frontend.ppc.settings')
    .controller('SettingsController', ['$scope', 'UserService', '$state', '$stateParams', 'SettingsModel', '$http',
      'MessageService', 'CampaignPerfomanceReportModel', 'MWSModel'

      , function ($scope, UserService, $state, $stateParams, SettingsModel, $http,
                  MessageService, CampaignPerfomanceReportModel, MWSModel) {

        $scope.user = UserService.user();
        // Set current scope reference to models


        // Fetch data count
        CampaignPerfomanceReportModel
          .count({where: {}})
          .then(
            function onSuccess(response) {

              $scope.itemCount = response.count;


            }
          )
        ;
        var load = SettingsModel.getvalues()
          .then(function (response) {

            console.log(response);
            $scope.seller={};
            $scope.universal={};
            $scope.seller.SellerID=response[0].MWSAuthToken;
            $scope.seller.MWSAuthToken=response[0].SellerID;
            $scope.universal.profit=response[0].average_profit;
            $scope.universal.acos=response[0].average_acos;

          });

        $scope.uploadFile = function (files) {


          var fd = new FormData();
          //Take the first selected file
          fd.append("0", files[0]);

          $http.post('http://138.201.48.85:1337/api/uploads/', fd, {
            withCredentials: true,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
          }).success(function (data) {
              MessageService.success('Report uploaded, but it may takes up to 20 minutes for processing the data');
            }
          ).error();

        };

        $scope.uploadFile1 = function (files) {


          var fd = new FormData();
          //Take the first selected file
          fd.append("0", files[0]);

          $http.post('http://138.201.48.85:1337/api/uploads1/', fd, {
            withCredentials: true,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
          }).success(function (data) {
              MessageService.success('Report uploaded, but it may takes up to 20 minutes for processing the data');
            }
          ).error();

        };


        $scope.AddSellerAccount = function () {
          MWSModel.addorreplace({SellerID: $scope.seller.SellerID, MWSAuthToken: $scope.seller.MWSAuthToken, })
            .then(
              function onSuccess(response) {

                MessageService.success('MWS data updated.');

                console.log(response);


              }
            )
          ;


        };


        // Save our data
        $scope.save1 = function (resu) {
          MessageService.warning('Processing new report... Please don\'t close this window!');

          var load = CampaignPerfomanceReportModel
            .create(resu)
            .then(
              function onSuccess(response) {

                MessageService.success('Report uploaded successfully! ' + response.data.length + ' records imported.');
                delete $scope.controller.results;
                CampaignPerfomanceReportModel
                  .count({where: {}})
                  .then(
                    function onSuccess(response) {
                      $scope.itemCount = response.count;
                    }
                  )
                ;


              }
            )
            ;
        };

        //   $scope.itemCount = _count.count;


        // Assign this to a variable
        var self = this;

        // Get our center id
        self.centerId = $stateParams.centerId;
        // console.log(commonParameters);
        // Our model
        // self.results = [];


      }])
    .directive('customOnChange', function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var onChangeHandler = scope.$eval(attrs.customOnChange);
          element.bind('change', onChangeHandler);
        }
      };
    })
    .directive('csvReader', [function () {

      // Function to convert to JSON
      var convertToJSON = function (content) {

        // Declare our variables
        var lines = content.csv.split('\r'),
          headers = lines[0].split(content.separator),
          columnCount = lines[0].split(content.separator).length,
          results = [];

        if (headers[2] === 'Advertised SKU') {

          // For each row
          for (var i = 1; i < lines.length - 1; i++) {

            // Declare an object
            var obj = {};

            // Get our current line
            var line = lines[i].replace(/(\d+)\/(\d+)\/(\d+) 0:00/g, '$2/$1/$3').replace(/%/g, '').replace(/N\/A/g, '0').replace(/\n/g, '').split(new RegExp(content.separator + '(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)'));

            // Populate our object

            obj = {
              'Campaign Name': line[0],
              'Ad Group Name': line[1],
              'Advertised SKU': line[2],
              'Keyword': line[3],
              'Match Type': line[4],
              'Start Date': line[5],
              'End Date': line[6],
              'Clicks': line[7],
              'Impressions': line[8],
              'CTR': line[9],
              'Total Spend': line[10],
              'Average CPC': line[11],
              'Currency': line[12],
              '1-day Orders Placed': line[13],
              '1-day Ordered Product Sales': line[14],
              '1-day Conversion Rate': line[15],
              '1-day Same SKU Units Ordered': line[16],
              '1-day Other SKU Units Ordered': line[17],
              '1-day Same SKU Units Ordered Product Sales': line[18],
              '1-day Other SKU Units Ordered Product Sales': line[19],
              '1-week Orders Placed': line[20],
              '1-week Ordered Product Sales': line[21],
              '1-week Conversion Rate': line[22],
              '1-week Same SKU Units Ordered': line[23],
              '1-week Other SKU Units Ordered': line[24],
              '1-week Same SKU Units Ordered Product Sales': line[25],
              '1-week Other SKU Units Ordered Product Sales': line[26],
              '1-month Orders Placed': line[27],
              '1-month Ordered Product Sales': line[28],
              '1-month Conversion Rate': line[29],
              '1-month Same SKU Units Ordered': line[30],
              '1-month Other SKU Units Ordered': line[31],
              '1-month Same SKU Units Ordered Product Sales': line[32],
              '1-month Other SKU Units Ordered Product Sales': line[33]
            };


            // Push our object to our result array
            results.push(obj);
          }

          // Return our array
          return results;

        }
      };

      return {
        restrict: 'A',
        scope: {
          results: '=',
          separator: '=',
          callback: '&saveResultsCallback'
        },
        link: function (scope, element, attrs) {

          // Create our data model
          var data = {
            csv: null,
            separator: scope.separator || '\t'
          };

          // When the file input changes
          element.on('change', function (e) {

            // Get our files
            var files = e.target.files;

            // If we have some files
            if (files && files.length) {

              // Create our fileReader and get our file
              var reader = new FileReader();
              var file = (e.srcElement || e.target).files[0];

              // Once the fileReader has loaded
              reader.onload = function (e) {

                // Get the contents of the reader
                var contents = e.target.result;

                // Set our contents to our data model
                data.csv = contents;

                // Apply to the scope
                scope.$apply(function () {

                  // Our data after it has been converted to JSON
                  scope.results = convertToJSON(data);

                  // Call our callback function
                  scope.callback(scope.result);
                });
              };

              // Read our file contents
              reader.readAsText(file);
            }
          });
        }
      };
    }])
  ;

}());
