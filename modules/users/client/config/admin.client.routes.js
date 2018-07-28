'use strict';

angular.module( 'users.admin' ).config( ['$stateProvider'
	,function( $stateProvider ){
		$stateProvider
		.state( 'users-list', {
			url: '/users-list'
			,templateUrl: '/modules/users/client/views/admin/list.client.view.html'
		} )
		.state( 'users-add', {
			url: '/users-add'
			,templateUrl: '/modules/users/client/views/admin/add-user.client.view.html'
		} )
		.state( 'users-edit', {
			url: '/users-edit/:userId'
			,templateUrl: '/modules/users/client/views/admin/edit-user.client.view.html'
		} ).state( 'users-reset', {
			url: '/reset-password/:userId'
			,templateUrl: '/modules/users/client/views/admin/reset-password.client.view.html'
		} );
	}
] );