'use strict';

angular.module( 'users.services' ).factory( 'Authentication', ['$window'
	,function( $window ){
		return {
			user: $window.user
			,be_server: $window.server
			,company: $window.company
		};
	}
] );