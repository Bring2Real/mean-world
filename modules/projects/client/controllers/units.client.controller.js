'use strict';

angular.module( 'projects' ).controller( 'UnitUpdateClientController', ['$state', '$stateParams', 'Authentication', 'Notification', 'UnitsService', '$rootScope'
	,function( $state, $stateParams, Authentication, Notification, UnitsService, $rootScope ){
		var user = Authentication.user;
		if( !user ){
			$state.go( 'home' );
			return;
		}
		if( user.roles.indexOf( 'admin_company' ) == -1 && user.roles.indexOf( 'admin_project' ) == -1 ){
			$state.go( 'home' );
			return;
		}

		if( !( 'unitId' in $stateParams ) ){
			Notification.error( {message: 'Not enougth params!', delay: 3000} );
			window.history.back();
			return false;
		}

		var vm = this;
		vm.unit = {};
		vm.fields = [];

		/*Initialise data to update unit*/
		vm.initUnit = function(){
			vm.unit = {};
			vm.fields = [];
			angular.element( '.loading' ).show();
			UnitsService.get( {}, {_id: $stateParams.unitId}, function( response ){
				vm.unit = response.data;
				vm.fields = vm.unit.unit_data;
				angular.element( '.loading' ).hide();
			}
			,function( err ){
				angular.element( '.loading' ).hide();
				console.log( err );
				Notification.error( {message: 'Unable to load unit!', delay: 3000} );
			} );
		};


		/*Store updated data*/
		vm.storeUnit = function( isValid ){
			if( !isValid ){
				Notification.warning( {message: 'Fill form correctly, please!', delay: 3000} );
				return false;
			}
			var rSave = {
				_id: vm.unit._id
				,unit_data: []
			};
			for( var i = 0; i < vm.fields.length; i++ ){
				rSave.unit_data.push( {
					field_caption: vm.fields[i].field_caption
					,field_name: vm.fields[i].field_name
					,field_type: vm.fields[i].field_type
					,field_pos: vm.fields[i].field_pos
					,value: vm.fields[i].value
					,hidden: vm.fields[i].hidden || false
				} );
			}
			UnitsService.update( rSave, function( response ){
				Notification.success( {message: 'Unit updates successfully!', delay: 2000} );
				vm.cancelUpdate();
			}
			,function( err ){
				console.log( err );
				Notification.error( {message: 'Unable to store unit!', delay: 3000} );
			} );
		};


		/*Cancel update*/
		vm.cancelUpdate = function(){
			window.history.back();
		};

		var watch = $rootScope.$watch( "menuValues['project_type']", function( newVal, oldVal ){
			if( newVal != oldVal && confirm( 'Do you want to abort editing?' ) ){
				$state.go( 'home' );
			}
		}, true );

		/*Destroy events*/
		vm.$onDestroy = function(){
			watch();
		};
	}
] )
.controller( 'UnitCreateClientController', ['$state', '$stateParams', 'Authentication', 'Notification', 'UnitsService', 'TemplateService', '$rootScope'
	,function( $state, $stateParams, Authentication, Notification, UnitsService, TemplateService, $rootScope ){
		var user = Authentication.user;
		if( !user ){
			$state.go( 'home' );
			return;
		}
		if( user.roles.indexOf( 'admin_company' ) == -1 && user.roles.indexOf( 'admin_project' ) == -1 ){
			$state.go( 'home' );
			return;
		}

		if( !( 'language' in $stateParams ) || !( 'projId' in $stateParams ) ){
			Notification.error( {message: 'Not enougth params!', delay: 3000} );
			window.history.back();
			return false;
		}

		var vm = this;
		vm.unit = {};
		vm.fields = [];
		var template_type = ($rootScope.menuValues && $rootScope.menuValues.project_type)?$rootScope.menuValues.project_type:1;
		var unit_fields = localStorage.getItem( 'unit_data' );
		if( !unit_fields ){
			Notification.error( {message: 'Not enougth params!', delay: 3000} );
			window.history.back();
			return false;
		}
		unit_fields = JSON.parse( unit_fields );

		vm.initUnit = function(){
			vm.fields = [];
			var field = {};
			if( unit_fields.length != 0 ){
				//Get fields from local template
				for( var i = 0; i < unit_fields.length; i++ ){
					field = {
						field_name: unit_fields[i].field_name
						,field_caption: unit_fields[i].field_caption
						,field_type: unit_fields[i].field_type
						,field_opts: unit_fields[i].field_opts
						,field_required: unit_fields[i].field_required || false
						,field_default: unit_fields[i].field_default
						,field_pos: unit_fields[i].field_pos
						,value: ''
						,hidden: unit_fields[i].hidden || false
					};
					vm.fields.push( field );
				}
			}else{
				angular.element( '.loading' ).show();
				TemplateService.query( {language: $stateParams.language, template_type: template_type, template: 2}, function( response ){
					angular.element( '.loading' ).hide();
					if( !response.data || response.data.length == 0 ){
						Notification.error( {message: 'No template for unit presents!', delay: 3000} );
						window.history.back();
						return false;
					}
					for( var i = 0; i < response.data.length; i++ ){
						field = {
							field_name: response.data[i].field_name
							,field_caption: response.data[i].field_caption
							,field_type: response.data[i].field_type
							,field_opts: response.data[i].field_opts
							,field_required: response.data[i].field_required || false
							,field_default: response.data[i].field_default
							,field_pos: response.data[i].field_pos
							,value: ''
							,hidden: response.data[i].hidden || false
						};
						vm.fields.push( field );
					}
				}
				,function( err ){
					angular.element( '.loading' ).hide();
					Notification.error( {message: 'Error load template for unit!', delay: 3000} );
					window.history.back();
				} );
			}
		};


		/*Store created unit*/
		vm.storeUnit = function( isValid ){
			if( !isValid ){
				Notification.warning( {message: 'Fill form correctly, please!', delay: 3000} );
				return false;
			}
			var rSave = {
				project_id: $stateParams.projId
				,language: $stateParams.language
				,unit_data: vm.fields
			};
			angular.element( '.loading' ).show();
			var unit = new UnitsService( rSave );
			unit.$save( function( response ){
				angular.element( '.loading' ).hide();
				Notification.success( {message: 'Unit created successfully!', delay: 2000} );
				window.history.back();
			}
			,function( err ){
				angular.element( '.loading' ).hide();
				Notification.error( {message: 'Error create unit!', delay: 3000} );
			} );
		};


		/*Cancel create form*/
		vm.cancelCreate = function(){
			localStorage.removeItem( 'unit_data' );
			window.history.back();
		};

		var watch = $rootScope.$watch( "menuValues['project_type']", function( newVal, oldVal ){
			if( newVal != oldVal && confirm( 'Do you want to abort creating?' ) ){
				$state.go( 'home' );
			}
		}, true );

		/*Destroy events*/
		vm.$onDestroy = function(){
			watch();
		};

	}
] );