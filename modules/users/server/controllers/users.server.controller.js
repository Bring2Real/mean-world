/**
 * Controller for users
 * routines
 */
'use strict';

var Q = require( 'q' );
var request = require( 'request' );
var core_config = require( '../../../core/server/config/config.json' );
var getEnabledKey = require( '../../../core/server/controllers/keys.server.controller' ).getEnabledKey;
var renderIndex = require( '../../../core/server/controllers/core.server.controller' ).renderIndex;
var _ = require( 'lodash' );


/**
 * SSO login redirect
 * @param  {object} req
 * @param  {obgect} res
 * ToDo - send API key with params or check with subdomain(?)
 */
exports.ssologin = function( req, res ){
	var Keys = global.db.cli_keys;
	getEnabledKey( {used: true} )
	.then( function( rKey ){
		var be = null;
		var api_key = null;
		if( rKey != null ){
			be = rKey.backend;
			api_key = rKey.api_key;
		}else{
			be = core_config.backend;
		}
		if( api_key ){
			res.set( 'x-api-key', api_key );
			req.session.api_key = api_key;
		}
		res.redirect( be + '/' + core_config.ssologin + '?redirectUrl=' + core_config.redirectUrl );
	} )
	.catch( function( err ){
		console.log( err );
		res.status( 500 ).send( {success: false, message: 'Unable to signin user(Key)', err: err} );
	} );
};


/**
 * Update local data of user description
 * @param  {object} req [description]
 * @param  {object} res [description]
 */
exports.update_local = function( req, res ){
	var user = req.session.user;
	if( !user ){
		return res.status( 403 ).send( {success: false, message: 'Forbidden!'} );
	}
	var user = _.extend( user, req.body );
	req.session.user = user;
	return renderIndex( req, res );
};