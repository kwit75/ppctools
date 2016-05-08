'use strict';

var _ = require('lodash');

/**
 * HomeController
 *
 * @description :: Server-side logic for managing Books
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = _.merge(_.cloneDeep(require('../base/Controller')), {

    gettopKPI: function gettopKPI(request, response) {

        var startDate = request.param('startDate');
        var endDate = request.param('endDate');

        var searchstring = '';

        if (typeof startDate !== 'undefined' && startDate !== null) {

            searchstring = ' and (c.`End Date` BETWEEN \'' + startDate.replace(/"/,'') + '\' AND \'' + endDate.replace(/"/,'') + '\')';

            // here comes reports with dates

            console.log('select tdata.MinDate, tdata.EndDate,(SUM(tdata.Revenue*tdata.Profit)-SUM(tdata.Cost)) AS Profit, SUM(tdata.Cost) AS Cost, SUM(tdata.Clicks) AS Clicks,' +
                ' SUM(tdata.Orders) AS Orders, SUM(tdata.Revenue) as Revenue, SUM(tdata.Impressions) AS Impressions from (SELECT MIN(c.`Start Date`) AS MinDate, MAX(c.`End Date`) ' +
                'AS EndDate, sum(c.`1-month Ordered Product Sales`) AS  Revenue, IF(((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)' +
                '/p.average_selling_price) IS NULL, m.average_profit/100, ((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)' +
                '/p.average_selling_price)) AS Profit, sum(c.`Total spend`) AS Cost, sum(c.`Impressions`) AS Impressions, sum(c.`Clicks`) AS Clicks, sum(c.`1-month Orders Placed`) ' +
                'AS Orders FROM campaignperfomancereport c, listing_reports_data p, mws m WHERE c.`Advertised SKU`= p.sku ' + searchstring + ' GROUP BY p.sku) tdata');

            sails.models.product.query('select tdata.MinDate, tdata.EndDate,(SUM(tdata.Revenue*tdata.Profit)-SUM(tdata.Cost)) AS Profit, SUM(tdata.Cost) AS Cost, SUM(tdata.Clicks) AS Clicks,' +
                ' SUM(tdata.Orders) AS Orders, SUM(tdata.Revenue) as Revenue, SUM(tdata.Impressions) AS Impressions from (SELECT MIN(c.`Start Date`) AS MinDate, MAX(c.`End Date`) ' +
                'AS EndDate, sum(c.`1-month Ordered Product Sales`) AS  Revenue, IF(((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)' +
                '/p.average_selling_price) IS NULL, m.average_profit/100, ((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)' +
                '/p.average_selling_price)) AS Profit, sum(c.`Total spend`) AS Cost, sum(c.`Impressions`) AS Impressions, sum(c.`Clicks`) AS Clicks, sum(c.`1-month Orders Placed`) ' +
                'AS Orders FROM campaignperfomancereport c, listing_reports_data p, mws m WHERE c.`Advertised SKU`= p.sku ' + searchstring + ' GROUP BY p.sku) tdata', function (err, results) {



                if (err) return response.serverError(err);
                // console.log(results);
                return response.ok(results);


            });


        } else {

            // select min dates

    //        sails.models.product.query('SELECT MIN(p.`purchase-date`)  AS MinDate, MAX(p.`purchase-date`)  AS EndDate  FROM sales_reports_data p', function (err, result) {

         //       sails.models.product.query('SELECT MIN(c.`Start Date`) AS MinDate, MAX(c.`End Date`) AS EndDate  FROM campaignperfomancereport c', function (err, results) {

                    // here we compare dates

                    var sDate = '';
                    var eDate = '';

                    /*     var sdmin = new Date(results[0].MinDate);
                    var sdmax = new Date(results[0].EndDate);
                         var pdmin = new Date(results[0].MinDate);
                    var pdmax = new Date(results[0].EndDate);

                    if (sdmin > pdmin) sDate = sdmin.toISOString().substring(0, 10); else sDate = pdmin.toISOString().substring(0, 10);
                    if (sdmax < pdmax) eDate = sdmax.toISOString().substring(0, 10); else eDate = pdmax.toISOString().substring(0, 10);*/
              //      var searchstring1 = ' WHERE (c.`End Date` BETWEEN \'' + results[0].MinDate + '\' AND \'' + results[0].EndDate + '\')';


                    // now we have dates, can continue

                    sails.models.product.query('select tdata.MinDate, tdata.EndDate,(SUM(tdata.Revenue*tdata.Profit)-SUM(tdata.Cost)) AS Profit, SUM(tdata.Cost) AS Cost, SUM(tdata.Clicks) AS Clicks,' +
                        ' SUM(tdata.Orders) AS Orders, SUM(tdata.Revenue) as Revenue, SUM(tdata.Impressions) AS Impressions from (SELECT MIN(c.`Start Date`) AS MinDate, MAX(c.`End Date`) ' +
                        'AS EndDate, sum(c.`1-month Ordered Product Sales`) AS  Revenue, IF(((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)' +
                        '/p.average_selling_price) IS NULL, m.average_profit/100, ((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)' +
                        '/p.average_selling_price)) AS Profit, sum(c.`Total spend`) AS Cost, sum(c.`Impressions`) AS Impressions, sum(c.`Clicks`) AS Clicks, sum(c.`1-month Orders Placed`) ' +
                        'AS Orders FROM campaignperfomancereport c, listing_reports_data p, mws m WHERE c.`Advertised SKU`= p.sku GROUP BY p.sku) tdata', function (err, results1) {

                        // merging with sales reports
                        // now we detect sales report dates


                        if (err) return response.serverError(err);
                        // console.log(results);
                        return response.ok(results1);
                    });

      //          });
     //       });
        }


    },


    gettopSKU: function gettopSKU(request, response) {
        var startDate = request.param('startDate');
        var endDate = request.param('endDate');
        var searchstring = '';


        if (typeof startDate !== 'undefined' && startDate !== null) {

            searchstring = ' and (c.`End Date` BETWEEN \'' + startDate.replace(/"/,'') + '\' AND \'' + endDate.replace(/"/,'') + '\')';
        }
        sails.models.product.query('SELECT p.id , (p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)/p.average_selling_price as Profit, ' +
            'p.`product-name` as Product, c.`Advertised SKU` AS SKU,  sum(c.`1-month Ordered Product Sales`) AS  Revenue, sum(c.`Total spend`) AS Cost, ' +
            'sum(c.`Impressions`) AS Impressions, ' +
            'sum(c.`Clicks`) AS Clicks, sum(c.`1-month Orders Placed`) AS Orders FROM campaignperfomancereport c, listing_reports_data p WHERE c.`Advertised SKU`= p.sku' + searchstring + ' GROUP BY c.`Advertised SKU`', function (err, results) {
            if (err) return response.serverError(err);
            // console.log(results);





              return response.ok(results);


        });

    },
    getChart: function getChart(request, response) {
        var startDate = request.param('startDate');
        var endDate = request.param('endDate');
        var searchstring = '';

        if (typeof startDate !== 'undefined' && startDate !== null) {

            searchstring = ' and (c.`End Date` BETWEEN \'' + startDate.replace(/"/,'') + '\' AND \'' + endDate.replace(/"/,'') + '\')';
        }



        sails.models.product.query('select tdata.EndDate, (SUM(tdata.Revenue*tdata.Profit)-SUM(tdata.Cost)) AS Profit, SUM(tdata.Cost) AS Cost, SUM(tdata.Clicks) AS Clicks, SUM(tdata.Orders) AS Orders, SUM(tdata.Revenue) as Revenue,' +
            ' SUM(tdata.Impressions) AS Impressions from ' +
            '(SELECT p.id, p.sku, IF(((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)/p.average_selling_price) IS NULL, ' +
            'm.average_profit/100, ((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)/p.average_selling_price)) AS Profit,' +
            ' c.`End Date` AS EndDate, sum(c.`1-month Ordered Product Sales`) AS  Revenue, sum(c.`Total spend`) AS Cost, sum(c.`Impressions`) AS Impressions, ' +
            'sum(c.`Clicks`) AS Clicks, sum(c.`1-month Orders Placed`) AS Orders FROM campaignperfomancereport c , listing_reports_data p, mws m WHERE c.`Advertised SKU`= p.sku' + searchstring +
            ' GROUP BY c.`End Date`, p.sku ORDER BY c.`End Date`) tdata GROUP BY tdata.EndDate', function (err, results) {
            if (err) return response.serverError(err);
            // console.log(results);
            return response.ok(results);


        });


    },
    gettopCampaigns: function gettopCampaigns(request, response) {
        var startDate = request.param('startDate');
        var endDate = request.param('endDate');
        var searchstring = '';

        if (typeof startDate !== 'undefined' && startDate !== null) {

            searchstring = ' AND (c.`End Date` BETWEEN \'' + startDate.replace(/"/,'') + '\' AND \'' + endDate.replace(/"/,'') + '\')';
        }
        sails.models.product.query('select tdata.Campaign, (SUM(tdata.Revenue*tdata.Profit)-SUM(tdata.Cost)) AS Profit, SUM(tdata.Cost) AS Cost, SUM(tdata.Clicks) AS Clicks, SUM(tdata.Orders) AS Orders, SUM(tdata.Revenue) as Revenue,' +
            ' SUM(tdata.Impressions) AS Impressions from ' +
            '(SELECT p.id, p.sku, IF(((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)/p.average_selling_price)' +
            ' IS NULL, ' +
            'm.average_profit/100, ((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)/p.average_selling_price)) AS Profit, c.`Campaign Name` AS Campaign, sum(c.`1-month Ordered Product Sales`) AS  Revenue, sum(c.`Total spend`) AS Cost, sum(c.`Impressions`) AS Impressions, ' +
            'sum(c.`Clicks`) AS Clicks, sum(c.`1-month Orders Placed`) AS Orders FROM campaignperfomancereport c, listing_reports_data p, mws m WHERE c.`Advertised SKU`= p.sku ' + searchstring +
            'GROUP BY c.`Campaign Name`, p.sku ORDER BY Revenue DESC) tdata GROUP BY tdata.Campaign', function (err, results) {
            if (err) return response.serverError(err);
            // console.log(results);
            return response.ok(results);
        });


    }


});
