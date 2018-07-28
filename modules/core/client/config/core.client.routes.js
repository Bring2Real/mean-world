'use strict';

angular.module( 'core' ).config( ['$stateProvider', '$urlRouterProvider'
	,function( $stateProvider, $urlRouterProvider ){
		$urlRouterProvider.rule( function( $injector, $location ){
			var path = $location.path;
			var isLastSlash = path.length > 1 && path[path.length - 1] == '/';
			if( isLastSlash ){
				var newPath = path.substr( 0, path.length -1 );
				$location.replace().path( newPath );
			}
		} );

		//404
		$urlRouterProvider.otherwise( function( $injector, $location ){
			//$injector.get( '$state' ).transitionTo( 'not-found', null, {location: false} );
			$injector.get( '$state' ).transitionTo( 'home', null, {location: false} );
		} );

		$stateProvider
		.state( 'home', {
			url: '/'
			,templateUrl: '/modules/core/client/views/home.client.view.html'
		} );
		$stateProvider
		.state( 'not-found', {
			url: 'not-found'
			,templateUrl: '/modules/core/client/views/404.client.view.html'
		} );
		//keys
		$stateProvider
		.state( 'keys-list', {
			url: '/keys-list'
			,templateUrl: '/modules/core/client/views/keys/keys.client.view.html'
		} );
	}
] );