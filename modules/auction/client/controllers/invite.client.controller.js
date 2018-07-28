'use strict';

angular.module( 'auction' ).controller( 'InviteUserClientController', ['$state', '$uibModalInstance', 'Authentication', 'Notification', 'ProjectRelations', 'projectObj'
	,function( $state, $uibModalInstance, Authentication, Notification, ProjectRelations, projectObj ){
		var user = Authentication.user;
		if( !user ){
			$state.go( 'home' );
			return;
		}
		var vm = this;
		vm.lang = user.language || 'en';
		vm.invite = {
			email: ''
		};
		vm.process = false;

		/*Send invitation and store to db*/
		vm.storeInvite = function( isValid ){
			if( !isValid ){
				return false;
			}
			if( user.email === vm.invite.email ){
				Notification.warning( {message: 'You cannot invite yourself!', delay: 3000} );
				return false;
			}
			//If bank user - check domain of e-mail
			if( user.roles.indexOf( 'bank' ) != -1 ){
				var domain_user = user.email.split( '@' )[1];
				var domain_invite = vm.invite.email.split( '@' )[1];
				if( domain_invite !== domain_user ){
					Notification.warning( {message: 'You can invite users only from you bank!<br/>It means, that is subdomain of email address must be equal to you subdomain', delay: 8000} );
					return false;
				}
			}
			vm.process = true;
			var rSend = {
				user_email: vm.invite.email
				,project_id: projectObj.project_id
				,project_type: projectObj.project_type
				,project_name: projectObj.project_name
			};
			if( projectObj.auction_id ){
				rSend.auction_id = projectObj.auction_id;
			}
			if( projectObj.level ){
				rSend.level = projectObj.level;
			}
			var invite = new ProjectRelations( rSend );
			invite.$save( function( response ){
				vm.process = false;
				Notification.success( {message: 'Invite send successfully!', delay: 3000} );
				if( projectObj.stat ){
					projectObj.invited++;
				}
				$uibModalInstance.close();
			}
			,function( err ){
				vm.process = false;
				console.log( err );
				Notification.error( {message: 'Unable to send invitation!', delay: 3000} );
			} );
		};

		/*cancel*/
		vm.cancel = function(){
			$uibModalInstance.dismiss( 'cancel' );
		};
	}
] )
.controller( 'InviteOldUserClientController', ['$state', '$uibModalInstance', 'Authentication', 'Notification', 'ProjectRelations', 'projectObj'
	,function( $state, $uibModalInstance, Authentication, Notification, ProjectRelations, projectObj ){
		var user = Authentication.user;
		if( !user ){
			$state.go( 'home' );
			return;
		}
		var vm = this;
		vm.lang = user.language || 'en';
		vm.users = [];
		vm.invite = {
			email: ''
		};

		ProjectRelations.getBankUsers( {} )
		.then( function( response ){
			vm.users = response.data;
		}
		,function( err ){
			console.log( err );
			Notification.error( {message: 'Unable to send invitation!', delay: 3000} );
		} );

		vm.process = false;

		/*Send invitation and store to db*/
		vm.storeInvite = function( isValid ){
			if( !isValid ){
				return false;
			}
			if( user.email === vm.invite.email ){
				Notification.warning( {message: 'You cannot invite yourself!', delay: 3000} );
				return false;
			}
			//If bank user - check domain of e-mail
			if( user.roles.indexOf( 'bank' ) != -1 ){
				var domain_user = user.email.split( '@' )[1];
				var domain_invite = vm.invite.email.split( '@' )[1];
				if( domain_invite !== domain_user ){
					Notification.warning( {message: 'You can invite users only from you bank!<br/>It means, that is subdomain of email address must be equal to you subdomain', delay: 8000} );
					return false;
				}
			}
			vm.process = true;
			var rSend = {
				user_email: vm.invite.email
				,project_id: projectObj.project_id
				,project_type: projectObj.project_type
				,project_name: projectObj.project_name
			};
			if( projectObj.auction_id ){
				rSend.auction_id = projectObj.auction_id;
			}
			if( projectObj.level ){
				rSend.level = projectObj.level;
			}
			var invite = new ProjectRelations( rSend );
			invite.$save( function( response ){
				vm.process = false;
				Notification.success( {message: 'Invite send successfully!', delay: 3000} );
				if( projectObj.stat ){
					projectObj.invited++;
				}
				$uibModalInstance.close();
			}
			,function( err ){
				vm.process = false;
				console.log( err );
				Notification.error( {message: 'Unable to send invitation!', delay: 3000} );
			} );
		};

		/*cancel*/
		vm.cancel = function(){
			$uibModalInstance.dismiss( 'cancel' );
		};
	}
] );