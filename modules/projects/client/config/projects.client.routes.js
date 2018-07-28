'use strict';

angular.module( 'projects' ).config( ['$stateProvider'
	,function( $stateProvider ){
		$stateProvider
		.state( 'create-teaser', {
			url: '/create-teaser'
			,templateUrl: '/modules/projects/client/views/createproj.client.view.html'
		} )
		.state( 'all-teasers', {
			url: '/all-teasers'
			,templateUrl: '/modules/projects/client/views/list.client.view.html'
		} )
		.state( 'update-teaser', {
			url: '/update-teaser/:projId'
			,templateUrl: '/modules/projects/client/views/updateproj.client.view.html'
		} )
		.state( 'update-created-teaser', {
			url: '/update-created-teaser/:projId/:language'
			,templateUrl: '/modules/projects/client/views/updateproj.client.view.html'
		} )
		.state( 'teaser-expose', {
			url: '/expose/:projId'
			,templateUrl: '/modules/projects/client/views/expose/expose.client.view.html'
		} )
		.state( 'unit-update', {
			url: '/unit-update/:unitId'
			,templateUrl: '/modules/projects/client/views/modifyunit.client.view.html'
		} )
		.state( 'unit-create', {
			url: '/unit-create/:projId/:language'
			,templateUrl: '/modules/projects/client/views/createunit.client.view.html'
		} );
	}
] );