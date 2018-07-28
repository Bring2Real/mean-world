'use strict';

angular.module( 'users' ).controller( 'UserProfileClientController', ['$scope', '$state', '$cookies', '$translate', 'Authentication', 'Notification', 'UsersService'
	,function( $scope, $state, $cookies, $translate, Authentication, Notification, UsersService ){
		$scope.user_profile = {};
		var user = Authentication.user;

		if( !user ){
			$state.go( 'home' );
			return;
		}
		$scope.user_profile = user;

		/*is language active*/
		$scope.isActiveLang = function( lang ){
			return user.language == lang;
		};

		/*set active language*/
		$scope.setActiveLang = function( lang ){
			user.language = lang;
			Authentication.language = lang;
			$translate.use( lang );
		};

		/*store changes*/
		$scope.updateProfile = function( isValid ){
			if( !isValid ){
				return false;
			}
			var rUpdate = {
				email: $scope.user_profile.email
				,firstName: $scope.user_profile.firstName
				,lastName: $scope.user_profile.lastName
				,org: $scope.user_profile.org
				,language: user.language
				,phone: $scope.user_profile.phone
			};
			UsersService.updateUser( rUpdate )
			.then( function( response ){
				Authentication.user.firstName = rUpdate.firstName;
				Authentication.user.lastName = rUpdate.lastName;
				Authentication.user.org = rUpdate.org;
				Authentication.user.language = rUpdate.language;
				user = Authentication.user;
				window.user = Authentication.user;
				UsersService.updateLocal( user )
				.then( function(){
					Notification.success( {title: 'Update user', message: 'Success!', delay: 3000} );
					$state.go( 'home' );
				}
				,function( err ){
					console.log( err );
					Notification.error( {message: 'Unable to update user profile on local!', delay: 3000} );
				} );
			}
			,function( err ){
				console.log( err );
				Notification.error( {message: 'Unable to update user profile!', delay: 3000} );
			} );
		};
	}
] )
.controller( 'UserPasswordClientController', ['$scope', '$state', '$translate', 'Authentication', 'Notification', 'UsersService', 'PasswordStrength'
	,function( $scope, $state, $translate, Authentication, Notification, UsersService, PasswordStrength ){
		var user = Authentication.user;
		$scope.passwordDetails = {
			currentPassword: ''
			,newPassword: ''
			,verifyPassword: ''
		};

		if( !user ){
			$state.go( 'home' );
			return;
		}

		$scope.getPopoverMsg = PasswordStrength.getPopoverMsg;

		/*Send request for change password*/
		$scope.changePassword = function( isValid ){
			if( !isValid ){
				return false;
			}
			var rChange = {
				currentPassword: $scope.passwordDetails.currentPassword
				,newPassword: $scope.passwordDetails.newPassword
				,verifyPassword: $scope.passwordDetails.verifyPassword
			};

			UsersService.changePassword( rChange )
			.then( function( response ){
				Notification.success( {title: 'Change user password', message: 'Success!', delay: 3000} );
				$state.go( 'home' );
			}
			,function( err ){
				console.log( err );
				Notification.error( {message: 'Unable to change user password!', delay: 3000} );
			} );
		};
	}
] );