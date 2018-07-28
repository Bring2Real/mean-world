'use strict';

angular.module( 'users.admin' ).factory( 'AdminService', ['$resource', 'Authentication'
	,function( $resource, Authentication ){
		var user = Authentication.user;
		var be = (user)?user.be:'';
		var Admin = $resource( be + '/api/admin/users/:userId', {userId: '@_id'},{
			query: {
				isArray: true
				,withCredentials: true
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
			,get_roles: {
				url: be + '/api/users/roles'
				,isArray: true
				,method: 'GET'
				,withCredentials: true
			}
			,update_password: {
				url: be + '/api/users/resetpassword/:userId'
				,method: 'POST'
				,withCredentials: true
				,isArray: false
			}
		} );

		angular.extend( Admin, {
			getRoles: function(){
				return this.get_roles().$promise;
			}
			,updatePassword: function( rPassword ){
				return this.update_password( rPassword ).$promise;
			}
		} );
		return Admin;
	}
] );