'use strict';

angular.module( 'auction.offers' ).factory( 'OfferService', ['$resource', 'Authentication'
	,function( $resource, Authentication ){
		var be = (Authentication.user)?Authentication.user.be:'';
		var Offer = $resource( be + '/api/offers/:offerId', {offerId: '@_id'}, {
			query: {
				isArray: false
				,withCredentials: true
				,method: 'GET'
			}
			,get: {
				withCredentials: true
				,isArray: false
				,method: 'GET'
			}
			,save: {
				withCredentials: true
				,isArray: false
				,method: 'POST'
			}
			,update: {
				method: 'PUT'
				,withCredentials: true
				,isArray: false
			}
			,remove: {
				method: 'DELETE'
				,withCredentials: true
				,isArray: false
			}
		} );

		return Offer;
	}
] );