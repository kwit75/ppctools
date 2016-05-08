/**
 * This file contains all necessary Angular controller definitions for 'frontend.ppc.product' module.
 *
 * Note that this file should only contain controllers and nothing else.
 */
(function () {
  'use strict';

  // Controller to show single product on GUI.
  angular.module('frontend.ppc.home')
    .controller('HomeController', ['$scope', '$state', '$stateParams',
      'UserService', 'MessageService', 'HomeModel',
      'ListConfig', 'SocketHelperService', 'DTOptionsBuilder'
      , function ($scope, $state, $stateParams,
                  UserService, MessageService, HomeModel,
                  ListConfig, SocketHelperService, DTOptionsBuilder) {
        // Set current scope reference to model
        //      SettingsModel.setScope($scope, 'settings');
        //  CampaignPerfomanceReportModel.setScope($scope, false, 'items', 'itemCount');
        // Initialize scope data
        $scope.user = UserService.user();
        console.log($scope.user);
        // Set current scope reference to models
        // Initialize filters

        //ondata change


        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('aaSorting', [[1, 'desc']]);
        $scope.dtOptions1 = DTOptionsBuilder.newOptions().withOption('aaSorting', [[1, 'desc']]);

        var KPI = HomeModel.gettopKPI({startDate: null, endDate: null})
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
            $scope.upprofit=$scope.KPI.Profit;

            var data2 = [
              ['Gross Revenue', $scope.KPI.Revenue],
              ['Net Revenue', $scope.KPI.Revenue-$scope.KPI.Cost],
              ['Ad Spend', $scope.KPI.Cost],
              ['Profit', $scope.KPI.Profit]
            ];

            var options2 = {
              chart: {width: 400, height: 400, bottomPinch:1}
            };

            var chart = new D3Funnel('#funnel');
            chart.draw(data2, options2);

          });

        var topsku = HomeModel.gettopSKU({startDate: null, endDate: null})
          .then(function (response) {

            $scope.topSKU = response;

          });
        var topcampaigns = HomeModel.gettopCampaigns({startDate: null, endDate: null})
          .then(function (response) {

            $scope.topCampaigns = response;

          });





        var charts = HomeModel.getChart({startDate: null, endDate: null})
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


              var KPI = HomeModel.gettopKPI($scope.datePicker.date)
                .then(function (response) {

                  $scope.KPI = response[0];
                  $scope.uprevenue = $scope.KPI.Revenue;
                  $scope.upcost = $scope.KPI.Cost;
                  $scope.upacos = $scope.KPI.Cost / $scope.KPI.Revenue * 100;
                  $scope.upcpc = $scope.KPI.Cost / $scope.KPI.Clicks;
                  $scope.upimpressions = $scope.KPI.Impressions;
                  $scope.upctr = $scope.KPI.Clicks / $scope.KPI.Impressions * 100;
                  $scope.upclicks = $scope.KPI.Clicks;
                  $scope.upcr = $scope.KPI.Orders / $scope.KPI.Clicks * 100;
                  $scope.upprofit=$scope.KPI.Profit;

                  var data2 = [
                    ['Gross Revenue', $scope.KPI.Revenue],
                    ['Net Revenue', $scope.KPI.Revenue-$scope.KPI.Cost],
                    ['Ad Spend', $scope.KPI.Cost],
                    ['Profit', $scope.KPI.Profit],
                  ];

                  var options2 = {
                    chart: {width: 400, height: 400, bottomPinch:1}
                  };

                  var chart = new D3Funnel('#funnel');
                  chart.draw(data2, options2);


                });

              var topsku = HomeModel.gettopSKU($scope.datePicker.date)
                .then(function (response) {

                  $scope.topSKU = response;

                });

              var topcampaigns = HomeModel.gettopCampaigns($scope.datePicker.date)
                .then(function (response) {

                  $scope.topCampaigns = response;

                });

              var charts = HomeModel.getChart($scope.datePicker.date)
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


            }
          }
        };


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
        /*       forceY: [100],
         yDomain: [0, d3.max(d, function (d) { return d.v; }) ],
         yRange: [0,10]
         yScale.domain([0, d3.max(data, function (d) { return d.v; }) ]);
         */

        $scope.data = [];


        //   $scope.itemCount = _count.count;


        // Assign this to a variable
        var self = this;

        // Get our center id
        self.centerId = $stateParams.centerId;

      }])
  ;

}());
