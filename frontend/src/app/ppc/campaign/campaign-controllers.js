/**
 * This file contains all necessary Angular controller definitions for 'frontend.ppc.product' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
  'use strict';

  // Controller to show single product on GUI.
  angular.module('frontend.ppc.campaign')
    .controller('CampaignController', ['$scope', '$state', '$stateParams',
      'UserService', 'MessageService', 'CampaignModel',
      'ListConfig', 'SocketHelperService', 'DTOptionsBuilder'
      , function ($scope, $state, $stateParams,
                  UserService, MessageService, CampaignModel,
                  ListConfig, SocketHelperService, DTOptionsBuilder) {

        $scope.user = UserService.user();
        // Set current scope reference to models


        var topcampaigns = CampaignModel.gettopCampaigns({startDate: null, endDate: null})
          .then(function (response) {

            $scope.campaigns = response;

          });

        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('aaSorting', [[2, 'desc']]);

        // Assign this to a variable
        var self = this;

        // Get our center id
        self.centerId = $stateParams.centerId;

      }]);
  // Controller which contains all necessary logic for product list GUI on boilerplate application.
  angular.module('frontend.ppc.campaign')
    .controller('SingleCampaignController', [
      '$scope', '$state', '$stateParams','MessageService',
      'ListConfig', 'SocketHelperService',
      'UserService', 'CampaignModel', 'DTOptionsBuilder', function controller($scope, $state, $stateParams, MessageService,
                                                                              ListConfig, SocketHelperService,
                                                                              UserService, CampaignModel, DTOptionsBuilder) {




        $scope.user = UserService.user();
        // Set current scope reference to models

        $scope.save_acos = function (){

          // Make actual data update
          CampaignModel
            .update_acos({campaign: $stateParams.campaign, acos: $scope.saveacos, id: $scope.KPI.id})
            .then(
              function onSuccess() {
                MessageService.success('ACoS updated successfully');
              }
            )
          ;
        };



        $scope.campaignName = $stateParams.campaign;
        $scope.acoszone = 40;

        var KPI = CampaignModel.gettopKPI({campaign: $stateParams.campaign, startDate: null, endDate: null})
          .then(function (response) {

            $scope.KPI = response[0];
            console.log(response[0]);

            if ($scope.KPI.MinDate === null) {
              console.log('redirecting');
              $state.go('ppc.settings');
            }
            $scope.uprevenue = $scope.KPI.Revenue;
            $scope.upcost = $scope.KPI.Cost;
            $scope.upacos = $scope.KPI.Cost / $scope.KPI.Revenue * 100;
            $scope.upcpc = $scope.KPI.Cost / $scope.KPI.Clicks;
            $scope.upimpressions = $scope.KPI.Impressions;
            $scope.upctr = $scope.KPI.Clicks / $scope.KPI.Impressions * 100;
            $scope.upclicks = $scope.KPI.Clicks;
            $scope.upcr = $scope.KPI.Orders / $scope.KPI.Clicks * 100;
            $scope.datePicker.date = {startDate: $scope.KPI.MinDate, endDate: $scope.KPI.EndDate};
            $scope.dateRangeOptions.minDate = $scope.KPI.MinDate;
            $scope.dateRangeOptions.maxDate = $scope.KPI.EndDate;
            $scope.upprofit = $scope.KPI.Profit;
            $scope.saveacos=$scope.KPI.acos1;
            var getbelowacos = CampaignModel.getbelowacos({
                acosfrom: $scope.saveacos,
                acostill: 0,
                campaign: $stateParams.campaign,
                startDate: null,
                endDate: null
              })
              .then(function (response) {

                $scope.belowacos = response;

              });

          });


        $scope.options = {
          chart: {
            type: 'lineChart',
            height: 450,
            margin: {
              top: 20,
              right: 20,
              bottom: 50,
              left: 65
            },
            x: function (d) {
              return d[0];
            },
            y: function (d) {
              return d[1];
            },

            color: d3.scale.category10().range(),
            duration: 300,
            useInteractiveGuideline: true,
            clipVoronoi: false,
            // yDomain: [0, d3.max(function (d) { return d.v; }) ],
            xAxis: {
              axisLabel: 'Date',
              tickFormat: function (d) {
                return d3.time.format('%b %d')(new Date(d));
              }
            },
            yAxis: {
              axisLabel: 'Data',
              tickFormat: function (d) {
                return d3.format('.02f')(d);
              },
              axisLabelDistance: -10
            },
          }
        };

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

              var searchbyACoS = CampaignModel.searchbyACoS({
                  acosfrom: $scope.acoszone,
                  acostill: 0,
                  campaign: $stateParams.campaign,
                  startDate: $scope.datePicker.date.startDate,
                  endDate: $scope.datePicker.date.endDate
                })
                .then(function (response) {

                  $scope.searchterms = response;

                });

              var charts = CampaignModel.getChartbyCampaign({campaign: $stateParams.campaign, startDate: $scope.datePicker.date.startDate,endDate: $scope.datePicker.date.endDate
                })
                .then(function (response) {


                  $scope.charts = response;
                  $scope.data = [];
                  $scope.data[0] = {
                    key: "Gross Revenue",
                    mean: 250,
                    values: []
                  };

                  $scope.charts.forEach(function (item, i, arr) {
                    var rr = new Date(item.EndDate);

                    $scope.data[0].values.push([rr.getTime(), item.Revenue]);
                  });


                  $scope.data[1] = {
                    key: "Net Revenue",
                    mean: 250,
                    values: []
                  };

                  $scope.charts.forEach(function (item, i, arr) {
                    var rr = new Date(item.EndDate);

                    $scope.data[1].values.push([rr.getTime(), item.Revenue - item.Cost]);
                  });


                  $scope.data[3] = {
                    key: "Profit",
                    mean: 250,
                    values: []
                  };

                  $scope.charts.forEach(function (item, i, arr) {
                    var rr = new Date(item.EndDate);
                    var nn = 0;
                    if (item.Revenue != 0) nn = item.Profit;

                    $scope.data[3].values.push([rr.getTime(), nn]);
                  });

                  $scope.data[2] = {
                    key: "Ad Spend",
                    mean: 250,
                    values: []
                  };

                  $scope.charts.forEach(function (item, i, arr) {
                    var rr = new Date(item.EndDate);
                    $scope.data[2].values.push([rr.getTime(), item.Cost]);

                  });
                });

              var keywordsload = CampaignModel.customQuery({
                  campaign: $stateParams.campaign,
                  startDate: $scope.datePicker.date.startDate,
                  endDate: $scope.datePicker.date.endDate,
                  order: 'DESC'
                })
                .then(function (response) {

                  $scope.keywords = response;
                  $scope.selectedKeyword = $scope.keywords[0].Keyword;

                  var getChartbyKeyword = CampaignModel.getChartbyKeyword({
                      keyword: $scope.keywords[0].Keyword,
                      campaign: $stateParams.campaign,
                      startDate: null,
                      endDate: null
                    })
                    .then(function (response) {
                      $scope.charts1 = response;
                      $scope.data1 = [];
                      $scope.data1[0] = {
                        key: "Gross Revenue",
                        mean: 250,
                        values: []
                      };

                      $scope.charts1.forEach(function (item, i, arr) {
                        var rr = new Date(item.EndDate);

                        $scope.data1[0].values.push([rr.getTime(), item.Revenue]);
                      });


                      $scope.data1[1] = {
                        key: "Net Revenue",
                        mean: 250,
                        values: []
                      };

                      $scope.charts1.forEach(function (item, i, arr) {
                        var rr = new Date(item.EndDate);

                        $scope.data1[1].values.push([rr.getTime(), item.Revenue - item.Cost]);
                      });


                      $scope.data1[3] = {
                        key: "Profit",
                        mean: 250,
                        values: []
                      };

                      $scope.charts1.forEach(function (item, i, arr) {
                        var rr = new Date(item.EndDate);
                        var nn = 0;
                        if (item.Revenue != 0) nn = item.Profit;

                        $scope.data1[3].values.push([rr.getTime(), nn]);
                      });

                      $scope.data1[2] = {
                        key: "Ad Spend",
                        mean: 250,
                        values: []
                      };

                      $scope.charts1.forEach(function (item, i, arr) {
                        var rr = new Date(item.EndDate);
                        $scope.data1[2].values.push([rr.getTime(), item.Cost]);

                      });
                      $scope.options1 = {
                        chart: {
                          type: 'lineChart',
                          height: 450,
                          margin: {
                            top: 20,
                            right: 20,
                            bottom: 50,
                            left: 65
                          },
                          x: function (d) {
                            return d[0];
                          },
                          y: function (d) {
                            return d[1];
                          },

                          color: d3.scale.category10().range(),
                          duration: 300,
                          useInteractiveGuideline: true,
                          clipVoronoi: false,
                          // yDomain: [0, d3.max(function (d) { return d.v; }) ],
                          xAxis: {
                            axisLabel: 'Date',
                            tickFormat: function (d) {
                              return d3.time.format('%b %d')(new Date(d));
                            }
                          },
                          yAxis: {
                            axisLabel: 'Data',
                            tickFormat: function (d) {
                              return d3.format('.02f')(d);
                            },
                            axisLabelDistance: -10
                          },
                        }
                      };

                    });
                });

              var badkeywordsload = CampaignModel.customQuery({
                  campaign: $stateParams.campaign,
                  startDate: $scope.datePicker.date.startDate,
                  endDate: $scope.datePicker.date.endDate,
                  order: 'ASC'
                })
                .then(function (response) {

                  $scope.badkeywords = response;
                  $scope.selectedbadKeyword = $scope.badkeywords[0].Keyword;

                });

              var KPI = CampaignModel.gettopKPI({
                  campaign: $stateParams.campaign, startDate: $scope.datePicker.date.startDate,
                  endDate: $scope.datePicker.date.endDate
                })
                .then(function (response) {

                  $scope.KPI = response[0];
                  // console.log(response[0]);

                  if ($scope.KPI.MinDate === null) {
                    console.log('redirecting');
                    $state.go('ppc.settings');
                  }
                  $scope.uprevenue = $scope.KPI.Revenue;
                  $scope.upcost = $scope.KPI.Cost;
                  $scope.upacos = $scope.KPI.Cost / $scope.KPI.Revenue * 100;
                  $scope.upcpc = $scope.KPI.Cost / $scope.KPI.Clicks;
                  $scope.upimpressions = $scope.KPI.Impressions;
                  $scope.upctr = $scope.KPI.Clicks / $scope.KPI.Impressions * 100;
                  $scope.upclicks = $scope.KPI.Clicks;
                  $scope.upcr = $scope.KPI.Orders / $scope.KPI.Clicks * 100;
                  $scope.datePicker.date = {startDate: $scope.KPI.MinDate, endDate: $scope.KPI.EndDate};
                  $scope.upprofit = $scope.KPI.Profit;

                });
            }
          }
        };

        var searchbyACoS = CampaignModel.searchbyACoS({
            acosfrom: 40,
            acostill: 0,
            campaign: $stateParams.campaign,
            startDate: null,
            endDate: null
          })
          .then(function (response) {

            $scope.searchterms = response;

          });

        $scope.copiedkeywords = '';
        $scope.copiedkeywordsmatrix = [];
        $scope.copiedkeywords1 = '';
        $scope.copiedkeywordsmatrix1 = [];
        $scope.copyall = function () {

          $scope.copiedkeywords = '';
          $scope.copiedkeywordsmatrix = [];

          for (var i = 0; i <= $scope.searchterms.length - 1; i++) {
            $scope.copiedkeywordsmatrix.push($scope.searchterms[i].Search);
          }

          $scope.copiedkeywords = $scope.copiedkeywordsmatrix.toString().replace(/,/g, '\n');
        };

        $scope.copyall1 = function () {

          $scope.copiedkeywords1 = '';
          $scope.copiedkeywordsmatrix1 = [];

          for (var i =0 ; i <= $scope.keywords.length - 1; i++) {
            $scope.copiedkeywordsmatrix1.push($scope.keywords[i].Keyword);
          }

          $scope.copiedkeywords1 = $scope.copiedkeywordsmatrix1.toString().replace(/,/g, '\n');
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

        $scope.removenumbers = function () {

          $scope.copiedkeywords.replace(/^\d*?$/,'');

        };










        var charts = CampaignModel.getChartbyCampaign({campaign: $stateParams.campaign, startDate: null, endDate: null})
          .then(function (response) {


            $scope.charts = response;
            $scope.data = [];
            $scope.data[0] = {
              key: "Gross Revenue",
              mean: 250,
              values: []
            };

            $scope.charts.forEach(function (item, i, arr) {
              var rr = new Date(item.EndDate);

              $scope.data[0].values.push([rr.getTime(), item.Revenue]);
            });


            $scope.data[1] = {
              key: "Net Revenue",
              mean: 250,
              values: []
            };

            $scope.charts.forEach(function (item, i, arr) {
              var rr = new Date(item.EndDate);

              $scope.data[1].values.push([rr.getTime(), item.Revenue - item.Cost]);
            });


            $scope.data[3] = {
              key: "Profit",
              mean: 250,
              values: []
            };

            $scope.charts.forEach(function (item, i, arr) {
              var rr = new Date(item.EndDate);
              var nn = item.Profit;

              $scope.data[3].values.push([rr.getTime(), nn]);
            });

            $scope.data[2] = {
              key: "Ad Spend",
              mean: 250,
              values: []
            };

            $scope.charts.forEach(function (item, i, arr) {
              var rr = new Date(item.EndDate);
              $scope.data[2].values.push([rr.getTime(), item.Cost]);

            });
          });


//            $scope.product=response[0];

        var keywordsload = CampaignModel.customQuery({
            campaign: $stateParams.campaign,
            startDate: null,
            endDate: null,
            order: 'DESC'
          })
          .then(function (response) {

            $scope.keywords = response;
            $scope.selectedKeyword = $scope.keywords[0].Keyword;

            var getChartbyKeyword = CampaignModel.getChartbyKeyword({
                keyword: $scope.keywords[0].Keyword,
                campaign: $stateParams.campaign,
                startDate: null,
                endDate: null
              })
              .then(function (response) {
                $scope.charts1 = response;
                $scope.data1 = [];
                $scope.data1[0] = {
                  key: "Gross Revenue",
                  mean: 250,
                  values: []
                };

                $scope.charts1.forEach(function (item, i, arr) {
                  var rr = new Date(item.EndDate);

                  $scope.data1[0].values.push([rr.getTime(), item.Revenue]);
                });


                $scope.data1[1] = {
                  key: "Net Revenue",
                  mean: 250,
                  values: []
                };

                $scope.charts1.forEach(function (item, i, arr) {
                  var rr = new Date(item.EndDate);

                  $scope.data1[1].values.push([rr.getTime(), item.Revenue - item.Cost]);
                });


                $scope.data1[3] = {
                  key: "Profit",
                  mean: 250,
                  values: []
                };

                $scope.charts1.forEach(function (item, i, arr) {
                  var rr = new Date(item.EndDate);
                  var nn = item.Profit;

                  $scope.data1[3].values.push([rr.getTime(), nn]);
                });

                $scope.data1[4] = {
                  key: "Impressions",
                  mean: 250,
                  values: []
                };

                $scope.charts1.forEach(function (item, i, arr) {
                  var rr = new Date(item.EndDate);
                  var nn = item.Impressions;

                  $scope.data1[4].values.push([rr.getTime(), nn]);
                });

                $scope.data1[2] = {
                  key: "Ad Spend",
                  mean: 250,
                  values: []
                };

                $scope.charts1.forEach(function (item, i, arr) {
                  var rr = new Date(item.EndDate);
                  $scope.data1[2].values.push([rr.getTime(), item.Cost]);

                });
                $scope.options1 = {
                  chart: {
                    type: 'lineChart',
                    height: 450,
                    margin: {
                      top: 20,
                      right: 20,
                      bottom: 50,
                      left: 65
                    },
                    x: function (d) {
                      return d[0];
                    },
                    y: function (d) {
                      return d[1];
                    },

                    color: d3.scale.category10().range(),
                    duration: 300,
                    useInteractiveGuideline: true,
                    clipVoronoi: false,
                    // yDomain: [0, d3.max(function (d) { return d.v; }) ],
                    xAxis: {
                      axisLabel: 'Date',
                      tickFormat: function (d) {
                        return d3.time.format('%b %d')(new Date(d));
                      }
                    },
                    yAxis: {
                      axisLabel: 'Data',
                      tickFormat: function (d) {
                        return d3.format('.02f')(d);
                      },
                      axisLabelDistance: -10
                    },
                  }
                };

              });
          });

        $scope.changestats = function (keyword) {
          $scope.selectedKeyword = keyword;
          var getChartbyKeyword = CampaignModel.getChartbyKeyword({
              keyword: keyword,
              campaign: $stateParams.campaign,
              startDate: null,
              endDate: null
            })
            .then(function (response) {
              $scope.charts1 = response;
              $scope.data1 = [];
              $scope.data1[0] = {
                key: "Gross Revenue",
                mean: 250,
                values: []
              };

              $scope.charts1.forEach(function (item, i, arr) {
                var rr = new Date(item.EndDate);

                $scope.data1[0].values.push([rr.getTime(), item.Revenue]);
              });


              $scope.data1[1] = {
                key: "Net Revenue",
                mean: 250,
                values: []
              };

              $scope.charts1.forEach(function (item, i, arr) {
                var rr = new Date(item.EndDate);

                $scope.data1[1].values.push([rr.getTime(), item.Revenue - item.Cost]);
              });


              $scope.data1[3] = {
                key: "Profit",
                mean: 250,
                values: []
              };

              $scope.charts1.forEach(function (item, i, arr) {
                var rr = new Date(item.EndDate);
                var nn = 0;
                nn = item.Profit;

                $scope.data1[3].values.push([rr.getTime(), nn]);
              });

              $scope.data1[4] = {
                key: "Impressions",
                mean: 250,
                values: []
              };

              $scope.charts1.forEach(function (item, i, arr) {
                var rr = new Date(item.EndDate);
                var nn = 0;
                nn = item.Impressions;

                $scope.data1[4].values.push([rr.getTime(), nn]);
              });

              $scope.data1[2] = {
                key: "Ad Spend",
                mean: 250,
                values: []
              };

              $scope.charts1.forEach(function (item, i, arr) {
                var rr = new Date(item.EndDate);
                $scope.data1[2].values.push([rr.getTime(), item.Cost]);

              });

            });

        };

        var badkeywordsload = CampaignModel.customQuery({
            campaign: $stateParams.campaign,
            startDate: null,
            endDate: null,
            order: 'ASC'
          })
          .then(function (response) {

            $scope.badkeywords = response;
            $scope.selectedbadKeyword = $scope.badkeywords[0].Keyword;

          });


        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('aaSorting', [[1, 'desc']]).withButtons([
          'copyHtml5',
          'excelHtml5',
          'csvHtml5',
          'pdfHtml5'
        ]);
        $scope.dtOptions1 = DTOptionsBuilder.newOptions()
        // Active Buttons extension
        .withOption('aaSorting', [[1, 'asc']]).withButtons([
          'copy',
          'csv'
        ]);


      }
    ])
  ;
}());
