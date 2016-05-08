/**
 * This file contains all necessary Angular controller definitions for 'frontend.ppc.product' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
  'use strict';

  // Controller to show single product on GUI.
  angular.module('frontend.ppc.power')
    .controller('PowerController', ['$rootScope', '$scope', '$state', '$stateParams',
      'UserService', 'MessageService', 'CampaignModel',
      'ListConfig', 'SocketHelperService', 'DTOptionsBuilder'
      , function ($rootScope, $scope, $state, $stateParams,
                  UserService, MessageService, CampaignModel,
                  ListConfig, SocketHelperService, DTOptionsBuilder) {

        $scope.user = UserService.user();
        // Set current scope reference to models


        var topcampaigns = CampaignModel.gettopCampaigns({startDate: null, endDate: null})
          .then(function (response) {

            $scope.campaigns = response;


            // selected fruits
            $scope.selection = [];


          });

        $scope.dtOptions3 = DTOptionsBuilder.newOptions();
        $scope.dtOptions4 = DTOptionsBuilder.newOptions();

        var getallskus = CampaignModel.getallSKUs({userID: 1})
          .then(function (response) {

            $scope.SKUs = response;


            // selected fruits
            $scope.selection1 = [];


          });

        var getallcampaigns = CampaignModel.getallcampaigns({SKU: 'none'})
          .then(function (response) {

            $scope.campaigns1 = response;


            // selected fruits
            $scope.selection2 = [];


          });


        $scope.toggleSelection = function toggleSelection(campaign) {


          if (campaign === "1ALLSKUS1") {

            //revert

            if ($scope.selall) {
              $scope.campaigns.forEach(function (item, i, arr) {
                var idx = $scope.selection.indexOf(item.Campaign);
                // is currently selected
                if (idx > -1) {
                  $scope.selection.splice(idx, 1);
                }
              });

              $scope.selall = false;

            } else {
              $scope.campaigns.forEach(function (item, i, arr) {
                $scope.selection.push(item.Campaign);
              });

              $scope.selall = true;
            }
            //toggle all


          }


          var idx = $scope.selection.indexOf(campaign);

          // is currently selected
          if (idx > -1) {
            $scope.selection.splice(idx, 1);
          }

          // is newly selected
          else {
            $scope.selection.push(campaign);

          }
        };

        $scope.selall1 = false;
        $scope.selall2 = false;

        $scope.toggleSelection1 = function toggleSelection1(campaign) {


          if (campaign === "1ALLSKUS1") {

            //revert

            if ($scope.selall1) {
              $scope.SKUs.forEach(function (item, i, arr) {
                var idx = $scope.selection1.indexOf(item.SKU);
                // is currently selected
                if (idx > -1) {
                  $scope.selection1.splice(idx, 1);
                }
              });

              $scope.selall1 = false;

            } else {
              $scope.SKUs.forEach(function (item, i, arr) {
                $scope.selection1.push(item.SKU);
              });

              $scope.selall1 = true;
            }
            //toggle all


          }


          var idx = $scope.selection1.indexOf(campaign);

          // is currently selected
          if (idx > -1) {
            $scope.selection1.splice(idx, 1);
          }

          // is newly selected
          else {
            $scope.selection1.push(campaign);

          }

          var getallcampaigns = CampaignModel.getallcampaigns({SKU: $scope.selection1})
            .then(function (response) {

              $scope.campaigns1 = response;


              // selected fruits
              //     $scope.selection2 = [];


            });

        };


        $scope.toggleSelection2 = function toggleSelection2(campaign) {

          if (campaign === "1ALLSKUS1") {

            //revert

            if ($scope.selall2) {
              $scope.campaigns1.forEach(function (item, i, arr) {
                var idx = $scope.selection2.indexOf(item.Campaign);
                // is currently selected
                if (idx > -1) {
                  $scope.selection2.splice(idx, 1);
                }
              });

              $scope.selall2 = false;

            } else {
              $scope.campaigns1.forEach(function (item, i, arr) {
                $scope.selection2.push(item.Campaign);
              });

              $scope.selall2 = true;
            }
            //toggle all


          }

          var idx = $scope.selection2.indexOf(campaign);

          // is currently selected
          if (idx > -1) {
            $scope.selection2.splice(idx, 1);
          }

          // is newly selected
          else {
            $scope.selection2.push(campaign);

          }
        };


        $scope.save_continue = function () {

          $scope.showme = true;
          $rootScope.selectedCampaigns = $scope.selection;
          $rootScope.selectedACoS = $scope.saveacos;

          //$state.go('ppc.powers');

          $scope.campaignName = $rootScope.selectedCampaigns;
          $scope.acoszone = $rootScope.selectedACoS;


          $scope.data = [];
          $scope.datePicker = {};
          $scope.datePicker.date = {startDate: null, endDate: null};
          $scope.dateRangeOptions = {
            showDropdowns: true,
            ranges: {
              'Last 30 Days': [moment().subtract('days', 29), moment()],
              'This Month': [moment().startOf('month'), moment().endOf('month')],
              'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')],
              "Last 2 Months": [moment().subtract('months', 3).startOf('month'), moment().subtract('month', 1).endOf('month')],
              "Last 3 Months": [moment().subtract('months', 4).startOf('month'), moment().subtract('month', 1).endOf('month')],
              "Last 6 Months": [moment().subtract('months', 7).startOf('month'), moment().subtract('month', 1).endOf('month')]
            },
            alwaysShowCalendars: true,
            eventHandlers: {
              'apply.daterangepicker': function () {

                var searchbyACoSmult = CampaignModel.searchbyACoSmult({
                    acosfrom: $scope.acoszone,
                    acostill: 0,
                    campaign: $rootScope.selectedCampaigns,
                    startDate: $scope.datePicker.date.startDate,
                    endDate: $scope.datePicker.date.endDate
                  })
                  .then(function (response) {

                    $scope.searchterms = response;
                    $scope.dtOptions2 = DTOptionsBuilder.newOptions().withOption('aaSorting', [[1, 'desc']]);

                  });


              }
            }
          };

          var searchbyACoSmult = CampaignModel.searchbyACoSmult({
              acosfrom: $rootScope.selectedACoS,
              acostill: 0,
              campaign: $rootScope.selectedCampaigns,
              startDate: null,
              endDate: null
            })
            .then(function (response) {

              $scope.searchterms = response;

            });

          $scope.copiedkeywords = '';
          $scope.copiedkeywordsmatrix = [];
          $scope.copyall = function () {

            $scope.copiedkeywords = '';
            $scope.copiedkeywordsmatrix = [];

            for (var i = 0; i <= $scope.searchterms.length - 1; i++) {
              $scope.copiedkeywordsmatrix.push($scope.searchterms[i].Search);
            }

            $scope.copiedkeywords = $scope.copiedkeywordsmatrix.toString().replace(/,/g, '\n');
          };
          $scope.addsearch = function (keyword) {


            // search and remove the string.

            var found = false;

            for (var i = $scope.copiedkeywordsmatrix.length - 1; i >= 0; i--) {
              if ($scope.copiedkeywordsmatrix[i] === keyword) {
                $scope.copiedkeywordsmatrix.splice(i, 1);
                found = true;
              }
            }

            if (!found) {

              //if didnt found push it to the bottom

              $scope.copiedkeywordsmatrix.push(keyword)

            }

            //rebuild

            $scope.copiedkeywords = $scope.copiedkeywordsmatrix.toString().replace(/,/g, '\n');


          };

          $scope.setacos = function () {

            var searchbyACoS = CampaignModel.searchbyACoS({
                acosfrom: $scope.acoszone,
                acostill: 0,
                campaign: $stateParams.campaign,
                startDate: null,
                endDate: null
              })
              .then(function (response) {

                $scope.searchterms = response;

              });


          };

        };

        $scope.save_continue1 = function () {

          $scope.showme1 = true;
          $rootScope.selectedCampaigns1 = $scope.selection1;
          $rootScope.selectedCampaigns2 = $scope.selection2;
          $rootScope.selectedACoS1 = $scope.saveacos1;

          //$state.go('ppc.powers');

          $scope.campaignName1 = $rootScope.selectedCampaigns1;
          $scope.acoszone1 = $rootScope.selectedACoS1;


          $scope.data1 = [];
          $scope.datePicker1 = {};
          $scope.datePicker1.date = {startDate: null, endDate: null};
          $scope.dateRangeOptions1 = {
            showDropdowns: true,
            ranges: {
              'Last 30 Days': [moment().subtract('days', 29), moment()],
              'This Month': [moment().startOf('month'), moment().endOf('month')],
              'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')],
              "Last 2 Months": [moment().subtract('months', 3).startOf('month'), moment().subtract('month', 1).endOf('month')],
              "Last 3 Months": [moment().subtract('months', 4).startOf('month'), moment().subtract('month', 1).endOf('month')],
              "Last 6 Months": [moment().subtract('months', 7).startOf('month'), moment().subtract('month', 1).endOf('month')]
            },
            alwaysShowCalendars: true,
            eventHandlers: {
              'apply.daterangepicker': function () {

                var searchbyACoSmult1 = CampaignModel.searchbyACoSmult1({
                    acosfrom: $scope.acoszone1,
                    acostill: 0,
                    campaign: $rootScope.selectedCampaigns2,
                    SKU: $rootScope.selectedCampaigns1,
                    startDate: $scope.datePicker1.date.startDate,
                    endDate: $scope.datePicker1.date.endDate
                  })
                  .then(function (response) {

                    $scope.searchterms1 = response;
                    $scope.dtOptions5 = DTOptionsBuilder.newOptions().withOption('aaSorting', [[1, 'desc']]);

                  });


              }
            }
          };

          var searchbyACoSmult1 = CampaignModel.searchbyACoSmult1({
              acosfrom: $rootScope.selectedACoS1,
              acostill: 0,
              campaign: $rootScope.selectedCampaigns2,
              SKU: $rootScope.selectedCampaigns1,
              startDate: null,
              endDate: null
            })
            .then(function (response) {

              $scope.searchterms1 = response;

            });

          $scope.copiedkeywords1 = '';
          $scope.copiedkeywordsmatrix1 = [];
          $scope.copyall1 = function () {

            $scope.copiedkeywords1 = '';
            $scope.copiedkeywordsmatrix1 = [];

            for (var i = 0; i <= $scope.searchterms1.length - 1; i++) {
              $scope.copiedkeywordsmatrix1.push($scope.searchterms1[i].Keyword);
            }

            $scope.copiedkeywords1 = $scope.copiedkeywordsmatrix1.toString().replace(/,/g, '\n');
          };
          $scope.addsearch1 = function (keyword) {


            // search and remove the string.

            var found = false;

            for (var i = $scope.copiedkeywordsmatrix1.length - 1; i >= 0; i--) {
              if ($scope.copiedkeywordsmatrix1[i] === keyword) {
                $scope.copiedkeywordsmatrix1.splice(i, 1);
                found = true;
              }
            }

            if (!found) {

              //if didnt found push it to the bottom

              $scope.copiedkeywordsmatrix1.push(keyword)

            }

            //rebuild

            $scope.copiedkeywords1 = $scope.copiedkeywordsmatrix1.toString().replace(/,/g, '\n');


          };

          $scope.setacos1 = function () {

            var searchbyACoS1 = CampaignModel.searchbyACoS1({
                acosfrom: $scope.acoszone1,
                acostill: 0,
                campaign: $stateParams.campaign1,
                startDate: null,
                endDate: null
              })
              .then(function (response) {

                $scope.searchterms1 = response;

              });


          };


        };


        $scope.generator = {};

        $scope.generate = function () {
          $scope.generator.generated = $scope.datePicker3.date.startDate.toISOString().slice(0, 10) + "-" + $scope.datePicker3.date.endDate.toISOString().slice(0, 10) + ' ' + $scope.generator.acos + '% ACoS ' + $scope.generator.name;
        };

        $scope.removekeywords = function () {

          var removekeywords = CampaignModel.removekeywords({
              acosfrom: $scope.saveacos,
              acostill: 0,
              campaign: $scope.selection,
              startDate: null,
              endDate: null
            })
            .then(function (response) {

              $scope.searchterms = response;

            });


        };


        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('aaSorting', [[2, 'desc']]);
        $scope.dtOptions2 = DTOptionsBuilder.newOptions().withOption('aaSorting', [[1, 'desc']]);
        $scope.dtOptions3 = DTOptionsBuilder.newOptions();
        $scope.dtOptions4 = DTOptionsBuilder.newOptions();
        $scope.dtOptions5 = DTOptionsBuilder.newOptions().withOption('aaSorting', [[1, 'desc']]);
        // Assign this to a variable
        var self = this;

        // Get our center id
        self.centerId = $stateParams.centerId;


      }]);


  // Controller which contains all necessary logic for product list GUI on boilerplate application.
  angular.module('frontend.ppc.power')
    .controller('SinglePowerController', [
      '$rootScope', '$scope', '$state', '$stateParams',
      'ListConfig', 'SocketHelperService',
      'UserService', 'CampaignModel', 'DTOptionsBuilder', function controller($rootScope, $scope, $state, $stateParams,
                                                                              ListConfig, SocketHelperService,
                                                                              UserService, CampaignModel, DTOptionsBuilder) {


        $scope.user = UserService.user();
        // Set current scope reference to models

        $scope.campaignName = $rootScope.selectedCampaigns;
        $scope.acoszone = $rootScope.selectedACoS;


        $scope.data = [];
        $scope.dtOptions2 = DTOptionsBuilder.newOptions().withOption('aaSorting', [[1, 'desc']]);
        $scope.datePicker = {};
        $scope.datePicker.date = {startDate: null, endDate: null};
        $scope.dateRangeOptions = {
          showDropdowns: true,
          ranges: {
            'Last 30 Days': [moment().subtract('days', 29), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')],
            "Last 2 Months": [moment().subtract('months', 3).startOf('month'), moment().subtract('month', 1).endOf('month')],
            "Last 3 Months": [moment().subtract('months', 4).startOf('month'), moment().subtract('month', 1).endOf('month')],
            "Last 6 Months": [moment().subtract('months', 7).startOf('month'), moment().subtract('month', 1).endOf('month')]
          },
          alwaysShowCalendars: true,
          eventHandlers: {
            'apply.daterangepicker': function () {

              var searchbyACoSmult = CampaignModel.searchbyACoSmult({
                  acosfrom: $scope.acoszone,
                  acostill: 0,
                  campaign: $rootScope.selectedCampaigns,
                  startDate: $scope.datePicker.date.startDate,
                  endDate: $scope.datePicker.date.endDate
                })
                .then(function (response) {

                  $scope.searchterms = response;

                });


            }
          }
        };

        var searchbyACoSmult = CampaignModel.searchbyACoSmult({
            acosfrom: $rootScope.selectedACoS,
            acostill: 0,
            campaign: $rootScope.selectedCampaigns,
            startDate: null,
            endDate: null
          })
          .then(function (response) {

            $scope.searchterms = response;

          });

        $scope.copiedkeywords = '';
        $scope.copiedkeywordsmatrix = [];
        $scope.copyall = function () {

          $scope.copiedkeywords = '';
          $scope.copiedkeywordsmatrix = [];

          for (var i = 0; i <= $scope.searchterms.length - 1; i++) {
            $scope.copiedkeywordsmatrix.push($scope.searchterms[i].Search);
          }

          $scope.copiedkeywords = $scope.copiedkeywordsmatrix.toString().replace(/,/g, ',\n');
        };
        $scope.addsearch = function (keyword) {


          // search and remove the string.

          var found = false;

          for (var i = 0; i <= $scope.copiedkeywordsmatrix.length - 1; i++) {
            if ($scope.copiedkeywordsmatrix[i] === keyword) {
              $scope.copiedkeywordsmatrix.splice(i, 1);
              found = true;
            }
          }

          if (!found) {

            //if didnt found push it to the bottom

            $scope.copiedkeywordsmatrix.push(keyword)

          }

          //rebuild

          $scope.copiedkeywords = $scope.copiedkeywordsmatrix.toString().replace(/,/g, ',\n');


        };

        $scope.setacos = function () {

          var searchbyACoS = CampaignModel.searchbyACoS({
              acosfrom: $scope.acoszone,
              acostill: 0,
              campaign: $stateParams.campaign,
              startDate: null,
              endDate: null
            })
            .then(function (response) {

              $scope.searchterms = response;

            });


        };

        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('aaSorting', [[1, 'desc']]);
        $scope.dtOptions1 = DTOptionsBuilder.newOptions().withOption('aaSorting', [[1, 'asc']]);


      }
    ])
  ;
}());
