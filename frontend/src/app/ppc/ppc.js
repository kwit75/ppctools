/**
 * Angular module for ppc component. This component is divided to following logical components:
 *
 *
 * Each component has it own configuration for ui-router.
 */
(function() {
  'use strict';

  // Define frontend.admin module
  angular.module('frontend.ppc', [
    'frontend.ppc.home',
    'frontend.ppc.product',
    'frontend.ppc.campaign',
    'frontend.ppc.power',
    'frontend.ppc.settings'
  ]);

  // Module configuration
  angular.module('frontend.ppc')
    .config([
      '$stateProvider',
      function($stateProvider) {
        $stateProvider
          .state('ppc', {
            parent: 'frontend',
            data: {
              access: 1
            },
            views: {
              'content@': {
                controller: [
                  '$state',
                  function($state) {
                    $state.go('ppc.home');
                  }
                ]
              },
              'pageNavigation@': {
                templateUrl: '/frontend/core/layout/partials/navigation.html',
                controller: 'NavigationController',
                resolve: {
                  _items: [
                    'ContentNavigationItems',
                    function resolve(ContentNavigationItems) {
                      return ContentNavigationItems.getItems('ppc');
                    }
                  ]
                }
              }
            }
          })
        ;
      }
    ])
  ;
}());
