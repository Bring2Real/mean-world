'use strict';

angular.module( 'users.services' ).factory( 'UsersService', ['$resource', 'Authentication'
	,function( $resource, Authentication ){
		var user = Authentication.user;
		var be = (user)?user.be:'';
		var Users = $resource( '/local/user', {}, {
			update: {
				method: 'PUT'
			}
			,signout: {
				url: be + '/api/ssosignout'
				,method: 'GET'
				,withCredentials: true
			}
			,updateuser: {
				url: be + '/api/user/update'
				,method: 'PUT'
				,withCredentials: true
			}
			,changepassword: {
				url: be + '/api/user/password'
				,method: 'POST'
				,withCredentials: true
			}
			,update_local: {
				method: 'PUT'
				,isArray: false
			}
			,get_users: {
				url: be + '/api/users'
				,method: 'GET'
				,withCredentials: true
				,isArray: true
			}
		} );

		angular.extend( Users, {
			userSignout: function(){
				return this.signout().$promise;
			}
			,updateUser: function( rUser ){
				return this.updateuser( rUser ).$promise;
			}
			,changePassword: function( rPasswd ){
				return this.changepassword( rPasswd ).$promise;
			}
			,updateLocal: function( user ){
				return this.update_local( user ).$promise;
			}
			,getUsers: function( params ){
				return this.get_users( params ).$promise;
			}
		} );
		return Users;
	}
] );