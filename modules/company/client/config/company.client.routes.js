'use strict';

angular.module( 'company' ).config( ['$stateProvider'
	,function( $stateProvider ){
		$stateProvider
		.state( 'update-company', {
			url: '/update-company'
			,templateUrl: '/modules/company/client/views/company.client.view.html'
		} );
	}
] );