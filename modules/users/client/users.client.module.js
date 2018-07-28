(function( app ){
	'use strict';
	app.registerModule( 'users', ['pascalprecht.translate', 'ngCookies'] );
	app.registerModule( 'users.services' );
	app.registerModule( 'users.admin', ['users'] );
}(ApplicationConfiguration));