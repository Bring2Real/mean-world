'use strict';

angular.module( 'templates' ).config( ['$stateProvider'
	,function( $stateProvider ){
		$stateProvider
		.state( 'teasers-template', {
			url: '/teasers-template'
			,templateUrl: '/modules/templates/client/views/fields.client.view.html'
		} )
		.state( 'offer-template', {
			url: '/offer-template'
			,templateUrl: '/modules/templates/client/views/offer/offers.client.view.html'
		} );
	}
] );