'use strict';

angular.module( 'company' ).factory( 'CompanySrc', ['$resource', 'Authentication'
	,function( $resource, Authentication ){
		var be = (Authentication.user)?Authentication.user.be:'';
		var Company = $resource( be + '/api/company', {}, {
			get_company: {
				isArray: false
				,method: 'GET'
				,withCredentials: true
			}
			,update_company: {
				isArray: false
				,method: 'POST'
				,withCredentials: true
			}
		} );
		angular.extend( Company, {
			getCompany: function(){
				return this.get_company().$promise;
			}
			,updateCompany: function( rUpdate ){
				return this.update_company( rUpdate ).$promise;
			}
		} );
		return Company;
	}
] );