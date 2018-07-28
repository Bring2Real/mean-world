'use strict';

angular.module( 'core' ).controller( 'HomeClientController', [ '$scope', 'Authentication', '$state', '$window'
	,function( $scope, Authentication, $state, $window ){
		var user = Authentication.user;

		if( !user ){
			//go to the SSO page
			$window.location.href = '/ssologin';
			return;
		}

		if( user && user.roles.indexOf( 'admin' ) != -1 ){
			$state.go( 'keys-list' );
		}
		$scope.isAutenticated = (user)?true:false;
		$scope.org = (user)?user.org:'';

		$scope.goLogin = function(){
			$window.location.href = '/ssologin';
		}
} ] );