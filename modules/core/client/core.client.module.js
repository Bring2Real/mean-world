(function( app ){
	'use strict';

	app.registerModule( 'core', ['ngCookies'] );
	app.registerModule( 'core.routes', ['ui.router'] );
	app.registerModule( 'core.keys', ['core'] );
	app.registerModule( 'core.utils', [] );
}( ApplicationConfiguration ));