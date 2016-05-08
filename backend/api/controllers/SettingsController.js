'use strict';

var _ = require('lodash');

function mysqlEscape(stringToEscape) {
    return stringToEscape
        .replace("\\", "\\\\")
        .replace("\'", "\\\'")
        .replace("\"", "\\\"")
        .replace("\n", "\\\n")
        .replace("\r", "\\\r")
        .replace("\x00", "\\\x00")
        .replace("\x1a", "\\\x1a");
}

function import_csv(table, 		// Имя таблицы для импорта
                    afields, 		// Массив строк - имен полей таблицы
                    filename, 	 	// Имя CSV файла, откуда берется информация
                    // (путь от корня web-сервера)
                    delim,  		// Разделитель полей в CSV файле
                    enclosed,  	// Кавычки для содержимого полей
                    escaped, 	 	// Ставится перед специальными символами
                    lineend,   	// Чем заканчивается строка в файле CSV
                    hasheader,
                    setlist) {


    var ignore1 = " IGNORE 1 LINES ";
    var q_import =
        "LOAD DATA INFILE '" + filename + "' IGNORE INTO TABLE " + table + "_copy " +
        "FIELDS TERMINATED BY '" + delim + "' ENCLOSED BY '" + enclosed + "' " +
        "    ESCAPED BY '" + escaped + "' " +
        "LINES TERMINATED BY '" + lineend + "' " + ignore1 +
        "(" + afields.join(',') + ") set " + setlist;
    ;

    console.log(q_import);

    sails.models.product.query(q_import, function (err, results) {
        if (err) return response.serverError(err);

        // now copy all into new table

        console.log("INSERT INTO " + table + " SELECT * FROM " + table + "_copy where " + table + ".`Start Date` not in" +
            " (SELECT DISTINCT c.`Start Date` FROM " + table + " c)");

        sails.models.product.query("INSERT INTO " + table + " SELECT c1.*, 0 FROM " + table + "_copy c1 where c1.`Start Date` not in" +
            " (SELECT DISTINCT c.`Start Date` FROM " + table + " c)", function (err, results) {
                if (err) return response.serverError(err);

//truncate old table;

                sails.models.product.query("truncate " + table + "_copy", function (err, results) {
                        if (err) return response.serverError(err);
                        return results;
                    }
                );
                // console.log(results);


            }
        );

    });

}

/**
 * BookController
 *
 * @description :: Server-side logic for managing Books
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = _.merge(_.cloneDeep(require('../base/Controller')), {

    getvalues: function getvalues(request, response) {

        sails.models.product.query('select * from mws', function (err, results) {
            if (err) return response.serverError(err);
            // console.log(results);
            return response.ok(results);
        });


    },

    upload: function (request, response) {

        request.file('0').upload({
            maxBytes: 100 * 1024 * 1024
        }, function (err, files) {

            //if there was an error
            //stop here and tell the frontend
            if (err) return response.send(400, {result: false, error: err});

            //if the file didn't upload for some reason
            //stop here and tell the frontend
            if (!files) return response.send(400, {result: false, error: 'Unable to upload file'});


            //Converter Class
            //           var csv = require("fast-csv");
            var fs = require("fs");
            //var stream = fs.createReadStream(files[0].fd);


            var hasheader = true;
            var afields = ['`Campaign Name`',
                '`Ad Group Name`',
                '`Advertised SKU`',
                'Keyword',
                '`Match Type`',
                '@`Start Date`',
                '@`End Date`',
                'Clicks',
                'Impressions',
                '@CTR',
                '`Total Spend`',
                '@`Average CPC`',
                'Currency',
                '`1-day Orders Placed`',
                '`1-day Ordered Product Sales`',
                '@`1-day Conversion Rate`',
                '`1-day Same SKU Units Ordered`',
                '`1-day Other SKU Units Ordered`',
                '`1-day Same SKU Units Ordered Product Sales`',
                '`1-day Other SKU Units Ordered Product Sales`',
                '`1-week Orders Placed`',
                '`1-week Ordered Product Sales`',
                '@`1-week Conversion Rate`',
                '`1-week Same SKU Units Ordered`',
                '`1-week Other SKU Units Ordered`',
                '`1-week Same SKU Units Ordered Product Sales`',
                '`1-week Other SKU Units Ordered Product Sales`',
                '`1-month Orders Placed`',
                '`1-month Ordered Product Sales`',
                '@`1-month Conversion Rate`',
                '`1-month Same SKU Units Ordered`',
                '`1-month Other SKU Units Ordered`',
                '`1-month Same SKU Units Ordered Product Sales`',
                '`1-month Other SKU Units Ordered Product Sales`'];

            var setlist = "`Start Date` = str_to_date(@`Start Date`, '%m/%d/%Y %k:%i'), `End Date` = str_to_date(@`End Date`, '%m/%d/%Y %k:%i'), " +
                "`Average CPC` = replace(@`Average CPC`, 'N/A', ''), CTR = replace(@CTR, '%', ''), " +
                "`1-day Conversion Rate`= replace(@`1-day Conversion Rate`, '%', ''), `1-week Conversion Rate` = replace(@`1-week Conversion Rate`, '%', '')," +
                "`1-month Conversion Rate` = replace(@`1-month Conversion Rate`, '%', '')";

            var filename = files[0].fd;
            var table = 'campaignperfomancereport';
            var delim = '\\t',  		// Разделитель полей в CSV файле
                enclosed = '',  	// Кавычки для содержимого полей
                escaped = '\\\\', 	 	// Ставится перед специальными символами
                lineend = '\\r\\n';


            var imp = import_csv(
                table, 		// Имя таблицы для импорта
                afields, 		// Массив строк - имен полей таблицы
                filename, 	 	// Имя CSV файла, откуда берется информация
                // (путь от корня web-сервера)
                delim,  		// Разделитель полей в CSV файле
                enclosed,  	// Кавычки для содержимого полей
                escaped, 	 	// Ставится перед специальными символами
                lineend,   	// Чем заканчивается строка в файле CSV
                hasheader,
                setlist);


            response.send({result: true, files: files});

        });
    },
    upload1: function (request, response) {

        request.file('0').upload({
            maxBytes: 100 * 1024 * 1024
        }, function (err, files) {

            //if there was an error
            //stop here and tell the frontend
            if (err) return response.send(400, {result: false, error: err});

            //if the file didn't upload for some reason
            //stop here and tell the frontend
            if (!files) return response.send(400, {result: false, error: 'Unable to upload file'});


            //Converter Class
            //         var csv = require("fast-csv");
            var fs = require("fs");
            //var stream = fs.createReadStream(files[0].fd);


            var hasheader = true;
            var afields = ['`Campaign Name`',
                '`Ad Group Name`',
                '`Customer Search Term`',
                'Keyword',
                '`Match Type`',
                '@`First Day of Impression`',
                '@`Last Day of Impression`',
                'Impressions',
                'Clicks',
                '@CTR',
                '`Total Spend`',
                '@`Average CPC`',
                'ACoS',
                'Currency',
                '`Orders placed within 1-week of a click`',
                '`Product Sales within 1-week of a click`',
                '@`Conversion Rate within 1-week of a click`',
                '`Same SKU units Ordered within 1-week of click`',
                '`Other SKU units Ordered within 1-week of click`',
                '`Same SKU units Product Sales within 1-week of click`',
                '`Other SKU units Product Sales within 1-week of click`'];

            var setlist = "`First Day of Impression` = str_to_date(@`First Day of Impression`, '%m/%d/%Y %k:%i'), `Last Day of Impression` = str_to_date(@`Last Day of Impression`, '%m/%d/%Y %k:%i'), " +
                "`Average CPC` = replace(@`Average CPC`, 'N/A', ''), CTR = replace(@CTR, '%', ''), " +
                "`Conversion Rate within 1-week of a click`= replace(@`Conversion Rate within 1-week of a click`, '%', '')";

            var filename = files[0].fd;
            var table = 'searchtermreport';
            var delim = '\\t',  		// Разделитель полей в CSV файле
                enclosed = '',  	// Кавычки для содержимого полей
                escaped = '\\\\', 	 	// Ставится перед специальными символами
                lineend = '\\r\\n';


            var imp = import_csv(
                table, 		// Имя таблицы для импорта
                afields, 		// Массив строк - имен полей таблицы
                filename, 	 	// Имя CSV файла, откуда берется информация
                // (путь от корня web-сервера)
                delim,  		// Разделитель полей в CSV файле
                enclosed,  	// Кавычки для содержимого полей
                escaped, 	 	// Ставится перед специальными символами
                lineend,   	// Чем заканчивается строка в файле CSV
                hasheader,
                setlist);


            response.send({result: true, files: files});

        });
    }
    /*
     upload1: function (request, response) {

     request.file('0').upload({
     maxBytes: 100 * 1024 * 1024
     }, function (err, files) {

     //if there was an error
     //stop here and tell the frontend
     if (err) return response.send(400, {result: false, error: err});

     //if the file didn't upload for some reason
     //stop here and tell the frontend
     if (!files) return response.send(400, {result: false, error: 'Unable to upload file'});


     //Converter Class
     var csv = require("fast-csv");
     var fs = require("fs");
     var stream = fs.createReadStream(files[0].fd);

     csv
     .fromStream(stream, {delimiter: '\t', headers: true})
     .on("data", function (data) {

     //      console.log(data);

     if (data["Campaign Name"] != '') {
     data.CTR = data.CTR.replace(/%/, '');
     data.ACoS = data.ACoS.replace(/%/, '');
     data["Customer Search Term"]=mysqlEscape(data["Customer Search Term"]);

     data["Keyword"]=mysqlEscape(data["Keyword"]);


     data["Conversion Rate within 1-week of a click"] = data["Conversion Rate within 1-week of a click"].replace(/%/, '');
     data["Average CPC"] = data["Average CPC"].replace(/N\/A/, '0');


     data["First Day of Impression"] = data["First Day of Impression"].replace(/\./g, '/');
     data["Last Day of Impression"] = data["Last Day of Impression"].replace(/\./g, '/');

     var parts = data["First Day of Impression"].split('/');
     data["First Day of Impression"] = parts[2] + '-' + parts[0] + '-' + parts[1];

     var parts = data["Last Day of Impression"].split('/');
     data["Last Day of Impression"] = parts[2] + '-' + parts[0] + '-' + parts[1];

     sails.models.product.query('insert into searchtermreport set `Campaign Name`= \'' + data["Campaign Name"] + '\',' +
     '`Ad Group Name` = \'' + data["Ad Group Name"] + '\',' +
     '`Customer Search Term` = \'' + data["Customer Search Term"] + '\',' +
     'Keyword  =\'' + data["Keyword"] + '\',' +
     '`Match Type` =\'' + data["Match Type"] + '\',' +
     '`First Day of Impression` =\'' + data["First Day of Impression"] + '\',' +
     '`Last Day of Impression` =\'' + data["Last Day of Impression"] + '\',' +
     'Impressions =\'' + data["Impressions"] + '\',' +
     'Clicks =\'' + data["Clicks"] + '\',' +
     'CTR =\'' + data["CTR"] + '\',' +
     '`Total Spend` =\'' + data["Total Spend"] + '\',' +
     '`Average CPC` =\'' + data["Average CPC"] + '\',' +
     'ACoS =\'' + data["ACoS"] + '\',' +
     'Currency =\'' + data["Currency"] + '\',' +
     '`Orders placed within 1-week of a click` =\'' + data["Orders placed within 1-week of a click"] + '\',' +
     '`Product Sales within 1-week of a click` =\'' + data["Product Sales within 1-week of a click"] + '\',' +
     '`Conversion Rate within 1-week of a click` =\'' + data["Conversion Rate within 1-week of a click"] + '\',' +
     '`Same SKU units Ordered within 1-week of click` =\'' + data["Same SKU units Ordered within 1-week of click"] + '\',' +
     '`Other SKU units Ordered within 1-week of click` =\'' + data["Other SKU units Ordered within 1-week of click"] + '\',' +
     '`Same SKU units Product Sales within 1-week of click` =\'' + data["Same SKU units Product Sales within 1-week of click"] + '\',' +
     '`Other SKU units Product Sales within 1-week of click` =\'' + data["Other SKU units Product Sales within 1-week of click"] + '\'', function (err, results1) {

     // merging with sales reports
     // now we detect sales report dates


     if (err) return response.serverError(err);
     // console.log(results);
     });

     }

     })
     .on("end", function () {
     response.send({result: true, files: files});
     });


     });
     }

     */
});
