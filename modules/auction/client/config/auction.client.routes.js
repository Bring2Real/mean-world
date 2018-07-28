'use strict';

angular.module( 'auction' ).config( ['$stateProvider'
	,function( $stateProvider ){
		$stateProvider
		.state( 'add-offer', {
			url: '/add-offer/:projId'
			,templateUrl: '/modules/auction/client/views/modifyoffer.client.view.html'
		} )
		.state( 'auction', {
			url: '/auction/:projId'
			,templateUrl: '/modules/auction/client/views/auction.client.view.html'
		} )
		.state( 'offers', {
			url: '/offers'
			,templateUrl: '/modules/auction/client/views/adminoffer.client.view.html'
			,params: {
				bankId: null
				,round: null
				,lang: null
				,auctionId: null
			}
		} );
	}
] );