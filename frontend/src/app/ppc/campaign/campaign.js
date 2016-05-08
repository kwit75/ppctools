/**
 * Angular module for frontend.examples.about component. Basically this file contains actual angular module initialize
 * and route definitions for this module.
 */
(function() {
  'use strict';

  // Define frontend.public module
  angular.module('frontend.ppc.campaign', []);

  // Module configuration
  angular.module('frontend.ppc.campaign')
    .config([
      '$stateProvider',
      function($stateProvider) {
        $stateProvider
          .state('ppc.campaign', {
            url: '/campaign',
            data: {
              access: 0
            },
            views: {
              'content@': {
                templateUrl: '/frontend/ppc/campaign/campaign.html',
                controller: 'CampaignController'
              },
              'pageNavigation@': false
            }
          })
          // Single campaign
          .state('ppc.campaigns', {
            url: '/ppc/campaigns/:campaign',
            views: {
              'content@': {
                templateUrl: '/frontend/ppc/campaign/singlecampaign.html',
                controller: 'SingleCampaignController'
              },
              'pageNavigation@': false
            }
          })
        ;

      }
    ])
  ;
}());
