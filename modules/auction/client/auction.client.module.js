(function( app ){
	'use strict';

	app.registerModule( 'auction', ['ui.router', 'pascalprecht.translate'] );
	app.registerModule( 'auction.offers', ['auction'] );
}( ApplicationConfiguration ));