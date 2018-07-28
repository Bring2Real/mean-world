'use strict';

angular.module( 'users' ).config( ['$stateProvider'
	,function( $stateProvider ){
		$stateProvider
		.state( 'auth-signin', {
			url: '/auth-signin'
			,templateUrl: '/modules/users/client/views/signin.client.view.html'
		} );
		//User profile
		$stateProvider
		.state( 'user-profile', {
			url: '/user-profile'
			,templateUrl: '/modules/users/client/views/user/profile.client.view.html'
		} );
		//User change password
		$stateProvider
		.state( 'user-password', {
			url: '/user-password'
			,templateUrl: '/modules/users/client/views/user/password.client.view.html'
		} );
	}
] );