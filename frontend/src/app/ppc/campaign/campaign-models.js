/**
 * This file contains all necessary Angular model definitions for 'frontend.examples.book' module.
 *
 * Note that this file should only contain models and nothing else. Also note that these "models" are just basically
 * services that wraps all things together.
 */
(function () {
  'use strict';


  angular.module('frontend.ppc.campaign')
    .factory('CampaignModel', [
      'DataModel', 'DataService',
      function factory(
        DataModel, DataService
      ) {
        var model = new DataModel('campaign');

        model.update_acos = function update_acos(data) {
          var self = this;

          return DataService
            .collection(self.endpoint + '/update_acos/', data)
            .then(
              function onSuccess(response) {
                return response.data;
              },
              function onError(error) {
                $log.error('CampaignModel.update_acos() failed.', error, self.endpoint, type);
              }
            )
            ;
        };


        model.gettopCampaigns = function gettopCampaigns(data) {
          var self = this;

          return DataService
            .collection(self.endpoint + '/gettopCampaigns/', data)
            .then(
              function onSuccess(response) {
                return response.data;
              },
              function onError(error) {
                $log.error('CampaignModel.gettopCampaigns() failed.', error, self.endpoint, type);
              }
            )
            ;
        };

        model.getChartbyCampaign = function getChartbyCampaign(data) {
          var self = this;

          return DataService
            .collection(self.endpoint + '/getChartbyCampaign/', data)
            .then(
              function onSuccess(response) {
                return response.data;
              },
              function onError(error) {
                $log.error('CampaignModel.getChartbyCampaign() failed.', error, self.endpoint, type);
              }
            )
            ;
        };

        model.customQuery = function customQuery(data) {
          var self = this;

          return DataService
            .collection(self.endpoint + '/customQuery/', data)
            .then(
              function onSuccess(response) {
                return response.data;
              },
              function onError(error) {
                $log.error('CampaignModel.customQuery() failed.', error, self.endpoint, type);
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
                $log.error('CampaignModel.gettopKPI() failed.', error, self.endpoint, type);
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
                $log.error('CampaignModel.getChartbyKeyword() failed.', error, self.endpoint, type);
              }
            )
            ;
        };

        model.searchbyACoS = function searchbyACoS(data) {
          var self = this;

          return DataService
            .collection(self.endpoint + '/searchbyACoS/', data)
            .then(
              function onSuccess(response) {
                return response.data;
              },
              function onError(error) {
                $log.error('CampaignModel.searchbyACoS() failed.', error, self.endpoint, type);
              }
            )
            ;
        };

        model.searchbyACoSmult = function searchbyACoSmult(data) {
          var self = this;

          return DataService
            .collection(self.endpoint + '/searchbyACoSmult/', data)
            .then(
              function onSuccess(response) {
                return response.data;
              },
              function onError(error) {
                $log.error('CampaignModel.searchbyACoSmult() failed.', error, self.endpoint, type);
              }
            )
            ;
        };

        model.searchbyACoSmult1 = function searchbyACoSmult1(data) {
          var self = this;

          return DataService
            .collection(self.endpoint + '/searchbyACoSmult1/', data)
            .then(
              function onSuccess(response) {
                return response.data;
              },
              function onError(error) {
                $log.error('CampaignModel.searchbyACoSmult1() failed.', error, self.endpoint, type);
              }
            )
            ;
        };

        model.getallskus = function getallskus(data) {
          var self = this;

          return DataService
            .collection(self.endpoint + '/getallskus/', data)
            .then(
              function onSuccess(response) {
                return response.data;
              },
              function onError(error) {
                $log.error('CampaignModel.getallskus() failed.', error, self.endpoint, type);
              }
            )
            ;
        };



        model.removekeywords = function removekeywords(data) {
          var self = this;

          return DataService
            .collection(self.endpoint + '/removekeywords/', data)
            .then(
              function onSuccess(response) {
                return response.data;
              },
              function onError(error) {
                $log.error('CampaignModel.removekeywords() failed.', error, self.endpoint, type);
              }
            )
            ;
        };

        model.getbelowacos = function getbelowacos(data) {
          var self = this;

          return DataService
            .collection(self.endpoint + '/getbelowacos/', data)
            .then(
              function onSuccess(response) {
                return response.data;
              },
              function onError(error) {
                $log.error('CampaignModel.getbelowacos() failed.', error, self.endpoint, type);
              }
            )
            ;
        };



        model.getallcampaigns = function getallcampaigns(data) {
          var self = this;

          return DataService
            .collection(self.endpoint + '/getallcampaigns/', data)
            .then(
              function onSuccess(response) {
                return response.data;
              },
              function onError(error) {
                $log.error('CampaignModel.getallcampaigns() failed.', error, self.endpoint, type);
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
                $log.error('CampaignModel.getallSKUs() failed.', error, self.endpoint, type);
              }
            )
            ;
        };







        return model;
      }
    ])
  ;
}());
