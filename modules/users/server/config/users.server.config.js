'use strict';

var passport = require( 'passport' );
var path = require( 'path' );
var config = require( path.resolve( './config/config' ) );


/*
 * Module init function
 */
module.exports = function( app ){
	passport.serializeUser( function( user, done ){
		done( null, user );
	} );

	passport.deserializeUser( function( user, done ){
		if( !user ){
			done( {}, null );
		}else{
			done( null, user );
		}
	} );

  	// Add passport's middleware
  	app.use( passport.initialize() );
  	app.use( passport.session() );
};