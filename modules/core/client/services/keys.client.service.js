'use strict';

angular.module( 'core.keys' ).factory( 'KeysService', ['$resource', 'Authentication'
	,function( $resource, Authentication ){
		var user = Authentication.user;
		var be = (user)?user.be:'';
		var Keys = $resource( '/api/keys/:keyId', {
				keyId: '@id'
			},{
				query: {
					isArray: false
				}
				,update: {
					method: 'PUT'
				}
				,requestkey: {
					url: be + '/api/requestkey'
					,method: 'POST'
					,withCredentials: true
				}
				,usekey: {
					url: '/api/use_key'
					,method: 'POST'
				}
		} );

		angular.extend( Keys, {
			getRequestKey: function( backend, api_key ){
				return this.requestkey( {backend: backend, api_key: api_key} ).$promise;
			}
			,setUseKey: function( api_key ){
				return this.usekey( {api_key: api_key} ).$promise;
			}
		} );

		return Keys;
	}
] );