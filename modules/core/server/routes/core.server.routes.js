'use strict';

module.exports = function( app ){
	var core = require( '../controllers/core.server.controller' );
	var keys = require( '../controllers/keys.server.controller' );

	//keys
	app.route( '/api/keys' )
	.get( keys.all )
	.post( keys.createKey );
	
	app.route( '/api/keys/:keyId' )
	.delete( keys.removeKey );

	app.route( '/api/use_key' )
	.post( keys.setToUse );

	//Default application route
	app.route( '/*' )
	.get( core.renderIndex );
};