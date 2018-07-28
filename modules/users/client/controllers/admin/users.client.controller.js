'use strict';

angular.module( 'users.admin' ).controller( 'UsersListClientController', ['$state', 'AdminService', 'Authentication', 'Notification', '$window'
	,function( $state, AdminService, Authentication, Notification, $window ){
		var user = Authentication.user;
		if( !user ){
			$state.go( 'home' );
			return;
		}
		if( user.roles.indexOf( 'admin_company' ) == -1 ){
			$state.go( 'home' );
			return;
		}
		var vm = this;

		/*initialize list*/
		vm.initList = function(){
			vm.users = [];
			vm.usersSafe = [];
			AdminService.query( {}, function( response ){
				for( var i = 0; i < response.length; i++ ){
					if( user.username == response[i].username ) continue; //me
					vm.users.push( response[i] );
				}
				vm.usersSafe = vm.users
			}
			,function( err ){
				console.log( err );
				Notification.error( {message: 'Unable to load users list!', delay: 3000} );
			} );
		};

		/*Remove user*/
        vm.remove = function( user, index ){
            if( $window.confirm( 'Are you sure you want to delete this user?' ) ){
                if( user ){
                    user.$remove( function(){
	                    vm.users.splice( index, 1 );
	                    vm.usersSafe.splice( index, 1 );
	                    Notification.success( 'User deleted successfully!' );
                    }
                    ,function( err ){
						console.log( err );
						Notification.error( {message: 'Unable to remove user from list!', delay: 3000} );
                    } );
                }else{
                    vm.user.$remove( function(){
                        $state.go( 'users-list' );
                        Notification.success( { message: '<i class="glyphicon glyphicon-ok"></i> User deleted successfully!' } );
                    });
                }
            }
        }

	}
] )
.controller( 'UsersCreateClientController', ['$state', 'AdminService', 'Authentication', 'Notification'
	,function( $state, AdminService, Authentication, Notification ){
		var user = Authentication.user;
		if( !user ){
			$state.go( 'home' );
			return;
		}
		if( user.roles.indexOf( 'admin_company' ) == -1 ){
			$state.go( 'home' );
			return;
		}
		var vm = this;

		vm.user = {
            username: ''
            ,firstName: ''
            ,lastName: ''
            ,email: ''
            ,language: 'en'
            ,roles: ['user']
            ,phone: ''
		};
		vm.roles = [];
		vm.selectedRoles = [];
		AdminService.getRoles()
		.then( function( response ){
			var roles = response || [];
			for( var i = 0; i < roles.length; i++ ){
				if( roles[i] == 'admin' ) continue;
				vm.roles.push( {id: roles[i], name: roles[i]} );
			}
		} );

		/*Add new user*/
		vm.addUser = function( isValid ){
			if( !isValid ){
				Notification.warning( {message: 'Please fill form correctly', delay: 3000} );
				return false;
			}
			vm.user.roles = vm.selectedRoles.map( function( value ){
                return value.id;
            } );
			var usr = new AdminService( vm.user );
            usr.$save( function(){
                $state.go( 'users-list' );
                Notification.success( { message: '<i class="glyphicon glyphicon-ok"></i> User added successfully!' } );
            }
            ,function( errorResponse ){
                console.log( errorResponse );
                Notification.error( { message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User add error!' } );
            } );
		};

        //set active user lang
        vm.setActiveLangUser = function( lang ){
            vm.user.language = lang;
        };

        //is active lang user
        vm.isActiveLangUser = function( lang ){
            return vm.user.language == lang;
        };
	}
] )
.controller( 'UsersUpdateClientController', ['$state', '$stateParams', 'AdminService', 'Authentication', 'Notification'
	,function( $state, $stateParams, AdminService, Authentication, Notification ){
		var user = Authentication.user;
		if( !user ){
			$state.go( 'home' );
			return;
		}
		if( user.roles.indexOf( 'admin_company' ) == -1 ){
			$state.go( 'home' );
			return;
		}
		var vm = this;

		vm.roles = [];
		vm.user = {};

		AdminService.get( {userId: $stateParams.userId}, function( response ){
			vm.user = response;
            vm.selectedRoles = vm.user.roles.map( function( value ){
                return {id: value, name: value}
            } );
            AdminService.getRoles()
			.then( function( response ){
				var roles = response || [];
				for( var i = 0; i < roles.length; i++ ){
					if( roles[i] == 'admin' ) continue;
					vm.roles.push( {id: roles[i], name: roles[i]} );
				}
			} );
		}
		,function( err ){
			console.log( err );
			Notification.error( {message: 'Unable to get user info!', delay: 3000} );
		} );

		/*Update user*/
		vm.update = function( isValid ){
			if( !isValid ){
				Notification.warning( {message: 'Please fill form correctly', delay: 3000} );
				return false;
			}
            vm.user.roles = vm.selectedRoles.map( function( value ){
                return value.id;
            } );
            var user = vm.user;
            user.$update( function(){
                $state.go( 'users-list' );
                Notification.success( { message: '<i class="glyphicon glyphicon-ok"></i> User saved successfully!' } );
            }
            ,function( errorResponse ){
                Notification.error( { message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User update error!' } );
            } );
		};

        //set active user lang
        vm.setActiveLangUser = function( lang ){
            vm.user.language = lang;
        };

        //is active lang user
        vm.isActiveLangUser = function( lang ){
            return vm.user.language == lang;
        };
	}
] )
.controller( 'UsersResetPasswordClientController', ['$state', '$stateParams', 'AdminService', 'Authentication', 'Notification', 'PasswordStrength'
	,function( $state, $stateParams, AdminService, Authentication, Notification, PasswordStrength ){
		var user = Authentication.user;
		if( !user ){
			$state.go( 'home' );
			return;
		}
		if( user.roles.indexOf( 'admin_company' ) == -1 ){
			$state.go( 'home' );
			return;
		}
		var vm = this;

		vm.passwordDetails = {
			newPassword: ''
			,verifyPassword: ''
		};
		vm.user = {};
		AdminService.get( {userId: $stateParams.userId}, function( response ){
			vm.user = response;
		}
		,function( err ){
			console.log( err );
			Notification.error( {message: 'Unable to get user info!', delay: 3000} );
		} );

		/*Reset password for user*/
        vm.resetPassword = function( isValid ){
            if( !isValid ){
                Notification.warning( {message: 'Please fill form correctly', delay: 3000} );
                return false;
            }
            var rSend = {
                newPassword: vm.passwordDetails.newPassword
                ,verifyPassword: vm.passwordDetails.verifyPassword
                ,_id: vm.user._id
            };
            AdminService.updatePassword( rSend )
            .then( function(){
                // If successful show success message and clear form
                Notification.success( { message: '<i class="glyphicon glyphicon-ok"></i> Password Changed Successfully' } );
                vm.passwordDetails = null;
                rSend = null;
                $state.go( 'users-list' );
            } )
            .catch( function( err ){
                console.log( err );
                Notification.error( { message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Password change failed!' } );
            } );
        }
	}
] );