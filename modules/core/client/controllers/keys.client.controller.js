'use strict';

angular.module( 'core.keys' ).controller( 'KeysAdminController', ['$scope', '$rootScope', 'Authentication', 'Notification', 'KeysService', '$uibModal', '$state', '$translate', '$window'
	,function( $scope, $rootScope, Authentication, Notification, KeysService, $uibModal, $state, $translate, $window ){
		$scope.keys = [];
		//check roles
		var user = Authentication.user;
	    var lang = (!user)?'en':user.language;

        if( user && !user.language ){
            user.language = navigator.language || navigator.userLanguage;
            user.language = user.language.split( '-' )[0];
            if( user.language != 'en' && user.language != 'de' && user.language != 'ru' ){
                user.language = 'en';
            }
            lang = user.language;
        }
        $translate.use( lang );

		if( !user ){
			$window.location.href = '/ssologin';
			return;
		}
		if( user.roles.indexOf( 'admin' ) == -1 && user.roles.indexOf( 'admin_company' ) == -1 ){
			$state.go( 'home' );
		}

		/*init list of keys*/
		$scope.initList = function(){
			$scope.keys = [];
			//query
			KeysService.query( {}, function( resp ){
				$scope.keys = resp.data;
				for( var i = 0; i < $scope.keys.length; i++ ){
					$scope.keys[i]['$remove'] = resp.$remove;
				}
			}
			,function( err ){
				console.log( err );
				Notification.error( {title: 'Keys', message: 'Load list failed!', delay: 3000} );
			} );
		}

		/*Open modal dialog*/
		$scope.showAddKeyModal = function(){
			var modalInstance = $uibModal.open( {
				templateUrl: 'modules/core/client/views/keys/modal.client.view.html'
				,controller: 'KeyAdminCreateController'
			} );
		};

		/*Remove key from list*/
		$scope.removeKey = function( key, index ){
			if( !confirm( 'Are you sure to remove API Key?' ) ){
				return false;
			}
			key.$remove( function(){
				$scope.keys.splice( index, 1 );
			}
			,function( err ){
				console.log( err );
				Notification.error( {message: 'Unable to remove API Key', delay: 3000} );
			} );
		};

		/*Set API Key to use*/
		$scope.setToUse = function( api_key ){
			KeysService.setUseKey( api_key )
			.then( function( response ){
				for( var i = 0; i < $scope.keys.length; i++ ){
					if( $scope.keys[i].api_key == api_key ){
						$scope.keys[i].used = true;
					}else{
						$scope.keys[i].used = false;
					}
				}
			}
			,function( err ){
				console.log( err );
				Notification.error( {message: 'Unable to set used key', delay: 3000} );
			} );
		};
	}
] )
.controller( 'KeyAdminCreateController', ['$scope', '$uibModalInstance', '$rootScope', 'Notification', 'KeysService', 'Authentication'
	,function( $scope, $uibModalInstance, $rootScope, Notification, KeysService, Authentication ){
		$scope.key = {
			api_key: ''
			,backend: (Authentication.user)?Authentication.user.be:''
			,key_date: null
			,disabled: true
			,used: false
		};

		/*Get API Key info from BE*/
		$scope.getKeyInfo = function(){
			if( $scope.key.api_key.length == 0 ){
				Notification.warning( {title: 'Add key', message: 'Fill Api Key area, please.', delay: 3000} );
				return false;
			}
			KeysService.getRequestKey( $scope.key.backend, $scope.key.api_key )
			.then( function( response ){
				if( !response.success ){
					Notification.warning( {title: 'Add key', message: response.message, delay: 3000} );
					return false;
				}
				$scope.key.key_date = response.rKey.key_date;
				$scope.key.disabled = response.rKey.disabled;
			}
			,function( err ){
				console.log( err );
				Notification.error( {title: 'Get Key Data', message: 'Unable to get key data!', delay: 3000} );
			} );
		};

		/*Store key*/
		$scope.storeKey = function( isValid ){
			if( !isValid ){
				return false;
			}
			var key = new KeysService( $scope.key );
			key.$save( function( response ){
				$uibModalInstance.close();
			}
			,function( err ){
				console.log( err );
				Notification.error( {message: 'Unable to store key!', delay: 3000} );
			} );
		};

		/*close modal dialog*/
		$scope.cancel = function(){
			$uibModalInstance.dismiss( 'cancel' );
		};
	}
] );