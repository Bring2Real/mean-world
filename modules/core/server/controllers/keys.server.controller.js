/**
 * Controller for API keys
 * routines
 */
'use strict';

var Q = require( 'q' );
var request = require( 'request' );
var createOrUpdate = require( './core.server.controller' ).createOrUpdate;

/**
 * Get list of all
 * keys from db
 */
exports.all = function( req, res ){
	var user = req.session.user;

	if( !user || ( user.roles.indexOf( 'admin' ) == -1 && user.roles.indexOf( 'admin_company' ) == -1 ) ){
		return res.status( 403 ).send( {success: false, message: 'Forbidden!', err: {}} );
	}
	//console.log( req.user, req.session );
	var Keys = global.db.cli_keys;
	Keys.findAll( {} )
	.then( function( data ){
		res.send( {success: true, data: data} );
	} )
	.catch( function( err ){
		console.log( err );
		res.status( 500 ).send( {success: false, message: 'Unable to load API Keys', err: err} );
	} );
};


/**
 * Store key in local
 * db
 */
exports.createKey = function( req, res ){
	var user = req.session.user;
	if( !user || ( user.roles.indexOf( 'admin' ) == -1 && user.roles.indexOf( 'admin_company' ) == -1 ) ){
		return res.status( 403 ).send( {success: false, message: 'Forbidden!', err: {}} );
	}
	var rSave = req.body;
	var Keys = global.db.cli_keys;
	if( !rSave.api_key || !rSave.key_date ){
		return res.status( 400 ).send( {success: false, message: 'Not enougth params!', err: {}} );
	}
	createOrUpdate( Keys, {api_key: rSave.api_key}, rSave, function( err, created, updated ){
		if( err ){
			console.log( err );
			return res.status( 500 ).send( {success: false, message: 'Unable to create key', err: err} );
		}
		return res.send( {success: true, created: created, updated: updated} );
	} );
};


/**
 * Get enabled API Key
 */
exports.getEnabledKey = function( params ){
	var Keys = global.db.cli_keys;
	var defer = Q.defer();
	var where = {};
	if( params ){
		where = params;
	}
	where.disabled = false;

	Keys.findOne( {where: where} )
	.then( function( rKey ){
		defer.resolve( rKey );
	} )
	.catch( function( err ){
		console.log( err );
		defer.reject( err );
	} );
	return defer.promise;
};


/**
 * Remove existing key
 */
exports.removeKey = function( req, res ){
	var user = req.session.user;
	if( !user || ( user.roles.indexOf( 'admin' ) == -1 && user.roles.indexOf( 'admin_company' ) == -1 ) ){
		return res.status( 403 ).send( {success: false, message: 'Forbidden!', err: {}} );
	}
	var Keys = global.db.cli_keys;
	var id = req.params.keyId;
	if( !id ){
		return res.status( 400 ).send( {success: false, message: 'Not enougth params!', err: {}} );
	}
	Keys.findOne( {where: {id: id}} )
	.then( function( key ){
		return key.destroy()
		.then( function( count ){
			res.send( {success: true} );
		} )
		.catch( function( err ){
			console.log( 1, err );
			return res.status( 500 ).send( {success: false, message: 'Unable to remove key', err: err} );
		} );
	} )
	.catch( function( err ){
		console.log( 2, err );
		return res.status( 500 ).send( {success: false, message: 'Unable to remove key', err: err} );
	} );
};


/**
 * Set key to use
 */
exports.setToUse = function( req, res ){
	var user = req.session.user;
	if( !user || ( user.roles.indexOf( 'admin' ) == -1 && user.roles.indexOf( 'admin_company' ) == -1 ) ){
		return res.status( 403 ).send( {success: false, message: 'Forbidden!', err: {}} );
	}
	var Keys = global.db.cli_keys;
	var api_key = req.body.api_key;
	if( !api_key ){
		return res.status( 400 ).send( {success: false, message: 'Not enougth params!', err: {}} );
	}

	Keys.update( {used: false}, {where:{}} )
	.then( function(){
		return Keys.update( {used: true}, {where: {api_key: api_key}} )
		.then( function(){
			res.send( {success: true} );
		} ).catch( function( err ){
			return res.status( 500 ).send( {success: false, message: 'Unable to remove key', err: err} );
		} );
	} )
	.catch( function( err ){
		return res.status( 500 ).send( {success: false, message: 'Unable to remove key', err: err} );
	} );
};