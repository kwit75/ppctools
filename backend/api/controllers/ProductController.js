'use strict';

var _ = require('lodash');

var fs =require('fs');

function mysqlEscape(str) {
    if (typeof  str !== 'undefined' && str) {
        return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
            switch (char) {
                case "\0":
                    return "\\0";
                case "\x08":
                    return "\\b";
                case "\x09":
                    return "\\t";
                case "\x1a":
                    return "\\z";
                case "\n":
                    return "\\n";
                case "\r":
                    return "\\r";
                case "\"":
                case "'":
                case "\\":
                case "%":
                    return "\\" + char; // prepends a backslash to backslash, percent,
                                        // and double/single quotes
            }
        });
    } else  return "";
}


module.exports = _.merge(_.cloneDeep(require('../base/Controller')), {

    gettopKPI: function gettopKPI(request, response) {

        var ID = request.param('id');

        var startDate = request.param('startDate');
        var endDate = request.param('endDate');

        var searchstring = '';

        if (typeof startDate !== 'undefined' && startDate !== null) {

            searchstring = ' and (c.`End Date` BETWEEN \'' + startDate.replace(/"/,'') + '\' AND \'' + endDate.replace(/"/,'') + '\')';

            // here comes reports with dates

            sails.models.product.query('select tdata.MinDate, tdata.EndDate,(SUM(tdata.Revenue*tdata.Profit)-SUM(tdata.Cost)) AS Profit, SUM(tdata.Cost) AS Cost, SUM(tdata.Clicks) AS Clicks,' +
                ' SUM(tdata.Orders) AS Orders, SUM(tdata.Revenue) as Revenue, SUM(tdata.Impressions) AS Impressions from (SELECT MIN(c.`Start Date`) AS MinDate, MAX(c.`End Date`) ' +
                'AS EndDate, sum(c.`1-month Ordered Product Sales`) AS  Revenue, IF(((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)' +
                '/p.average_selling_price) IS NULL, m.average_profit/100, ((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)' +
                '/p.average_selling_price)) AS Profit, sum(c.`Total spend`) AS Cost, sum(c.`Impressions`) AS Impressions, sum(c.`Clicks`) AS Clicks, sum(c.`1-month Orders Placed`) ' +
                'AS Orders FROM campaignperfomancereport c, listing_reports_data p, mws m WHERE p.id=' + ID + ' and c.`Advertised SKU`= p.sku ' + searchstring + ' GROUP BY p.sku) tdata', function (err, results) {


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
                'AS Orders FROM campaignperfomancereport c, listing_reports_data p, mws m WHERE  p.id=' + ID + ' and c.`Advertised SKU`= p.sku GROUP BY p.sku) tdata', function (err, results1) {

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

    customQuery: function statistics(request, response) {

        var ID = request.param('id');
        var startDate = request.param('startDate');
        var endDate = request.param('endDate');
        var order = request.param('order');
        var searchstring = '';

        if (typeof startDate !== 'undefined' && startDate !== null) {

            searchstring = ' and (c.`End Date` BETWEEN \'' + startDate.replace(/"/,'') + '\' AND \'' + endDate.replace(/"/,'') + '\')';
        }


        sails.models.product.query('select tdata.Keyword as Keyword, tdata.Profit as Profit, tdata.Revenue*tdata.Profit-tdata.Cost AS Profit1, tdata.Cost AS Cost, tdata.Clicks AS Clicks,' +
            ' tdata.Orders AS Orders, tdata.Revenue as Revenue, tdata.Impressions AS Impressions from (SELECT c.Keyword, sum(c.`1-month Ordered Product Sales`) AS  Revenue, IF(((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)' +
            '/p.average_selling_price) IS NULL, m.average_profit/100, ((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)' +
            '/p.average_selling_price)) AS Profit, sum(c.`Total spend`) AS Cost, sum(c.`Impressions`) AS Impressions, sum(c.`Clicks`) AS Clicks, sum(c.`1-month Orders Placed`) ' +
            'AS Orders FROM campaignperfomancereport c, listing_reports_data p, mws m WHERE p.id=' + ID + ' and c.`Advertised SKU`= p.sku ' + searchstring + ' GROUP BY c.Keyword) tdata order by Profit1 ' + order + ' ', function (err, results) {
            if (err) return response.serverError(err);
            // console.log(results);
            return response.ok(results);


        });

    },

    getallSKUs: function getallSKUs(request, response) {

        var userID = request.param('userID');


        sails.models.product.query('SELECT DISTINCT p.id, p.average_selling_price,' +
            'p.amazon_FBA_fees, p.additional_per_unit_costs, p.total_shipping_costs, p.cost_per_unit, ' +
            'p.sku, p.asin, p.`product-name`, p.quantity, p.product_description,p.image_sm , p.image_med, p.image_big, p.price, p.url FROM campaignperfomancereport c, ' +
            'listing_reports_data p WHERE c.`Advertised SKU`= p.sku', function (err, results) {
            if (err) return response.serverError(err);
            // console.log(results);
            return response.ok(results);


        });

    },
    getalltests: function getalltests(request, response) {

        var ID = request.param('id');


        sails.models.product.query('SELECT a.id, a.name,a.from_date, a.to_date from abtests a, listing_reports_data p WHERE a.sku = p.sku and p.id=' + ID, function (err, results) {
            if (err) return response.serverError(err);
            // console.log(results);
            return response.ok(results);


        });

    },

    gettestbyID: function gettestbyID(request, response) {

        var ID = request.param('id');


        sails.models.product.query('SELECT * from abtests WHERE id=' + ID, function (err, results) {
            if (err) return response.serverError(err);
            // console.log(results);
            return response.ok(results);


        });

    },

    savenewtest: function savenewtest(request, response) {

        var before_backend1 = request.param('before_backend1');
        var before_backend2 = request.param('before_backend2');
        var before_backend3 = request.param('before_backend3');
        var before_backend4 = request.param('before_backend4');
        var before_backend5 = request.param('before_backend5');
        var before_bullet1 = request.param('before_bullet1');
        var before_bullet2 = request.param('before_bullet2');
        var before_bullet3 = request.param('before_bullet3');
        var before_bullet4 = request.param('before_bullet4');
        var before_bullet5 = request.param('before_bullet5');
        var before_coupon = request.param('before_coupon');
        var before_discount = request.param('before_discount');
        if (typeof before_discount === 'undefined' || before_discount == '') before_discount=0;
        var before_photo1 = request.param('before_photo1');
        var before_photo2 = request.param('before_photo2');
        var before_photo3 = request.param('before_photo3');
        var before_photo4 = request.param('before_photo4');
        var before_photo5 = request.param('before_photo5');
        var before_photo6 = request.param('before_photo6');
        var before_photo7 = request.param('before_photo7');
        var before_photo8 = request.param('before_photo8');
        var before_photo9 = request.param('before_photo9');
        var before_price = request.param('before_price');
        if (typeof before_price === 'undefined' || before_price == '') before_price=0;
        var before_summary = request.param('before_summary');
        var after_backend1 = request.param('after_backend1');
        var after_backend2 = request.param('after_backend2');
        var after_backend3 = request.param('after_backend3');
        var after_backend4 = request.param('after_backend4');
        var after_backend5 = request.param('after_backend5');
        var after_bullet1 = request.param('after_bullet1');
        var after_bullet2 = request.param('after_bullet2');
        var after_bullet3 = request.param('after_bullet3');
        var after_bullet4 = request.param('after_bullet4');
        var after_bullet5 = request.param('after_bullet5');
        var after_coupon = request.param('after_coupon');
        var after_discount = request.param('after_discount');
        if (typeof after_discount === 'undefined' || after_discount == '') after_discount=0;
        var after_photo1 = request.param('after_photo1');
        var after_photo2 = request.param('after_photo2');
        var after_photo3 = request.param('after_photo3');
        var after_photo4 = request.param('after_photo4');
        var after_photo5 = request.param('after_photo5');
        var after_photo6 = request.param('after_photo6');
        var after_photo7 = request.param('after_photo7');
        var after_photo8 = request.param('after_photo8');
        var after_photo9 = request.param('after_photo9');
        var after_price = request.param('after_price');
        if (typeof after_price === 'undefined' || after_price == '') after_price=0;
        var after_summary = request.param('after_summary');
        var after_title = request.param('after_title');
        var before_title = request.param('before_title');
        var before_timeframe = request.param('before_timeframe');
        var name = request.param('name');
        var sku = request.param('sku');
        var from_date = (new Date()).toISOString().substring(0, 19).replace('T', ' ');
        var someDate = new Date();
        someDate.setTime( someDate.getTime() + before_timeframe * 86400000 );
        var to_date = someDate.toISOString().substring(0, 19).replace('T', ' ');


console.log('Insert into abtests set before_backend1=\'' + mysqlEscape(before_backend1) + '\', before_backend2=\'' + mysqlEscape(before_backend2) + '\',' +
    'before_backend3=\'' + mysqlEscape(before_backend3) + '\',before_backend4=\'' + mysqlEscape(before_backend4) + '\',' +
    'before_backend5=\'' + mysqlEscape(before_backend5) + '\',before_bullet3=\'' + mysqlEscape(before_bullet3) + '\',' +
    'before_bullet4=\'' + mysqlEscape(before_bullet4) + '\',before_bullet5=\'' + mysqlEscape(before_bullet5) + '\',' +
    'before_coupon=\'' + mysqlEscape(before_coupon) + '\',before_discount=' + before_discount + ',' +
    'before_photo1=\'' + mysqlEscape(before_photo1) + '\',before_photo2=\'' + mysqlEscape(before_photo2) + '\',' +
    'before_photo3=\'' + mysqlEscape(before_photo3) + '\',before_photo4=\'' + mysqlEscape(before_photo4) + '\',' +
    'before_photo5=\'' + mysqlEscape(before_photo5) + '\',before_photo6=\'' + mysqlEscape(before_photo6) + '\',' +
    'before_photo7=\'' + mysqlEscape(before_photo7) + '\',before_photo8=\'' + mysqlEscape(before_photo8) + '\',' +
    'before_photo9=\'' + mysqlEscape(before_photo9) + '\',before_price=' + before_price + ',' +
    'before_summary=\'' + mysqlEscape(before_summary) + '\',' +
    'after_backend1=\'' + mysqlEscape(after_backend1) + '\', after_backend2=\'' + mysqlEscape(after_backend2) + '\',' +
    'after_backend3=\'' + mysqlEscape(after_backend3) + '\',after_backend4=\'' + mysqlEscape(after_backend4) + '\',' +
    'after_backend5=\'' + mysqlEscape(after_backend5) + '\',after_bullet3=\'' + mysqlEscape(after_bullet3) + '\',' +
    'after_bullet4=\'' + mysqlEscape(after_bullet4) + '\',after_bullet5=\'' + mysqlEscape(after_bullet5) + '\',' +
    'after_coupon=\'' + mysqlEscape(after_coupon) + '\',after_discount=' + after_discount + ',' +
    'after_photo1=\'' + mysqlEscape(after_photo1) + '\',after_photo2=\'' + mysqlEscape(after_photo2) + '\',' +
    'after_photo3=\'' + mysqlEscape(after_photo3) + '\',after_photo4=\'' + mysqlEscape(after_photo4) + '\',' +
    'after_photo5=\'' + mysqlEscape(after_photo5) + '\',after_photo6=\'' + mysqlEscape(after_photo6) + '\',' +
    'after_photo7=\'' + mysqlEscape(after_photo7) + '\',after_photo8=\'' + mysqlEscape(after_photo8) + '\',' +
    'after_photo9=\'' + mysqlEscape(after_photo9) + '\',after_price=' + after_price + ',' +
    'after_summary=\'' + mysqlEscape(after_summary) + '\',to_date=\'' + to_date + '\',' +
    ' before_title=\'' + mysqlEscape(before_title) + '\', after_title=\'' + mysqlEscape(after_title) + '\', from_date=\'' + from_date + '\',' +
    ' name=\'' + mysqlEscape(name) + '\', sku=\'' + mysqlEscape(sku) + '\'');

        sails.models.product.query('Insert into abtests set before_backend1=\'' + mysqlEscape(before_backend1) + '\', before_backend2=\'' + mysqlEscape(before_backend2) + '\',' +
            'before_backend3=\'' + mysqlEscape(before_backend3) + '\',before_backend4=\'' + mysqlEscape(before_backend4) + '\',' +
            'before_backend5=\'' + mysqlEscape(before_backend5) + '\',before_bullet3=\'' + mysqlEscape(before_bullet3) + '\',' +
            'before_bullet4=\'' + mysqlEscape(before_bullet4) + '\',before_bullet5=\'' + mysqlEscape(before_bullet5) + '\',' +
            'before_coupon=\'' + mysqlEscape(before_coupon) + '\',before_discount=' + before_discount + ',' +
            'before_photo1=\'' + mysqlEscape(before_photo1) + '\',before_photo2=\'' + mysqlEscape(before_photo2) + '\',' +
            'before_photo3=\'' + mysqlEscape(before_photo3) + '\',before_photo4=\'' + mysqlEscape(before_photo4) + '\',' +
            'before_photo5=\'' + mysqlEscape(before_photo5) + '\',before_photo6=\'' + mysqlEscape(before_photo6) + '\',' +
            'before_photo7=\'' + mysqlEscape(before_photo7) + '\',before_photo8=\'' + mysqlEscape(before_photo8) + '\',' +
            'before_photo9=\'' + mysqlEscape(before_photo9) + '\',before_price=' + before_price + ',' +
            'before_summary=\'' + mysqlEscape(before_summary) + '\',' +
            'after_backend1=\'' + mysqlEscape(after_backend1) + '\', after_backend2=\'' + mysqlEscape(after_backend2) + '\',' +
            'after_backend3=\'' + mysqlEscape(after_backend3) + '\',after_backend4=\'' + mysqlEscape(after_backend4) + '\',' +
            'after_backend5=\'' + mysqlEscape(after_backend5) + '\',after_bullet3=\'' + mysqlEscape(after_bullet3) + '\',' +
            'after_bullet4=\'' + mysqlEscape(after_bullet4) + '\',after_bullet5=\'' + mysqlEscape(after_bullet5) + '\',' +
            'after_coupon=\'' + mysqlEscape(after_coupon) + '\',after_discount=' + after_discount + ',' +
            'after_photo1=\'' + mysqlEscape(after_photo1) + '\',after_photo2=\'' + mysqlEscape(after_photo2) + '\',' +
            'after_photo3=\'' + mysqlEscape(after_photo3) + '\',after_photo4=\'' + mysqlEscape(after_photo4) + '\',' +
            'after_photo5=\'' + mysqlEscape(after_photo5) + '\',after_photo6=\'' + mysqlEscape(after_photo6) + '\',' +
            'after_photo7=\'' + mysqlEscape(after_photo7) + '\',after_photo8=\'' + mysqlEscape(after_photo8) + '\',' +
            'after_photo9=\'' + mysqlEscape(after_photo9) + '\',after_price=' + after_price + ',' +
            'after_summary=\'' + mysqlEscape(after_summary) + '\',to_date=\'' + to_date + '\',' +
            ' before_title=\'' + mysqlEscape(before_title) + '\', after_title=\'' + mysqlEscape(after_title) + '\', from_date=\'' + from_date + '\',' +
            ' name=\'' + mysqlEscape(name) + '\', sku=\'' + mysqlEscape(sku) + '\'', function (err, results) {
            if (err) return response.serverError(err);
            // console.log(results);
            return response.ok(results);


        });

    },


    getbyID: function getbyID(request, response) {


        var ID = request.param('id');

        console.log(ID);
        sails.models.product.query('SELECT * FROM listing_reports_data p WHERE p.id=' + ID, function (err, results) {
            if (err) return response.serverError(err);
            // console.log(results);
            return response.ok(results);


        });

    },

    getChart: function getChart(request, response) {

        var ID = request.param('id');
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
            'sum(c.`Clicks`) AS Clicks, sum(c.`1-month Orders Placed`) AS Orders FROM campaignperfomancereport c , listing_reports_data p, mws m WHERE p.id=' + ID + ' and c.`Advertised SKU`= p.sku' + searchstring +
            ' GROUP BY c.`End Date`, p.sku ORDER BY c.`End Date`) tdata GROUP BY tdata.EndDate', function (err, results) {
            if (err) return response.serverError(err);
            // console.log(results);
            return response.ok(results);


        });
    },
    getChartbyKeyword: function getChart(request, response) {

        var ID = request.param('id');
        var keyword = request.param('keyword');
        var startDate = request.param('startDate');
        var endDate = request.param('endDate');
        var searchstring = '';

        if (typeof startDate !== 'undefined' && startDate !== null) {

            searchstring = ' and (c.`End Date` BETWEEN \'' + startDate.replace(/"/,'') + '\' AND \'' + endDate.replace(/"/,'') + '\') ';
        }

        sails.models.product.query('select tdata.EndDate, (SUM(tdata.Revenue*tdata.Profit)-SUM(tdata.Cost)) AS Profit, SUM(tdata.Cost) AS Cost, SUM(tdata.Clicks) AS Clicks, SUM(tdata.Orders) AS Orders, SUM(tdata.Revenue) as Revenue,' +
            ' SUM(tdata.Impressions) AS Impressions from ' +
            '(SELECT p.id, p.sku, IF(((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)/p.average_selling_price) IS NULL, ' +
            'm.average_profit/100, ((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)/p.average_selling_price)) AS Profit,' +
            ' c.`End Date` AS EndDate, sum(c.`1-month Ordered Product Sales`) AS  Revenue, sum(c.`Total spend`) AS Cost, sum(c.`Impressions`) AS Impressions, ' +
            'sum(c.`Clicks`) AS Clicks, sum(c.`1-month Orders Placed`) AS Orders FROM campaignperfomancereport c , listing_reports_data p, mws m WHERE c.Keyword=\'' + keyword + '\' and p.id=' + ID + ' and c.`Advertised SKU`= p.sku' + searchstring +
            ' GROUP BY c.`End Date`, p.sku ORDER BY c.`End Date`) tdata GROUP BY tdata.EndDate', function (err, results) {
            if (err) return response.serverError(err);
            // console.log(results);
            return response.ok(results);


        });
    },

    update_margins: function update_margins(request, response) {


        var ID = request.param('id');
        var cost_per_unit = request.param('cost_per_unit');
        var total_shipping_costs = request.param('total_shipping_costs');
        var additional_per_unit_costs = request.param('additional_per_unit_costs');
        var amazon_FBA_fees = request.param('amazon_FBA_fees');
        var average_selling_price = request.param('average_selling_price');

        console.log(ID);
        sails.models.product.query('update listing_reports_data set cost_per_unit=' + cost_per_unit + ', total_shipping_costs=' + total_shipping_costs + ', ' +
            'additional_per_unit_costs=' + additional_per_unit_costs + ', amazon_FBA_fees=' + amazon_FBA_fees + ', ' +
            'average_selling_price=' + average_selling_price + ' WHERE id=' + ID, function (err, results) {
            if (err) return response.serverError(err);
            // console.log(results);
            return response.ok(results);


        });

    },
    getbackend: function getbackend(request, response) {

        var ID = request.param('id');
        var a = [];

        sails.models.product.query('select tdata.`ACoS` as acos, tdata.Keyword as Keyword, tdata.Search as Search, tdata.Cost AS Cost, tdata.Clicks AS Clicks,' +
            ' tdata.Orders AS Orders, tdata.Revenue as Revenue, tdata.Impressions AS Impressions from (SELECT c.`Customer Search Term` AS Search, c.`Campaign Name` as Campaign, c.Keyword, ' +
            'sum(c.`Product Sales within 1-week of a click`) AS  Revenue, sum(c.`Total spend`) AS Cost, c.`ACoS`, ' +
            'sum(c.`Impressions`) AS Impressions, sum(c.`Clicks`) AS Clicks, sum(c.`Orders placed within 1-week of a click`) AS Orders FROM searchtermreport c ' +
            'WHERE c.`ACoS`>0 AND c.`ACoS`<30 and c.`Campaign Name` IN (SELECT DISTINCT c.`Campaign Name` FROM campaignperfomancereport c, listing_reports_data p WHERE ' +
            ' p.id=' + ID + ' and c.`Advertised SKU`= p.sku) GROUP BY c.`Customer Search Term`) tdata ORDER BY tdata.Revenue DESC', function (err, results) {
            if (err) return response.serverError(err);

            a = results;

            sails.models.product.query('SELECT * FROM listing_reports_data p WHERE p.id=' + ID, function (err, results) {
                if (err) return response.serverError(err);
                var b1 = [];
                var b2 = [];
                var b3 = [];
                var b4 = [];
                var b5 = [];

                var ab = results;
                if (typeof ab[0].backend_keywords1 !== 'undefined' && ab[0].backend_keywords1) {
                    b1 = ab[0].backend_keywords1.split(' ');
                }
                if (typeof ab[0].backend_keywords2 !== 'undefined' && ab[0].backend_keywords2) {
                    b2 = ab[0].backend_keywords2.split(' ');
                }
                if (typeof ab[0].backend_keywords3 !== 'undefined' && ab[0].backend_keywords3) {
                    b3 = ab[0].backend_keywords3.split(' ');
                }
                if (typeof ab[0].backend_keywords4 !== 'undefined' && ab[0].backend_keywords4) {
                    b4 = ab[0].backend_keywords4.split(' ');
                }
                if (typeof ab[0].backend_keywords5 !== 'undefined' && ab[0].backend_keywords5) {
                    b5 = ab[0].backend_keywords5.split(' ');
                }

                var aba = b1.concat(b2, b3, b4, b5);


                var seen = {};

                for (var i = 0; i < a.length; i++) {
                    count(a[i].Search.split(' '), seen);
                }
                function count(words, accumulator) {
                    for (var i = 0; i < words.length; ++i) {
                        if (!accumulator.hasOwnProperty(words[i])) {
                            accumulator[words[i]] = 1;
                        } else {
                            ++accumulator[words[i]];
                        }
                    }
                }

                var sortable = [];
                for (var vehicle in seen) {
                    if (aba.indexOf(vehicle) < 0)
                        sortable.push([vehicle, seen[vehicle]]);
                }
                sortable.sort(function (a, b) {
                    return a[1] - b[1];
                }).reverse();

                return response.ok(sortable);


            });


        });


    },
    update_backend: function update_backend(request, response) {


        var ID = request.param('id');
        var backend1 = mysqlEscape(request.param('backend1'));
        var backend2 = mysqlEscape(request.param('backend2'));
        var backend3 = mysqlEscape(request.param('backend3'));
        var backend4 = mysqlEscape(request.param('backend4'));
        var backend5 = mysqlEscape(request.param('backend5'));

        sails.models.product.query('update listing_reports_data set backend_keywords1=\'' + backend1 + '\', ' +
            ' backend_keywords2=\'' + backend2 + '\',' +
            ' backend_keywords3=\'' + backend3 + '\',' +
            ' backend_keywords4=\'' + backend4 + '\',' +
            ' backend_keywords5=\'' + backend5 + '\' WHERE id=' + ID, function (err, results) {
            if (err) return response.serverError(err);
            // console.log(results);
            return response.ok(results);


        });
    },
    upload: function (request, response) {

        request.file('0').upload({
            maxBytes: 100 * 1024 * 1024
        }, function (err, files) {
            if (err) return response.send(400, {result: false, error: err});
            if (!files) return response.send(400, {result: false, error: 'Unable to upload file'});
            fs.renameSync(files[0].fd, files[0].fd.replace('backend/.tmp/uploads','frontend/src/app/assets/pictures'));
            files[0].fd = files[0].fd.replace(/.*?tmp\/uploads\//,'');
                    response.send({result: true, files: files});
        });
    },

    getabtestsstats: function getabtestsstats(request, response) {

        var ID = request.param('id');

        var startDate = request.param('startDate');
        var endDate = request.param('endDate');

        var searchstring = '';

            searchstring = ' and (c.`End Date` BETWEEN \'' + startDate.replace(/"/,'') + '\' AND \'' + endDate.replace(/"/,'') + '\')';

            // here comes reports with dates

            sails.models.product.query('select tdata.MinDate, tdata.EndDate,(SUM(tdata.Revenue*tdata.Profit)-SUM(tdata.Cost)) AS Profit, AVG(tdata.Conversion) as Conversion, SUM(tdata.Cost) AS Cost, SUM(tdata.Clicks) AS Clicks,' +
                ' SUM(tdata.Orders) AS Orders, SUM(tdata.Revenue) as Revenue, SUM(tdata.Impressions) AS Impressions from (SELECT MIN(c.`Start Date`) AS MinDate, MAX(c.`End Date`) ' +
                'AS EndDate, sum(c.`1-month Ordered Product Sales`) AS  Revenue, IF(((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)' +
                '/p.average_selling_price) IS NULL, m.average_profit/100, ((p.average_selling_price-p.cost_per_unit-p.total_shipping_costs-p.additional_per_unit_costs-p.amazon_FBA_fees)' +
                '/p.average_selling_price)) AS Profit, sum(c.`Total spend`) AS Cost, sum(c.`Impressions`) AS Impressions, AVG(c.`1-month Conversion Rate`) as Conversion, sum(c.`Clicks`) AS Clicks, sum(c.`1-month Orders Placed`) ' +
                'AS Orders FROM campaignperfomancereport c, listing_reports_data p, mws m WHERE p.id=' + ID + ' and c.`Advertised SKU`= p.sku ' + searchstring + ' GROUP BY p.sku) tdata', function (err, results) {


                if (err) return response.serverError(err);
                // console.log(results);
                return response.ok(results);


            });


        }

    });
