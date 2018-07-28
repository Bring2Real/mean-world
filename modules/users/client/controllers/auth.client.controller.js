'use strict';

angular.module( 'users' ).controller( 'SigninClientController', ['$scope', '$state', 'Authentication', 'Notification', 'UsersService'
	,function( $scope, $state, Authentication, Notification, UsersService ){
		$scope.sgin = {
			usernameOrEmail: ''
			,password: ''
		};

		/*send signin request*/
		$scope.signin = function( isValid ){
			if( !isValid ){
				Notification.error( {title: 'Signin Error', message: 'Unable to signin!', delay: 3000} );
				return false;
			}
			var rData = $scope.sgin;
			//angular.extend( rData, {useClient: 1} );
			UsersService.userSignin( rData )
			.then( function( response ){
				Authentication.user = response/*.user*/;
				window.user = response/*.user*/;
				Notification.success( {title: Authentication.user.displayName, message: 'Login successfull!', delay: 3000} );
				if( Authentication.user.roles.indexOf( 'admin' ) != -1 ){
					$state.go( 'keys-list' );
				}else{
					$state.go( 'home' );
				}
			}
			,function( err ){
				console.log( err );
				Notification.error( {title: 'Signin Error', message: 'Invalid credentials!', delay: 3000} );
			} );
		};
	}
] )