/**
 * Angular module for frontend.examples.about component. Basically this file contains actual angular module initialize
 * and route definitions for this module.
 */
(function() {
  'use strict';

  // Define frontend.public module
  angular.module('frontend.ppc.power', []);

  // Module configuration
  angular.module('frontend.ppc.power')
    .config([
      '$stateProvider',
      function($stateProvider) {
        $stateProvider
          .state('ppc.power', {
            url: '/power',
            data: {
              access: 0
            },
            views: {
              'content@': {
                templateUrl: '/frontend/ppc/power/power.html',
                controller: 'PowerController'
              },
              'pageNavigation@': false
            }
          })
          // Single campaign
          .state('ppc.powers', {
            url: '/ppc/powers',
            views: {
              'content@': {
                templateUrl: '/frontend/ppc/power/powers.html',
                controller: 'SinglePowerController'
              },
              'pageNavigation@': false
            }
          })
        ;

      }
    ])
  ;
}());
