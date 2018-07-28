( function( app ){
	'use strict';

	app.registerModule( 'templates', ['ui.router', 'smart-table', 'pascalprecht.translate'] );
	app.registerModule( 'templates.offer', ['templates'] );
}( ApplicationConfiguration ));