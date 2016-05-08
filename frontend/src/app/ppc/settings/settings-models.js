/**
 * This file contains all necessary Angular model definitions for 'frontend.examples.book' module.
 *
 * Note that this file should only contain models and nothing else. Also note that these "models" are just basically
 * services that wraps all things together.
 */
(function () {
  'use strict';


  angular.module('frontend.ppc.settings')
    .factory('MWSModel', [
      'DataModel', 'DataService',
      function factory(DataModel,DataService) {

        var model = new DataModel('MWS');

        model.addorreplace = function addorreplace(data) {
          var self = this;

          return DataService
            .collection(self.endpoint + '/addorreplace/', data)
            .then(
              function onSuccess(response) {
                return response.data;
              },
              function onError(error) {
                $log.error('HomeModel.addorreplace() failed.', error, self.endpoint, type);
              }
            )
            ;
        };


        return model;
      }
    ])
    .factory('SettingsModel', [
      'DataModel', 'DataService',
      function factory(DataModel,DataService) {

        var model = new DataModel('settings');

        model.getvalues = function getvalues(data) {

          var self = this;

          return DataService
            .collection(self.endpoint + '/getvalues/', data)
            .then(
              function onSuccess(response) {
                return response.data;
              },
              function onError(error) {
                console.log('settings.getvalues failed.', error, self.endpoint, type);
              }
            )
            ;
        };


        model.upload = function upload(data) {

          console.log(data);
          var fd = new FormData();


          //nacho relates to what we called the file
          //in the api on sails
          fd.append('0', data);

          var self = this;

          return DataService
            .create(self.endpoint + '/upload/', fd)
            .then(
              function onSuccess(response) {
                return response.data;
              },
              function onError(error) {
                console.log('HomeModel.upload() failed.', error, self.endpoint, type);
              }
            )
            ;
        };


        return model;
      }
    ])
    .factory('CampaignPerfomanceReportModel', [
      'DataModel',
      function factory(DataModel) {
        return new DataModel('campaignperfomancereport');
      }
    ])
  ;
}());
