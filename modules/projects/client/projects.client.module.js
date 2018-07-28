(function( app ){
	'use strict';

	app.registerModule( 'projects', ['ui.router', 'pascalprecht.translate'] );
	app.registerModule( 'projects.units', ['projects'] );
	app.registerModule( 'projects.expose', ['projects'] );
	app.registerModule( 'projects.fancybox', [] );
	app.registerModule( 'projects.relations', ['projects'] );
}( ApplicationConfiguration ));