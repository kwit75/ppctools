/**
 * Products component to wrap all products specified stuff together. This component is divided to following logical components:
 *
 *  Controllers
 *  Models
 *
 * All of these are wrapped to 'frontend.ppc.products' angular module.
 */
(function() {
  'use strict';

  // Define frontend.ppc.product angular module
  angular.module('frontend.ppc.product', []);

  // Module configuration
  angular.module('frontend.ppc.product')
    .config([
      '$stateProvider',
      function config($stateProvider) {
        $stateProvider
          // Products list
          .state('ppc.products', {
            url: '/ppc/products',
            views: {
              'content@': {
                templateUrl: '/frontend/ppc/product/list.html',
                controller: 'ProductListController'
              }
            }
          })

          // Single product
          .state('ppc.product', {
            url: '/ppc/product/:id',
            views: {
              'content@': {
                templateUrl: '/frontend/ppc/product/product.html',
                controller: 'ProductController'
              }
            }
          })
        ;
      }
    ])
  ;
}());
