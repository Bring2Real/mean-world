'use strict';

angular.module( 'projects.relations' ).factory( 'ProjectRelations', ['$resource', 'Authentication'
	,function( $resource, Authentication ){
		var be = (Authentication.user)?Authentication.user.be:'';
		var Relation = $resource( be + '/api/relations', {}, {
			query: {
				isArray: false
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
			,projects_by_user: {
				url: be + '/api/relations/user'
				,withCredentials: true
				,isArray: false
				,method: 'GET'
			}
			,get_bank_users: {
				url: be + '/api/relations/bankusers'
				,withCredentials: true
				,isArray: false
				,method: 'GET'
			}
		} );

		angular.extend( Relation, {
			projectsByUser: function( params ){
				return this.projects_by_user( params ).$promise;
			}
			,getBankUsers: function( params ){
				return this.get_bank_users( params ).$promise;
			}
		} );
		return Relation;
	}
] );