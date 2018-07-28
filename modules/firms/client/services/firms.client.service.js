'use strict';

angular.module( 'firms' ).factory( 'FirmsService', ['$resource', 'Authentication'
	,function( $resource, Authentication ){
		var be = (Authentication.user)?Authentication.user.be:'';
		var Firms = $resource( be + '/api/firms/:firmId', {firmId: '@_id'}, {
			get: {
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
			,firm_by_user: {
				url: be + '/api/firms/byuser'
				,withCredentials: true
				,isArray: false
				,method: 'GET'
			}
			,get_countries: {
				url: be + '/api/countries'
				,withCredentials: true
				,isArray: true
				,method: 'GET'
			}
		} );

		angular.extend( Firms, {
			firmByUser: function( user_id ){
				return this.firm_by_user( {user_id: user_id} ).$promise;
			}
			,getCountries: function(){
				return this.get_countries().$promise;
			}
		} );

		return Firms;
	}
] );