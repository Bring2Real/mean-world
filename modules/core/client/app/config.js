(function( window ){
	'use strict';

	var applicationModuleName = 'z_cli';
	var service = {
		applicationEnvironment: window.env
		,applicationModuleName: applicationModuleName
		,applicationModuleVendorDependencies: ['ngResource', 'ngAnimate', 'ngMessages', 'ui.router', 'ui-notification', 'pascalprecht.translate', 'angular-click-outside', 'ui.bootstrap', 'ui.select', 'ui.autocomplete', 'ngFileUpload']
		,registerModule: registerModule
	};

	window.ApplicationConfiguration = service;

	//Add new vertical module
	function registerModule( moduleName, dependencies )
	{
		angular.module( moduleName, dependencies || [] );
		//Add module to requires
		angular.module( applicationModuleName ).requires.push( moduleName );
	}

	//Configure ui-notification plugin
	angular.module( 'ui-notification' ).config( function( NotificationProvider ){
		NotificationProvider.setOptions( {
			delay: 2000
			,startTop: 20
			,startRight: 10
			,verticalSpacing: 20
			,horizontalSpacing: 20
			,positionX: 'right'
			,positionY: 'bottom'
		} );
	} );
}( window ));
