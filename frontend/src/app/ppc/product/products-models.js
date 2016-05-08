/**
 * This file contains all necessary Angular model definitions for 'frontend.examples.book' module.
 *
 * Note that this file should only contain models and nothing else. Also note that these "models" are just basically
 * services that wraps all things together.
 */
(function () {
  'use strict';

  /**
   * Model for Book API, this is used to wrap all Book objects specified actions and data change actions.
   */
  angular.module('frontend.ppc.product')
    .filter("asDate", function () {
      return function (input) {
        return new Date(input);
      }
    })
    .factory('ProductModel', [
      'DataModel', 'DataService',
      function factory(
        DataModel, DataService
      ) {
        var model = new DataModel('product');

        model.customQuery = function customQuery(data) {
          var self = this;

          return DataService
            .collection(self.endpoint + '/customQuery/', data)
            .then(
              function onSuccess(response) {
                return response.data;
              },
              function onError(error) {
                $log.error('ProductModel.customQuery() failed.', error, self.endpoint, type);
              }
            )
            ;
        };

        model.update_margins = function update_margins(data) {
          var self = this;

          return DataService
            .collection(self.endpoint + '/update_margins/', data)
            .then(
              function onSuccess(response) {
                return response.data;
              },
              function onError(error) {
                $log.error('ProductModel.update_margins() failed.', error, self.endpoint, type);
              }
            )
            ;
        };

        model.getbyID = function getbyID(data) {
          var self = this;

          return DataService
            .collection(self.endpoint + '/getbyID/', data)
            .then(
              function onSuccess(response) {
                return response.data;
              },
              function onError(error) {
                $log.error('ProductModel.getbyID() failed.', error, self.endpoint, type);
              }
            )
            ;
        };
        model.gettopKPI = function gettopKPI(data) {
          var self = this;

          return DataService
            .collection(self.endpoint + '/gettopKPI/', data)
            .then(
              function onSuccess(response) {
                return response.data;
              },
              function onError(error) {
                $log.error('HomeModel.gettopKPI() failed.', error, self.endpoint, type);
              }
            )
            ;
        };
        model.getChart = function getChart(data) {
          var self = this;

          return DataService
            .collection(self.endpoint + '/getChart/', data)
            .then(
              function onSuccess(response) {
                return response.data;
              },
              function onError(error) {
                $log.error('ProductModel.getChart() failed.', error, self.endpoint, type);
              }
            )
            ;
        };

        model.getChartbyKeyword = function getChartbyKeyword(data) {
          var self = this;

          return DataService
            .collection(self.endpoint + '/getChartbyKeyword/', data)
            .then(
              function onSuccess(response) {
                return response.data;
              },
              function onError(error) {
                $log.error('ProductModel.getChartbyKeyword() failed.', error, self.endpoint, type);
              }
            )
            ;
        };

        model.getallSKUs = function getallSKUs(data) {
          var self = this;

          return DataService
            .collection(self.endpoint + '/getallSKUs/', data)
            .then(
              function onSuccess(response) {
                return response.data;
              },
              function onError(error) {
                $log.error('ProductModel.getallSKUs() failed.', error, self.endpoint, type);
              }
            )
            ;
        };

        model.getalltests = function getalltests(data) {
          var self = this;

          return DataService
            .collection(self.endpoint + '/getalltests/', data)
            .then(
              function onSuccess(response) {
                return response.data;
              },
              function onError(error) {
                $log.error('ProductModel.getalltests() failed.', error, self.endpoint, type);
              }
            )
            ;
        };

        model.gettestbyID = function gettestbyID(data) {
          var self = this;

          return DataService
            .collection(self.endpoint + '/gettestbyID/', data)
            .then(
              function onSuccess(response) {
                return response.data;
              },
              function onError(error) {
                $log.error('ProductModel.gettestbyID() failed.', error, self.endpoint, type);
              }
            )
            ;
        };

        model.savenewtest = function savenewtest(data) {
          var self = this;

          return DataService
            .collection(self.endpoint + '/savenewtest/', data)
            .then(
              function onSuccess(response) {
                return response.data;
              },
              function onError(error) {
                $log.error('ProductModel.savenewtest() failed.', error, self.endpoint, type);
              }
            )
            ;
        };


        model.getbackend = function getbackend(data) {
          var self = this;

          return DataService
            .collection(self.endpoint + '/getbackend/', data)
            .then(
              function onSuccess(response) {
                return response.data;
              },
              function onError(error) {
                $log.error('ProductModel.getbackend() failed.', error, self.endpoint, type);
              }
            )
            ;
        };

        model.update_backend = function update_backend(data) {
          var self = this;

          return DataService
            .collection(self.endpoint + '/update_backend/', data)
            .then(
              function onSuccess(response) {
                return response.data;
              },
              function onError(error) {
                $log.error('ProductModel.update_backend() failed.', error, self.endpoint, type);
              }
            )
            ;
        };

        model.getabtestsstats = function getabtestsstats(data) {
          var self = this;

          return DataService
            .collection(self.endpoint + '/getabtestsstats/', data)
            .then(
              function onSuccess(response) {
                return response.data;
              },
              function onError(error) {
                $log.error('ProductModel.getabtestsstats() failed.', error, self.endpoint, type);
              }
            )
            ;
        };




        return model;

      }
    ])
  ;
}());
