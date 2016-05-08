/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict';

var _ = require('lodash');
module.exports = _.merge(_.cloneDeep(require('../base/Controller')), {

    addorreplace : function addorreplace(request, response) {

        var sellerID = request.param('SellerID');
        var MWSAuthToken = request.param('MWSAuthToken');
        var profit = request.param('profit');
        var acos = request.param('acos');

        sails.models.product.query('SELECT * FROM mws', function (err, results) {
            if (err) return response.serverError(err);

            if (results){

                var id1=results[0].id;

                //data present, updating

                sails.models.product.query('UPDATE mws SET average_profit='+profit+', average_acos='+acos+', SellerID=\''+sellerID+'\', MWSAuthToken=\''+MWSAuthToken+'\' WHERE id='+id1, function (err, results) {
                    return response.ok(results);

                });


            } else {

                //no data present , creating

                sails.models.product.query('INSERT INTO mws SET average_profit='+profit+', average_acos='+acos+', SellerID=\''+sellerID+'\', MWSAuthToken=\''+MWSAuthToken+'\'', function (err, results) {
                    return response.ok(results);

                });

            }




        });

    },

    upload: function  (request, response) {
        request.file('report').upload(function (err, files) {
            if (err)
                return response.serverError(err);
            console.log(req.file('report'));
            console.log(files.length + ' file(s) uploaded successfully!');
            return response.json({
                message: files.length + ' file(s) uploaded successfully!',
                files: files
            });
        });
    }
	
});

