'use strict';

angular.module( 'firms' ).config( ['$stateProvider'
	,function( $stateProvider ){
		$stateProvider
		.state( 'update-bank', {
			url: '/update-bank'
			,templateUrl: '/modules/firms/client/views/updatefirm.client.view.html'
		} );
	}
] );