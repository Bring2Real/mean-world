/**
 * Initialize Angular Application
 */

(function( app ){
	'use strict';

	angular.module( app.applicationModuleName, app.applicationModuleVendorDependencies );

	angular.module( app.applicationModuleName ).config( ['$compileProvider', '$locationProvider', '$httpProvider', '$logProvider', '$translateProvider'
		,function( $compileProvider, $locationProvider, $httpProvider, $logProvider, $translateProvider ){
			$locationProvider.html5Mode( {
				enabled: true
				,requireBase: false
			} ).hashPrefix( '!' );

			$httpProvider.interceptors.push( 'authInterceptor' );
    		//Try to enable CORS
    		//$httpProvider.defaults.withCredentials = true
    		$httpProvider.defaults.useXDomain = true;
    		delete $httpProvider.defaults.headers.common['X-Requested-With'];

    		$translateProvider.fallbackLanguage( 'en' );
    		$translateProvider.preferredLanguage( 'en' );
    		$translateProvider.useSanitizeValueStrategy( 'escape' );

    		$compileProvider.debugInfoEnabled( app.applicationEnvironment !== 'production' );
    		$logProvider.debugEnabled( app.applicationEnvironment !== 'production' );
		}
	] );

	//Define init function for starting up Application
	angular.element( document ).ready( function(){
		if( window.location.hash && window.location.hash == '#_=_' ){
			if( window.history && window.history.pushState ){
				window.history.pushState( '', document.title, window.location.pathname );
			}else{
				var scroll = {
					top: document.body.scrollTop
					,left: document.body.scrollLeft
				};
				window.location.hash = '';
				//Restore scrolls
				document.body.scrollTop = scroll.top;
				document.body.scrollLeft = scroll.left;
			}
		}
		//Init Application
		angular.bootstrap( document, [app.applicationModuleName] );
	} );
}( ApplicationConfiguration ));