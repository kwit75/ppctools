'use strict';

var _ = require('lodash');


module.exports = _.merge(_.cloneDeep(require('../base/Controller')), {

    gettopCampaigns: function gettopCampaigns(request, response) {
        var startDate = request.param('startDate');
        var endDate = request.param('endDate');
        var searchstring = '';

        if (typeof startDate !== 'undefined' && startDate !== null) {

            searchstring = ' AND (c.`End Date` BETWEEN \'' + startDate.replace(/"/, '') + '\' AND \'' + endDate.replace(/"/, '') + '\') ';
        }
        sails.models.product.query('select tdata.acos1, tdata.Campaign, (SUM(tdata.Revenue*tdata.Profit)-SUM(tdata.Cost)) AS Profit, SUM(tdata.Cost) AS Cost, SUM(tdata.Clicks) AS Clicks, SUM(tdata.Orders) AS Orders, SUM(tdata.Revenue) as Revenue,' +
            ' SUM(tdata.Impressions) AS Impressions from ' +
            '(SELECT p.id, p.sku, IF(((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)/p.average_selling_price)' +
            ' IS NULL, ' +
            'm.average_profit/100, ((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)/p.average_selling_price)) AS Profit, c.`Campaign Name` AS Campaign, sum(c.`1-month Ordered Product Sales`) AS  Revenue, sum(c.`Total spend`) AS Cost, sum(c.`Impressions`) AS Impressions, ' +
            'sum(c.`Clicks`) AS Clicks, (select acos from campaigns where name = c.`Campaign Name`) as acos1, ' +
            'sum(c.`1-month Orders Placed`) AS Orders FROM campaignperfomancereport c, listing_reports_data p, mws m WHERE c.`Advertised SKU`= p.sku ' + searchstring +
            'GROUP BY c.`Campaign Name`, p.sku ORDER BY Revenue DESC) tdata GROUP BY tdata.Campaign', function (err, results) {
            if (err) return response.serverError(err);
            // console.log(results);
            return response.ok(results);
        });


    },
    getChartbyCampaign: function getChartbyCampaign(request, response) {

        var campaign = request.param('campaign');
        var startDate = request.param('startDate');
        var endDate = request.param('endDate');
        var searchstring = '';

        if (typeof startDate !== 'undefined' && startDate !== null) {

            searchstring = ' and (c.`End Date` BETWEEN \'' + startDate.replace(/"/, '') + '\' AND \'' + endDate.replace(/"/, '') + '\')';
        }

        sails.models.product.query('select tdata.id, tdata.acos1, tdata.Campaign, tdata.EndDate, (SUM(tdata.Revenue*tdata.Profit)-SUM(tdata.Cost)) AS Profit, SUM(tdata.Cost) AS Cost, SUM(tdata.Clicks) AS Clicks, SUM(tdata.Orders) AS Orders, SUM(tdata.Revenue) as Revenue,' +
            ' SUM(tdata.Impressions) AS Impressions from ' +
            '(SELECT c.`Campaign Name` as Campaign, IF(((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)/p.average_selling_price) IS NULL, ' +
            'm.average_profit/100, ((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)/p.average_selling_price)) AS Profit,' +
            ' c.`End Date` AS EndDate, sum(c.`1-month Ordered Product Sales`) AS  Revenue, sum(c.`Total spend`) AS Cost, sum(c.`Impressions`) AS Impressions, ' +
            ' (select id from campaigns where name = \'' + campaign + '\') as id, (select acos from campaigns where name = \'' + campaign + '\') as acos1, ' +
            'sum(c.`Clicks`) AS Clicks, sum(c.`1-month Orders Placed`) AS Orders FROM campaignperfomancereport c , listing_reports_data p, mws m WHERE c.`Campaign Name`=\'' + campaign + '\' and c.`Advertised SKU`= p.sku' + searchstring +
            ' GROUP BY c.`End Date`, p.sku ORDER BY c.`End Date`) tdata GROUP BY tdata.EndDate', function (err, results) {
            if (err) return response.serverError(err);
            // console.log(results);
            return response.ok(results);


        });
    },
    gettopKPI: function gettopKPI(request, response) {

        var campaign = request.param('campaign');
        var startDate = request.param('startDate');
        var endDate = request.param('endDate');

        var searchstring = '';

        if (typeof startDate !== 'undefined' && startDate !== null) {

            searchstring = ' and (c.`End Date` BETWEEN \'' + startDate.replace(/"/, '') + '\' AND \'' + endDate.replace(/"/, '') + '\')';

            // here comes reports with dates

            sails.models.product.query('select tdata.id, tdata.acos1, tdata.Campaign, tdata.MinDate, tdata.EndDate,(SUM(tdata.Revenue*tdata.Profit)-SUM(tdata.Cost)) AS Profit, SUM(tdata.Cost) AS Cost, SUM(tdata.Clicks) AS Clicks,' +
                ' SUM(tdata.Orders) AS Orders, SUM(tdata.Revenue) as Revenue, SUM(tdata.Impressions) AS Impressions from (SELECT c.`Campaign Name` as Campaign, MIN(c.`Start Date`) AS MinDate, MAX(c.`End Date`) ' +
                'AS EndDate, sum(c.`1-month Ordered Product Sales`) AS  Revenue, IF(((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)' +
                '/p.average_selling_price) IS NULL, m.average_profit/100, ((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)' +
                '/p.average_selling_price)) AS Profit, (select id from campaigns where name = \'' + campaign + '\') as id, (select acos from campaigns where name = \'' + campaign + '\') as acos1, ' +
                'sum(c.`Total spend`) AS Cost, sum(c.`Impressions`) AS Impressions, sum(c.`Clicks`) AS Clicks, sum(c.`1-month Orders Placed`) ' +
                'AS Orders FROM campaignperfomancereport c, listing_reports_data p, mws m WHERE c.`Campaign Name`=\'' + campaign + '\' and c.`Advertised SKU`= p.sku ' + searchstring + ' GROUP BY p.sku) tdata', function (err, results) {


                if (err) return response.serverError(err);
                // console.log(results);
                return response.ok(results);


            });


        } else {


            sails.models.product.query('select tdata.id, tdata.acos1, tdata.MinDate, tdata.EndDate,(SUM(tdata.Revenue*tdata.Profit)-SUM(tdata.Cost)) AS Profit, SUM(tdata.Cost) AS Cost, SUM(tdata.Clicks) AS Clicks,' +
                ' SUM(tdata.Orders) AS Orders, SUM(tdata.Revenue) as Revenue, SUM(tdata.Impressions) AS Impressions from (SELECT c.`Campaign Name` as Campaign, MIN(c.`Start Date`) AS MinDate, MAX(c.`End Date`) ' +
                'AS EndDate, sum(c.`1-month Ordered Product Sales`) AS  Revenue, IF(((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)' +
                '/p.average_selling_price) IS NULL, m.average_profit/100, ((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)' +
                '/p.average_selling_price)) AS Profit, (select id from campaigns where name = \'' + campaign + '\') as id, (select acos from campaigns where name = \'' + campaign + '\') as acos1, ' +
                'sum(c.`Total spend`) AS Cost, sum(c.`Impressions`) AS Impressions, sum(c.`Clicks`) AS Clicks, sum(c.`1-month Orders Placed`) ' +
                'AS Orders FROM campaignperfomancereport c, listing_reports_data p, mws m WHERE  c.`Campaign Name`=\'' + campaign + '\' and c.`Advertised SKU`= p.sku GROUP BY p.sku) tdata', function (err, results1) {

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
    getChartbyKeyword: function getChart(request, response) {

        var campaign = request.param('campaign');
        var keyword = request.param('keyword');
        var startDate = request.param('startDate');
        var endDate = request.param('endDate');
        var searchstring = '';

        if (typeof startDate !== 'undefined' && startDate !== null) {

            searchstring = ' and (c.`End Date` BETWEEN \'' + startDate.replace(/"/, '') + '\' AND \'' + endDate.replace(/"/, '') + '\') ';
        }

        sails.models.product.query('select  tdata.Campaign, tdata.EndDate, (SUM(tdata.Revenue*tdata.Profit)-SUM(tdata.Cost)) AS Profit, SUM(tdata.Cost) AS Cost, SUM(tdata.Clicks) AS Clicks, SUM(tdata.Orders) AS Orders, SUM(tdata.Revenue) as Revenue,' +
            ' SUM(tdata.Impressions) AS Impressions from ' +
            '(SELECT c.`Campaign Name` as Campaign, p.id, p.sku, IF(((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)/p.average_selling_price) IS NULL, ' +
            'm.average_profit/100, ((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)/p.average_selling_price)) AS Profit,' +
            ' c.`End Date` AS EndDate, sum(c.`1-month Ordered Product Sales`) AS  Revenue, sum(c.`Total spend`) AS Cost, sum(c.`Impressions`) AS Impressions, ' +
            'sum(c.`Clicks`) AS Clicks, sum(c.`1-month Orders Placed`) AS Orders FROM campaignperfomancereport c , listing_reports_data p, mws m WHERE c.Keyword=\'' + keyword + '\' and c.`Campaign Name`=\'' + campaign + '\'  and c.`Advertised SKU`= p.sku' + searchstring +
            ' GROUP BY c.`End Date`, p.sku ORDER BY c.`End Date`) tdata GROUP BY tdata.EndDate', function (err, results) {
            if (err) return response.serverError(err);
            // console.log(results);
            return response.ok(results);


        });
    },

    customQuery: function statistics(request, response) {

        var campaign = request.param('campaign');
        var startDate = request.param('startDate');
        var endDate = request.param('endDate');
        var order = request.param('order');
        var searchstring = '';

        if (typeof startDate !== 'undefined' && startDate !== null) {

            searchstring = ' and (c.`End Date` BETWEEN \'' + startDate.replace(/"/, '') + '\' AND \'' + endDate.replace(/"/, '') + '\')';
        }


        sails.models.product.query('select tdata.Keyword as Keyword, tdata.Profit as Profit, tdata.Revenue*tdata.Profit-tdata.Cost AS Profit1, tdata.Cost AS Cost, tdata.Clicks AS Clicks,' +
            ' tdata.Orders AS Orders, tdata.Revenue as Revenue, tdata.Impressions AS Impressions from (SELECT c.`Campaign Name` as Campaign, c.Keyword, sum(c.`1-month Ordered Product Sales`) AS  Revenue, IF(((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)' +
            '/p.average_selling_price) IS NULL, m.average_profit/100, ((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)' +
            '/p.average_selling_price)) AS Profit, sum(c.`Total spend`) AS Cost, sum(c.`Impressions`) AS Impressions, sum(c.`Clicks`) AS Clicks, sum(c.`1-month Orders Placed`) ' +
            'AS Orders FROM campaignperfomancereport c, listing_reports_data p, mws m WHERE c.`Campaign Name`=\'' + campaign + '\' and c.`Advertised SKU`= p.sku ' + searchstring + ' GROUP BY c.Keyword) tdata order by Profit1 ' + order + '', function (err, results) {
            if (err) return response.serverError(err);
            // console.log(results);
            return response.ok(results);


        });

    },

    searchbyACoS: function searchbyACoS(request, response) {

        var campaign = request.param('campaign');
        var startDate = request.param('startDate');
        var endDate = request.param('endDate');
        var acosfrom = request.param('acosfrom');
        var acostill = request.param('acostill');
        var searchstring = '';

        if (typeof startDate !== 'undefined' && startDate !== null) {

            searchstring = ' and (c.`Last Day of Impression` BETWEEN \'' + startDate.replace(/"/, '') + '\' AND \'' + endDate.replace(/"/, '') + '\')';
        }


        sails.models.product.query('select tdata.`ACoS` as acos, tdata.Keyword as Keyword, tdata.Search as Search, tdata.Cost AS Cost, tdata.Clicks AS Clicks,' +
            'tdata.Orders AS Orders, tdata.Revenue as Revenue, tdata.Impressions AS Impressions from (SELECT c.`Customer Search Term` AS Search, c.`Campaign Name` as Campaign, c.Keyword,' +
            'sum(c.`Product Sales within 1-week of a click`) AS  Revenue, sum(c.`Total spend`) AS Cost, c.`ACoS`,' +
            'sum(c.`Impressions`) AS Impressions, sum(c.`Clicks`) AS Clicks, sum(c.`Orders placed within 1-week of a click`) AS Orders FROM searchtermreport c ' +
            'WHERE (c.`ACoS`>=' + acosfrom + ' OR c.`ACoS`<=' + acostill + ') and c.`Campaign Name`=\'' + campaign + '\' ' + searchstring + ' GROUP BY c.`Customer Search Term`) tdata ORDER BY tdata.Cost DESC;', function (err, results) {
            if (err) return response.serverError(err);
            // console.log(results);
            return response.ok(results);


        });

    },

    searchbyACoSmult: function searchbyACoSmult(request, response) {

        var campaign = request.param('campaign');
        var startDate = request.param('startDate');
        var endDate = request.param('endDate');
        var acosfrom = request.param('acosfrom');
        var acostill = request.param('acostill');

        if (typeof campaign === 'string' || campaign instanceof String) {

            //

        } else campaign = campaign.join("','");

        var searchstring = '';

        if (typeof startDate !== 'undefined' && startDate !== null) {

            searchstring = ' and (c.`Last Day of Impression` BETWEEN \'' + startDate.replace(/"/, '') + '\' AND \'' + endDate.replace(/"/, '') + '\')';
        }


        sails.models.product.query('select tdata.`ACoS` as acos, tdata.Keyword as Keyword, tdata.Search as Search, tdata.Cost AS Cost, tdata.Clicks AS Clicks,' +
            'tdata.Orders AS Orders, tdata.Revenue as Revenue, tdata.Impressions AS Impressions from (SELECT c.`Customer Search Term` AS Search, c.`Campaign Name` as Campaign, c.Keyword,' +
            'sum(c.`Product Sales within 1-week of a click`) AS  Revenue, sum(c.`Total spend`) AS Cost, c.`ACoS`,' +
            'sum(c.`Impressions`) AS Impressions, sum(c.`Clicks`) AS Clicks, sum(c.`Orders placed within 1-week of a click`) AS Orders FROM searchtermreport c ' +
            'WHERE (c.`ACoS`<=' + acosfrom + ' AND c.`ACoS`>' + acostill + ') and c.`Campaign Name` IN (\'' + campaign + '\') ' + searchstring + ' GROUP BY c.`Customer Search Term`) tdata ' +
            'ORDER BY tdata.Cost DESC;', function (err, results) {
            if (err) return response.serverError(err);
            // console.log(results);
            return response.ok(results);


        });

    },

    getbelowacos: function getbelowacos(request, response) {

        var campaign = request.param('campaign');
        var startDate = request.param('startDate');
        var endDate = request.param('endDate');
        var acosfrom = request.param('acosfrom');
        var acostill = request.param('acostill');

        if (typeof campaign === 'string' || campaign instanceof String) {

            //

        } else campaign = campaign.join("','");

        var searchstring = '';

        if (typeof startDate !== 'undefined' && startDate !== null) {

            searchstring = ' and (c.`Last Day of Impression` BETWEEN \'' + startDate.replace(/"/, '') + '\' AND \'' + endDate.replace(/"/, '') + '\')';
        }


console.log('select lrd.`product-name` AS Name, tdata.ACoS, tdata.SKU as SKU, tdata.Cost AS Cost, tdata.Clicks AS Clicks,' +
    'tdata.Orders AS Orders, tdata.Revenue as Revenue, tdata.Impressions AS Impressions from (SELECT c.`Advertised SKU` AS SKU,' +
    'sum(c.`1-month Ordered Product Sales`) AS  Revenue, sum(c.`Total spend`) AS Cost, sum(c.`Total spend`)/sum(c.`1-month Ordered Product Sales`)*100 as ACoS,' +
    'sum(c.`Impressions`) AS Impressions, sum(c.`Clicks`) AS Clicks, sum(c.`1-month Orders Placed`) AS Orders FROM campaignperfomancereport c' +
    ' WHERE c.`Campaign Name` =\'' + campaign + '\' ' + searchstring + ' GROUP BY c.`Advertised SKU`) tdata, listing_reports_data lrd' +
    ' WHERE tdata.SKU=lrd.sku AND (tdata.ACoS>' + acosfrom + ' OR tdata.ACoS<=' + acostill + ') ORDER BY tdata.Cost DESC');

        sails.models.product.query('select lrd.`product-name` AS Name, tdata.ACoS, tdata.SKU as SKU, tdata.Cost AS Cost, tdata.Clicks AS Clicks,' +
            'tdata.Orders AS Orders, tdata.Revenue as Revenue, tdata.Impressions AS Impressions from (SELECT c.`Advertised SKU` AS SKU,' +
            'sum(c.`1-month Ordered Product Sales`) AS  Revenue, sum(c.`Total spend`) AS Cost, sum(c.`Total spend`)/sum(c.`1-month Ordered Product Sales`)*100 as ACoS,' +
            'sum(c.`Impressions`) AS Impressions, sum(c.`Clicks`) AS Clicks, sum(c.`1-month Orders Placed`) AS Orders FROM campaignperfomancereport c' +
            ' WHERE c.`Campaign Name` =\'' + campaign + '\' ' + searchstring + ' GROUP BY c.`Advertised SKU`) tdata, listing_reports_data lrd' +
            ' WHERE tdata.SKU=lrd.sku AND (tdata.ACoS>' + acosfrom + ' OR tdata.ACoS<=' + acostill + ') ORDER BY tdata.Cost DESC', function (err, results) {
            if (err) return response.serverError(err);
            // console.log(results);
            return response.ok(results);


        });

    },



    searchbyACoSmult1: function searchbyACoSmult1(request, response) {

        var campaign = request.param('campaign');
        var SKU = request.param('SKU');
        var startDate = request.param('startDate');
        var endDate = request.param('endDate');
        var acosfrom = request.param('acosfrom');
        var acostill = request.param('acostill');

        if (typeof SKU === 'string' || SKU instanceof String) {

            //

        } else SKU = SKU.join("','");
        if (typeof campaign === 'string' || campaign instanceof String) {

            //

        } else campaign = campaign.join("','");

        var searchstring = '';

        if (typeof startDate !== 'undefined' && startDate !== null) {

            searchstring = ' and (c.`Last Day of Impression` BETWEEN \'' + startDate.replace(/"/, '') + '\' AND \'' + endDate.replace(/"/, '') + '\')';
        }

        console.log('select tdata.Keyword as Keyword, tdata.Profit as Profit, tdata.Revenue*tdata.Profit-tdata.Cost AS Profit1, tdata.Cost AS Cost, tdata.Clicks AS Clicks,' +
            ' tdata.Orders AS Orders, tdata.Revenue as Revenue, tdata.Impressions AS Impressions from (SELECT c.Keyword, sum(c.`1-month Ordered Product Sales`) AS  Revenue, IF(((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)' +
            '/p.average_selling_price) IS NULL, m.average_profit/100, ((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)' +
            '/p.average_selling_price)) AS Profit, sum(c.`Total spend`) AS Cost, sum(c.`Impressions`) AS Impressions, sum(c.`Clicks`) AS Clicks, sum(c.`1-month Orders Placed`) ' +
            'AS Orders FROM campaignperfomancereport c, mws m WHERE c.`Advertised SKU` IN (\'' + SKU + '\') and c.`Campaign Name` IN (\'' + campaign + '\') ' + searchstring + ' GROUP BY c.Keyword) tdata order by Profit1');

        sails.models.product.query('select tdata.Keyword as Keyword, tdata.Profit as Profit, tdata.Revenue*tdata.Profit-tdata.Cost AS Profit1, tdata.Cost AS Cost, tdata.Clicks AS Clicks,' +
            ' tdata.Orders AS Orders, tdata.Revenue as Revenue, tdata.Impressions AS Impressions from (SELECT c.Keyword, sum(c.`1-month Ordered Product Sales`) AS  Revenue, IF(((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)' +
            '/p.average_selling_price) IS NULL, m.average_profit/100, ((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)' +
            '/p.average_selling_price)) AS Profit, sum(c.`Total spend`) AS Cost, sum(c.`Impressions`) AS Impressions, sum(c.`Clicks`) AS Clicks, sum(c.`1-month Orders Placed`) ' +
            'AS Orders FROM campaignperfomancereport c, listing_reports_data p, mws m WHERE c.`Advertised SKU`= p.sku and c.`Advertised SKU` IN (\'' + SKU + '\') and c.`Campaign Name` IN (\'' + campaign + '\') ' + searchstring + ' GROUP BY c.Keyword) tdata WHERE tdata.Revenue>0 order by Profit1 DESC ', function (err, results) {
            if (err) return response.serverError(err);
            // console.log(results);
            return response.ok(results);


        });

    },


    update_acos: function update_acos(request, response) {

        var acos = request.param('acos');
        var campaign = request.param('campaign');
        var ID = request.param('id');

        if (typeof ID === 'undefined' || ID === null) {


            sails.models.product.query('insert into campaigns set name=\'' + campaign + '\', acos=' + acos, function (err, results) {
                if (err) return response.serverError(err);
                // console.log(results);
                return response.ok(results);


            });
        } else {

            sails.models.product.query('update campaigns set name=\'' + campaign + '\', acos=' + acos + ' WHERE id=' + ID, function (err, results) {
                if (err) return response.serverError(err);
                // console.log(results);
                return response.ok(results);


            });

        }
    },
    getallskus: function getallskus(request, response) {


        sails.models.product.query('SELECT DISTINCT c.`Advertised SKU` AS SKU FROM campaignperfomancereport c', function (err, results) {


            if (err) return response.serverError(err);
            // console.log(results);
            return response.ok(results);


        });


    },
    getallcampaigns: function getallcampaigns(request, response) {
        var sstring = '';
        var SKU = request.param('SKU');
        if (typeof SKU === 'string' || SKU instanceof String) {

            if (SKU === 'none') sstring = ''; else sstring = 'where c.`Advertised SKU` IN (\'' + SKU + '\')';
            //

        } else {
            SKU = SKU.join("','");

            sstring = 'where c.`Advertised SKU` IN (\'' + SKU + '\')';

        }
        sails.models.product.query('SELECT DISTINCT c.`Campaign Name` AS Campaign FROM campaignperfomancereport c ' + sstring, function (err, results) {


            if (err) return response.serverError(err);
            // console.log(results);
            return response.ok(results);


        });


    },

    removekeywords: function removekeywords(request, response) {

        var campaign = request.param('campaign');
        var startDate = request.param('startDate');
        var endDate = request.param('endDate');
        var acosfrom = request.param('acosfrom');
        var acostill = request.param('acostill');

        if (typeof campaign === 'string' || campaign instanceof String) {

            //

        } else campaign = campaign.join("','");

        var searchstring = '';

        if (typeof startDate !== 'undefined' && startDate !== null) {

            searchstring = ' and (c.`Last Day of Impression` BETWEEN \'' + startDate.replace(/"/, '') + '\' AND \'' + endDate.replace(/"/, '') + '\')';
        }


        sails.models.product.query('select tdata.`ACoS` as acos, tdata.Keyword as Keyword, tdata.Search as Search, tdata.Cost AS Cost, tdata.Clicks AS Clicks,' +
            'tdata.Orders AS Orders, tdata.Revenue as Revenue, tdata.Impressions AS Impressions from (SELECT c.`Customer Search Term` AS Search, c.`Campaign Name` as Campaign, c.Keyword,' +
            'sum(c.`Product Sales within 1-week of a click`) AS  Revenue, sum(c.`Total spend`) AS Cost, c.`ACoS`,' +
            'sum(c.`Impressions`) AS Impressions, sum(c.`Clicks`) AS Clicks, sum(c.`Orders placed within 1-week of a click`) AS Orders FROM searchtermreport c ' +
            'WHERE (c.`ACoS`<=' + acosfrom + ' AND c.`ACoS`>' + acostill + ') and c.`Customer Search Term` NOT IN (SELECT DISTINCT keyword from campaignperfomancereport where `Campaign Name` IN (\'' + campaign + '\')) and c.`Campaign Name` IN (\'' + campaign + '\') ' + searchstring + ' GROUP BY c.`Customer Search Term`) tdata ' +
            'ORDER BY tdata.Cost DESC;', function (err, results) {
            if (err) return response.serverError(err);
            // console.log(results);
            return response.ok(results);


        });

    },





    getallSKUs: function getallSKUs(request, response) {

        var userID = request.param('userID');


        sails.models.product.query('SELECT DISTINCT p.id, p.average_selling_price,' +
            'p.amazon_FBA_fees, p.additional_per_unit_costs, p.total_shipping_costs, p.cost_per_unit, ' +
            'p.sku as SKU, p.asin, p.`product-name`, p.quantity, p.product_description,p.image_sm , p.image_med, p.image_big, p.price, p.url FROM campaignperfomancereport c, ' +
            'listing_reports_data p WHERE c.`Advertised SKU`= p.sku', function (err, results) {
            if (err) return response.serverError(err);
            // console.log(results);
            return response.ok(results);


        });
    }
});

