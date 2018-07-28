'use strict';

angular.module( 'firms' ).controller( 'UpdateFirmClientController', ['$state', '$stateParams', 'Authentication', 'Notification', 'FirmsService'
	,function( $state, $stateParams, Authentication, Notification, FirmsService ){
		var user = Authentication.user;
		if( !user ){
			$state.go( 'home' );
			return;
		}

		var vm = this;
		vm.firm = {};
		vm.countries = [];

		angular.element( '.loading' ).show();
		FirmsService.getCountries().
		then( function( response ){
			vm.countries = response;
			if( $stateParams.firmId ){
				FirmsService.get( {}, {_id: $stateParams.firmId}, function( response ){
					vm.firm = response.data;
					angular.element( '.loading' ).hide();
				}
				,function( err ){
					console.log( err );
					angular.element( '.loading' ).hide();
					Notification.error( {message: 'Unable to get firm!', delay: 3000} );
				} );
			}else{
				FirmsService.firmByUser()
				.then( function( response ){
					vm.firm = response.data;
					angular.element( '.loading' ).hide();
				}
				,function( err ){
					console.log( err );
					angular.element( '.loading' ).hide();
					Notification.error( {message: 'Unable to get firm!', delay: 3000} );
				} );
			}
		} );


		/*Store update*/
		vm.storeFirm = function( isValid ){
			if( !isValid ){
				return false;
			}
			FirmsService.update( vm.firm, function( response ){
				Notification.success( {message: 'Bank updated successfully!', delay: 3000} );
			}
			,function( err ){
				console.log( err );
				Notification.error( {message: 'Unable to update firm!', delay: 3000} );
			} );
		};


		/*Cancel update*/
		vm.cancelUpdate = function(){
			$state.go( 'home' );
		};
	}
] );