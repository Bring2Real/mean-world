/**
 * Routes for users
 */
'use strict';

module.exports = function( app ){
	var users = require( '../controllers/users.server.controller' );
	
	app.route( '/ssologin' )
	.get( users.ssologin );

	app.route( '/local/user' )
	.put( users.update_local );
};