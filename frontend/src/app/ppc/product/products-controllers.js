/**
 * This file contains all necessary Angular controller definitions for 'frontend.ppc.product' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
  'use strict';

  // Controller to show single product on GUI.
  angular.module('frontend.ppc.product')
    .controller('ProductController', [
      '$scope', '$state', '$stateParams',
      'UserService', 'MessageService','$http',
      'ProductModel', 'CampaignPerfomanceReportModel', 'DTOptionsBuilder',
      function controller($scope, $state, $stateParams,
                          UserService, MessageService,$http,
                          ProductModel, CampaignPerfomanceReportModel, DTOptionsBuilder) {

        $scope.user = UserService.user();
        // Set current scope reference to models


        $scope.toggleOne = function toggleOne(selectedItems) {
          for (var id in selectedItems) {
            if (selectedItems.hasOwnProperty(id)) {
              if (!selectedItems[id]) {
//                vm.selectAll = false;
                return;
              }
            }
          }
          //         vm.selectAll = true;
        };

        $scope.show = {};
        $scope.dtInstance = {};

        $scope.changestats = function (keyword) {
          $scope.selectedKeyword = keyword;
          var getChartbyKeyword = ProductModel.getChartbyKeyword({
              keyword: keyword,
              id: $stateParams.id,
              startDate: $scope.datePicker.date.startDate,
              endDate: $scope.datePicker.date.endDate
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

            });

        };

        $scope.dtOptions2 = DTOptionsBuilder.newOptions().withOption('aaSorting', [[1, 'desc']]).withButtons([
          'copy',
          'csv'
        ]);

        var KPI = ProductModel.gettopKPI({id: $stateParams.id, startDate: null, endDate: null})
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

            var data2 = [
              ['Gross Revenue', $scope.KPI.Revenue],
              ['Net Revenue', $scope.KPI.Revenue - $scope.KPI.Cost],
              ['Ad Spend', $scope.KPI.Cost],
              ['Profit', $scope.KPI.Profit]
            ];

            var options2 = {
              chart: {width: 400, height: 400, bottomPinch: 1}
            };

            var chart = new D3Funnel('#funnel');
            chart.draw(data2, options2);

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


              var KPI = ProductModel.gettopKPI({
                  id: $stateParams.id,
                  startDate: $scope.datePicker.date.startDate,
                  endDate: $scope.datePicker.date.endDate
                })
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

                  var data2 = [
                    ['Gross Revenue', $scope.KPI.Revenue],
                    ['Net Revenue', $scope.KPI.Revenue - $scope.KPI.Cost],
                    ['Ad Spend', $scope.KPI.Cost],
                    ['Profit', $scope.KPI.Profit]
                  ];

                  var options2 = {
                    chart: {width: 400, height: 400, bottomPinch: 1}
                  };

                  var chart = new D3Funnel('#funnel');
                  chart.draw(data2, options2);

                });

              var charts = ProductModel.getChart({
                  id: $stateParams.id,
                  startDate: $scope.datePicker.date.startDate,
                  endDate: $scope.datePicker.date.endDate
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

              var byid = ProductModel.getbyID({
                  id: $stateParams.id,
                  startDate: $scope.datePicker.date.startDate,
                  endDate: $scope.datePicker.date.endDate
                })
                .then(function (response) {

                  $scope.product = response[0];

                  var keywordsload = ProductModel.customQuery({
                      id: $stateParams.id,
                      startDate: $scope.datePicker.date.startDate,
                      endDate: $scope.datePicker.date.endDate,
                      order: 'DESC'
                    })
                    .then(function (response) {

                      $scope.keywords = response;
                      $scope.selectedKeyword = $scope.keywords[0].Keyword;

                      var getChartbyKeyword = ProductModel.getChartbyKeyword({
                          keyword: $scope.selectedKeyword,
                          id: $stateParams.id,
                          startDate: $scope.datePicker.date.startDate,
                          endDate: $scope.datePicker.date.endDate
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

                        });
                    });


                  var badkeywordsload = ProductModel.customQuery({
                      id: $stateParams.id,
                      startDate: $scope.datePicker.date.startDate,
                      endDate: $scope.datePicker.date.endDate,
                      order: 'ASC'
                    })
                    .then(function (response) {

                      $scope.badkeywords = response;
                      $scope.selectedbadKeyword = $scope.badkeywords[0].Keyword;

                      var getChartbyKeyword = ProductModel.getChartbyKeyword({
                          keyword: $scope.selectedbadKeyword,
                          id: $stateParams.id,
                          startDate: $scope.datePicker.date.startDate,
                          endDate: $scope.datePicker.date.endDate
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

                        });
                    });

                });


            }
          }
        };
        $scope.update_backend = function () {
          var update_backend = ProductModel.update_backend({
              id: $stateParams.id,
              backend1: $scope.product.backend_keywords1,
              backend2: $scope.product.backend_keywords2,
              backend3: $scope.product.backend_keywords3,
              backend4: $scope.product.backend_keywords4,
              backend5: $scope.product.backend_keywords5
            })
            .then(function (response) {

              MessageService.success('Saved.');

            });
        };

        $scope.load_backend = function () {
          var getbackend = ProductModel.getbackend({id: $stateParams.id})
            .then(function (response) {

              console.log(response);
              $scope.backend = response;

            });
        };

        $scope.add_backend = function () {

          var i = 0;
          for (var j = 0; j < $scope.backend.length * 10000; j++) {


            if (typeof  $scope.product.backend_keywords1 === 'undefined' || !$scope.product.backend_keywords1 || $scope.product.backend_keywords1.length < 1000 - $scope.backend[i][0].length) {
              if (typeof  $scope.product.backend_keywords1 === 'undefined' || !$scope.product.backend_keywords1) $scope.product.backend_keywords1 = $scope.backend[i][0];
              else $scope.product.backend_keywords1 += ' ' + $scope.backend[i][0];
              $scope.backend.splice(i, 1);
            }
            else {
              if (typeof  $scope.product.backend_keywords2 === 'undefined' || !$scope.product.backend_keywords2 || $scope.product.backend_keywords2.length < 1000 - $scope.backend[i][0].length) {
                if (typeof  $scope.product.backend_keywords2 === 'undefined' || !$scope.product.backend_keywords2) $scope.product.backend_keywords2 = $scope.backend[i][0];
                else $scope.product.backend_keywords2 += ' ' + $scope.backend[i][0];
                $scope.backend.splice(i, 1);
              } else {
                if (typeof  $scope.product.backend_keywords3 === 'undefined' || !$scope.product.backend_keywords3 || $scope.product.backend_keywords3.length < 1000 - $scope.backend[i][0].length) {
                  if (typeof  $scope.product.backend_keywords3 === 'undefined' || !$scope.product.backend_keywords3) $scope.product.backend_keywords3 = $scope.backend[i][0];
                  else $scope.product.backend_keywords3 += ' ' + $scope.backend[i][0];
                  $scope.backend.splice(i, 1);
                } else {
                  if (typeof  $scope.product.backend_keywords4 === 'undefined' || !$scope.product.backend_keywords4 || $scope.product.backend_keywords4.length < 1000 - $scope.backend[i][0].length) {
                    if (typeof  $scope.product.backend_keywords4 === 'undefined' || !$scope.product.backend_keywords4) $scope.product.backend_keywords4 = $scope.backend[i][0];
                    else $scope.product.backend_keywords4 += ' ' + $scope.backend[i][0];
                    $scope.backend.splice(i, 1);
                  } else {
                    if (typeof  $scope.product.backend_keywords5 === 'undefined' || !$scope.product.backend_keywords5 || $scope.product.backend_keywords5.length < 1000 - $scope.backend[i][0].length) {
                      if (typeof  $scope.product.backend_keywords5 === 'undefined' || !$scope.product.backend_keywords5) $scope.product.backend_keywords5 = $scope.backend[i][0];
                      else $scope.product.backend_keywords5 += ' ' + $scope.backend[i][0];
                      $scope.backend.splice(i, 1);
                    } else {
                      MessageService.success('No more space. Stopped');
                      return;
                    }
                  }
                }

              }

            }

          }
          MessageService.success('All keywords were added to backend');
        };

        $scope.categories = [
          {id: 0, name: "Select a field..."},
          {id: 1, name: "Title"},
          {id: 2, name: "Summary"},
          {id: 3, name: "Photos"},
          {id: 4, name: "Bullets"},
          {id: 5, name: "Backend keywords"},
          {id: 6, name: "Price"},
          {id: 7, name: "Discount"},
          {id: 8, name: "Coupon"}
        ];

        $scope.itemSelected = $scope.categories[0];

        $scope.onCategoryChange = function () {

          $scope.show = {};

          switch ($scope.itemSelected.id) {
            case 1:
              $scope.show.ti = 1;
              break;
            case 2:
              $scope.show.su = 1;
              break;
            case 3:
              $scope.show.ph = 1;
              break;
            case 4:
              $scope.show.bu = 1;
              break;
            case 5:
              $scope.show.ba = 1;
              break;
            case 6:
              $scope.show.pr = 1;
              break;
            case 7:
              $scope.show.di = 1;
              break;
            case 8:
              $scope.show.co = 1;
              break;

          }
          $scope.show.bt = 1;

        };

        var alltests = ProductModel.getalltests({id: $stateParams.id})
          .then(function (response) {
            $scope.abtest = response;
          });
        var charts = ProductModel.getChart({id: $stateParams.id, startDate: null, endDate: null})
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


        var byid = ProductModel.getbyID({id: $stateParams.id, startDate: null, endDate: null})
          .then(function (response) {

            $scope.product = response[0];


            var keywordsload = ProductModel.customQuery({
                id: $stateParams.id,
                startDate: null,
                endDate: null,
                order: 'DESC'
              })
              .then(function (response) {

                $scope.keywords = response;
                $scope.selectedKeyword = $scope.keywords[0].Keyword;

                var getChartbyKeyword = ProductModel.getChartbyKeyword({
                    keyword: $scope.keywords[0].Keyword,
                    id: $stateParams.id,
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

            var badkeywordsload = ProductModel.customQuery({
                id: $stateParams.id,
                startDate: null,
                endDate: null,
                order: 'ASC'
              })
              .then(function (response) {

                $scope.badkeywords = response;
                $scope.selectedbadKeyword = $scope.badkeywords[0].Keyword;

                var getChartbyKeyword = ProductModel.getChartbyKeyword({
                    keyword: $scope.badkeywords[0].Keyword,
                    id: $stateParams.id,
                    startDate: null,
                    endDate: null
                  })
                  .then(function (response) {


                  });
              });
          });


        $scope.save_test = function () {

          // check for required fields
          if (typeof $scope.abtests.name !== 'undefined' && $scope.abtests.name !== null) {
            if (typeof $scope.show === 'undefined' || $scope.show === null) $scope.show = {};


            var savetest = ProductModel.savenewtest({
                before_backend1: $scope.abtests.before_backend1,
                before_backend2: $scope.abtests.before_backend2,
                before_backend3: $scope.abtests.before_backend3,
                before_backend4: $scope.abtests.before_backend4,
                before_backend5: $scope.abtests.before_backend5,
                before_bullet1: $scope.abtests.before_bullet1,
                before_bullet2: $scope.abtests.before_bullet2,
                before_bullet3: $scope.abtests.before_bullet3,
                before_bullet4: $scope.abtests.before_bullet4,
                before_bullet5: $scope.abtests.before_bullet5,
                before_coupon: $scope.abtests.before_coupon,
                before_discount: $scope.abtests.before_discount,
                before_photo1: $scope.abtests.before_photo1,
                before_photo2: $scope.abtests.before_photo2,
                before_photo3: $scope.abtests.before_photo3,
                before_photo4: $scope.abtests.before_photo4,
                before_photo5: $scope.abtests.before_photo5,
                before_photo6: $scope.abtests.before_photo6,
                before_photo7: $scope.abtests.before_photo7,
                before_photo8: $scope.abtests.before_photo8,
                before_photo9: $scope.abtests.before_photo9,
                before_price: $scope.abtests.before_price,
                before_summary: $scope.abtests.before_summary,
                before_title: $scope.abtests.before_title,
                after_backend1: $scope.abtests.after_backend1,
                after_backend2: $scope.abtests.after_backend2,
                after_backend3: $scope.abtests.after_backend3,
                after_backend4: $scope.abtests.after_backend4,
                after_backend5: $scope.abtests.after_backend5,
                after_bullet1: $scope.abtests.after_bullet1,
                after_bullet2: $scope.abtests.after_bullet2,
                after_bullet3: $scope.abtests.after_bullet3,
                after_bullet4: $scope.abtests.after_bullet4,
                after_bullet5: $scope.abtests.after_bullet5,
                after_coupon: $scope.abtests.after_coupon,
                after_discount: $scope.abtests.after_discount,
                after_photo1: $scope.abtests.after_photo1,
                after_photo2: $scope.abtests.after_photo2,
                after_photo3: $scope.abtests.after_photo3,
                after_photo4: $scope.abtests.after_photo4,
                after_photo5: $scope.abtests.after_photo5,
                after_photo6: $scope.abtests.after_photo6,
                after_photo7: $scope.abtests.after_photo7,
                after_photo8: $scope.abtests.after_photo8,
                after_photo9: $scope.abtests.after_photo9,
                after_price: $scope.abtests.after_price,
                after_summary: $scope.abtests.after_summary,
                after_title: $scope.abtests.after_title,
                sku: $scope.product.sku,
                name: $scope.abtests.name,
                before_timeframe: $scope.abtests.before_timeframe

              })
              .then(function (response) {
                MessageService.success('Test saved');
                $scope.show={};
                $scope.show.sav = true;

                $scope.dtInstance.rerender();

              });

          } else MessageService.error('Test name required');

        };

        function isNumeric(n) {
          return !isNaN(parseFloat(n)) && isFinite(n);
        }

        $scope.removenumbers = function () {

          for (var i = $scope.backend.length - 1; i >= 0; i--) {
            if (isNumeric($scope.backend[i][0])) {
              $scope.backend.splice(i, 1);
            }
          }


        };

        $scope.uploadFile = function (a,files) {



          var fd = new FormData();
          //Take the first selected file
          fd.append("0", files[0]);

          $http.post('http://138.201.48.85:1337/api/uploadphoto', fd, {
            withCredentials: true,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
          }).success(function (data) {
            console.log(data);
            $scope.abtests[a]=data.files[0].fd;
            console.log($scope.abtests);
              MessageService.success('Picture uploaded.');
            }
          ).error();

        };

        $scope.add_test = function () {

          // clear everyting

          delete $scope.abtests;
          delete $scope.show;

          $scope.abtests = {};
          $scope.show = {};
          $scope.abtests.before_timeframe = 14;


        };

        $scope.test_show = function (id) {

          // clear everyting

          delete $scope.abtests;
          delete $scope.show;

          $scope.abtests = {};
          $scope.show = {};

          var testbyID = ProductModel.gettestbyID({id: id})
            .then(function (response) {
              $scope.abtests = response[0];
              $scope.show.sav = true;
              var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
              var firstDate = new Date($scope.abtests.to_date);
              var secondDate = new Date();

              $scope.abtests.before_timeframe = Math.round(((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
              console.log($scope.abtests);

              // load stats

            //  22.04.2016 1:51:43

              var testbyIDa = ProductModel.getabtestsstats({id: $stateParams.id,
                startDate: moment($scope.abtests.from_date).subtract('days', 14),
                endDate: moment($scope.abtests.from_date)}).then(function (Before_response) {

                $scope.before_KPI = Before_response[0];

                $scope.before_uprevenue = $scope.before_KPI.Revenue;
                $scope.before_upcost = $scope.before_KPI.Cost;
                $scope.before_upacos = $scope.before_KPI.Cost / $scope.before_KPI.Revenue * 100;
                $scope.before_upcpc = $scope.before_KPI.Cost / $scope.before_KPI.Clicks;
                $scope.before_upimpressions = $scope.before_KPI.Impressions;
                $scope.before_upctr = $scope.before_KPI.Clicks / $scope.before_KPI.Impressions * 100;
                $scope.before_upclicks = $scope.before_KPI.Clicks;
                $scope.before_upcr = $scope.before_KPI.Orders / $scope.before_KPI.Clicks * 100;
                $scope.before_upprofit = $scope.before_KPI.Profit;
                $scope.before_conversion = $scope.before_KPI.Conversion*100;

              });

              var testbyIDb = ProductModel.getabtestsstats({id: $stateParams.id,
                startDate: moment($scope.abtests.from_date),
                endDate: moment($scope.abtests.to_date)}).then(function (Before_response) {

                $scope.after_KPI = Before_response[0];

                $scope.after_uprevenue = $scope.after_KPI.Revenue;
                $scope.after_upcost = $scope.after_KPI.Cost;
                $scope.after_upacos = $scope.after_KPI.Cost / $scope.after_KPI.Revenue * 100;
                $scope.after_upcpc = $scope.after_KPI.Cost / $scope.after_KPI.Clicks;
                $scope.after_upimpressions = $scope.after_KPI.Impressions;
                $scope.after_upctr = $scope.after_KPI.Clicks / $scope.after_KPI.Impressions * 100;
                $scope.after_upclicks = $scope.after_KPI.Clicks;
                $scope.after_upcr = $scope.after_KPI.Orders / $scope.after_KPI.Clicks * 100;
                $scope.after_upprofit = $scope.after_KPI.Profit;
                $scope.after_conversion = $scope.after_KPI.Conversion*100;

              });


            });


        };


        $scope.save_product = function () {
          var data = angular.copy($scope.product);
          console.log(data);

          // Make actual data update
          ProductModel
            .update_margins(data)
            .then(
              function onSuccess() {
                MessageService.success('Product "' + $scope.product["product-name"] + '" updated successfully');
              }
            )
          ;
        };

        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('aaSorting', [[1, 'desc']]).withButtons([
          'copy',
          'csv'
        ]);
        $scope.dtOptions1 = DTOptionsBuilder.newOptions().withOption('aaSorting', [[1, 'asc']]).withButtons([
          'copy',
          'csv'
        ]);
        $scope.dtOptions2 = DTOptionsBuilder.newOptions().withOption('aaSorting', [[1, 'desc']]).withButtons([
          'copy',
          'csv'
        ]);

        $scope.dateRangeOptions1 = {
          showDropdowns: true,

          alwaysShowCalendars: true
        };

      }
    ])
  ;



  // Controller which contains all necessary logic for product list GUI on boilerplate application.
  angular.module('frontend.ppc.product')
    .controller('ProductListController', [
      '$scope', 'UserService','ProductModel', 'DTOptionsBuilder',
      function controller($scope,UserService, ProductModel, DTOptionsBuilder) {


        $scope.user = UserService.user();
        // Set current scope reference to models

        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('aaSorting', [[1, 'desc']]);

        var product = ProductModel.getallSKUs({userID: 1})
          .then(function (response) {

            $scope.products = response;

          });
      }
    ])
  ;
}());
