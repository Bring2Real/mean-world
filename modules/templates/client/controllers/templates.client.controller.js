'use strict';

angular.module( 'templates' ).controller( 'TemplateFieldsClientController', ['$state', '$uibModal', 'Authentication', 'Notification', 'TemplateService', '$translate', '$rootScope'
	,function( $state, $uibModal, Authentication, Notification, TemplateService, $translate, $rootScope ){
		var user = Authentication.user;
		if( !user ){
			$state.go( 'home' );
			return;
		}
		if( user.roles.indexOf( 'admin_company' ) == -1 ){
			$state.go( 'home' );
			return;
		}
		var types = [];
		var vm = this;
		vm.lang = Authentication.company.language || 'en';

		vm.createDisabled = false; //for future
		vm.showCreateBtns = false; //for show create buttons (field or from super)
		vm.rootCreate = true;
		vm.showUpdatePos = false;
		vm.storetoall = true;
		vm.languages = [];
		vm.showUpdatePosUnits = false;

		/*Initialize fields list of template*/
		vm.initFields = function(){
			var template_type = ($rootScope.menuValues && $rootScope.menuValues.project_type)?$rootScope.menuValues.project_type:1;
			vm.showUpdatePos = false;
			vm.proj_fields = [];
			vm.unit_fields = [];
			vm.strLanguage = $translate.instant( vm.lang.toUpperCase() );
			vm.projectTemplateTitle = (template_type == 1)?'Finance':'Marketing';
			vm.projectTemplateTitle += ' Teaser Template';
			angular.element( '.loading' ).show();
			TemplateService.query( {language: vm.lang, template_type: template_type}, function( response ){
				angular.element( '.loading' ).hide();
				if( response.data ){
					for( var i = 0; i < response.data.length; i++ ){
						if( response.data[i].template == 1 ){
							vm.proj_fields.push( response.data[i] );
						}else{
							vm.unit_fields.push( response.data[i] );
						}
					}
					if( vm.proj_fields.length || vm.unit_fields.length ){
						vm.rootCreate = false;
					}else if( vm.proj_fields.length == 0 ){
						vm.rootCreate = true;
					}
				}
				types = response.types;
				vm.languages = response.languages;
			}
			,function( err ){
				console.log( err );
				Notification.error( {message: 'Unable to load fields list!', delay: 3000} );
			} );
		};

		/*Copy template from supertemplate*/
		vm.copyFromSuperTemplate = function( tpl ){
			var default_language = true;
			for( var i = 0; i < vm.languages.length; i++ ){
				if( vm.lang == vm.languages[i].language ){
					default_language = vm.languages[i].default_language;
					break;
				}
			}
			var template_type = ($rootScope.menuValues && $rootScope.menuValues.project_type)?$rootScope.menuValues.project_type:1;
			angular.element( '.loading' ).show();
			TemplateService.copyFromSuper( {language: vm.lang, template_type: template_type, template: tpl, default_language: default_language} )
			.then( function( response ){
				angular.element( '.loading' ).hide();
				if( response.data ){
					for( var i = 0; i < response.data.length; i++ ){
						if( response.data[i].template == 1 ){
							vm.proj_fields.push( response.data[i] );
						}else{
							vm.unit_fields.push( response.data[i] );
						}
					}
					vm.showCreateBtns = false;
					vm.rootCreate = false;
					Notification.success( {message: 'Template created succesfully', delay: 3000} );
				}
			}
			,function( err ){
				angular.element( '.loading' ).hide();
				console.log( err );
				Notification.error( {message: 'Unable to create fields list!', delay: 3000} );
			} );
		};

		/*Remove field from list*/
		vm.removeField = function( id, index, tpl ){
			if( !id ){
				Notification.error( {message: 'Ooops!', delay: 3000} );
				return false;
			}
			if( !confirm( 'Are you sure to remove field?' ) ){
				return false;
			}
			angular.element( '.loading' ).show();
			TemplateService.remove( {}, {_id: id}, function( response ){
				var fields = (tpl == 1)?'proj_fields':'unit_fields';
				vm[fields].splice( index, 1 );
				//bulk update
				if( vm[fields].length > 0 ){
					var updates = rebuildPositions( tpl );
					TemplateService.bulkUpdate( updates )
					.then( function( response ){
						angular.element( '.loading' ).hide();
						Notification.success( {message: 'Remove field successfully!', delay: 3000} );
					}
					,function( err ){
						angular.element( '.loading' ).hide();
						console.log( err );
						Notification.error( {message: 'Cannot update fields positions!', delay: 3000} );
					} );
				}else{
					angular.element( '.loading' ).hide();
					Notification.success( {message: 'Remove field successfully!', delay: 3000} );
				}
			}
			,function( err ){
				angular.element( '.loading' ).hide();
				console.log( err );
				Notification.error( {message: 'Cannot remove field!', delay: 3000} );
			} );
		};

		/*Move project field*/
		vm.moveField = function( index, direction, tpl ){
			var new_pos = index + direction;
			var tpl_pos = (tpl == 1)?'proj_fields':'unit_fields';
			var field = vm[tpl_pos][index];
			if( tpl_pos == 'proj_fields' ){
				if( !vm.showUpdatePos ){
					vm.showUpdatePos = true;
				}
			}else{
				if( !vm.showUpdatePosUnits ){
					vm.showUpdatePosUnits = true;
				}
			}
			if( new_pos < 0 ){
				new_pos = vm[tpl_pos].length - 1
			}else if( new_pos > vm[tpl_pos].length - 1 ){
				new_pos = 0;
			}
			vm[tpl_pos].splice( index, 1 );
			vm[tpl_pos].splice( new_pos, 0, field );
		};


		/*Change language of template*/
		vm.changeLanguage = function( lang ){
			vm.lang = lang;
			vm.initFields();
		};

		/*Set default language*/
		vm.setDefaultLanguage = function( lang ){
			TemplateService.setDefaultLanguage( {language: lang, template_type: $rootScope.menuValues.project_type} )
			.then( function( response ){
				vm.languages = response.data;
			}
			,function( err ){
				console.log( err );
				Notification.error( {message: 'Cannot set default language!', delay: 3000} );
			} );
		};

		/*Remove by language and template_type*/
		vm.removeLanguage = function( lang ){
			if( !confirm( 'Are you sure to remove language?' ) ){
				return false;
			}
			angular.element( '.loading' ).show();
			TemplateService.removeByLanguage( {language: lang, template_type: $rootScope.menuValues.project_type} )
			.then( function( response ){
				angular.element( '.loading' ).hide();
				Notification.success( {message: 'Language removing successfully', delay: 3000} );
				vm.languages = response.languages;
			}
			,function( err ){
				angular.element( '.loading' ).hide();
				console.log( err );
				Notification.error( {message: 'Cannot remove language!', delay: 3000} );
			} );
		};

		/*Show add language dialog*/
		vm.addNewLanguage = function(){
			var modalInstance = $uibModal.open( {
				templateUrl: '/modules/core/client/views/utils/language.client.modal.html'
				,controller: 'AddNewTemplateLanguageClientController'
				,controllerAs: 'vm'
			} );
		};

		/*Store field positions*/
		vm.updateFieldsPos = function( tpl ){
			if( !tpl ){
				Notification.error( {message: 'Ooops!', delay: 3000} );
				return false;
			}
			var updates = rebuildPositions( tpl );
			//bulk update
			angular.element( '.loading' ).show();
			TemplateService.bulkUpdate( updates )
			.then( function( response ){
				angular.element( '.loading' ).hide();
				Notification.success( {message: 'Update positions successfully!', delay: 3000} );
				if( tpl == 1 ){
					vm.showUpdatePos = false;
				}else{
					vm.showUpdatePosUnits = false;
				}
			}
			,function( err ){
				angular.element( '.loading' ).hide();
				console.log( err );
				Notification.error( {message: 'Cannot update fields positions!', delay: 3000} );
			} );
		};

		/*Show create field dialog*/
		vm.showFieldCreateDialog = function( tpl ){
			if( !tpl ){
				Notification.error( {message: 'Ooops!', delay: 3000} );
				return false;
			}
			var field_types = [];
			//if unit, then 4, 5, 6 field types are not available
			for( var i = 0; i < types.length; i++ ){
				if( tpl != 1 && types[i].id > 3 ) continue;
				field_types.push( types[i] );
			}
			var modalInstance = $uibModal.open( {
				templateUrl: '/modules/templates/client/views/field.client.modal.html'
				,controller: 'ModifyFieldClientController'
				,controllerAs: 'vm'
				,resolve: {
					fieldObj: function(){
						var captions = [];
						if( tpl == 1 ){
							captions = vm.proj_fields.map( function( value ){
								return value.field_caption;
							} );
						}else{
							captions = vm.unit_fields.map( function( value ){
								return value.field_caption;
							} );
						}
						return {
							update: false
							,types: field_types
							,tpl: tpl
							,lastIndex: (tpl == 1)?vm.proj_fields.length:vm.unit_fields.length
							,language: vm.lang
							,storetoall: vm.storetoall
							,captions: captions
						};
					}
				}
			} );
		};


		/*Show update field dialog*/
		vm.showFieldUpdateDialog = function( field ){
			if( !field ){
				Notification.error( {message: 'Ooops!', delay: 3000} );
				return false;
			}
			var field_types = [];
			//if unit, then 4, 5, 6 field types are not available
			for( var i = 0; i < types.length; i++ ){
				if( field.template != 1 && types[i].id > 3 ) continue;
				field_types.push( types[i] );
			}
			var modalInstance = $uibModal.open( {
				templateUrl: '/modules/templates/client/views/field.client.modal.html'
				,controller: 'ModifyFieldClientController'
				,controllerAs: 'vm'
				,resolve: {
					fieldObj: function(){
						var captions = [];
						if( field.template == 1 ){
							captions = vm.proj_fields.map( function( value ){
								return value.field_caption;
							} );
						}else{
							captions = vm.unit_fields.map( function( value ){
								return value.field_caption;
							} );
						}
						return {
							update: true
							,types: field_types
							,tpl: field.template
							,lastIndex: (field.template == 1)?vm.proj_fields.length:vm.unit_fields.length
							,language: vm.lang
							,field: field
							,storetoall: vm.storetoall
							,captions: captions
						};
					}
				}
			} );
		};

		/*Rebuild field positions*/
		function rebuildPositions( tpl )
		{
			var updates = [];
			var fields = (tpl == 1)?'proj_fields':'unit_fields';
			for( var i = 0; i < vm[fields].length; i++ ){
				vm[fields][i].field_pos = i + 1;
				updates.push( {_id: vm[fields][i]._id, field_pos: vm[fields][i].field_pos, language: vm[fields][i].language} );
			}
			return updates;
		}


		//watch for template type
		var watch = $rootScope.$watch( 'menuValues.project_type', function( newVal, oldVal ){
			//reload list of fields
			vm.initFields();
		}, true );

		//Event to reload languages
		var watch1 = $rootScope.$on( 'refreshLangs', function( events, args ){
			vm.languages = args.languages;
		} );

		//Add field without reload
		var watch2 = $rootScope.$on( 'createField', function( events, args ){
			if( args.field.language == vm.lang ){
				var fields = (args.field.template == 1)?'proj_fields':'unit_fields';
				vm[fields].push( args.field );
				//if first field
				if( vm[fields].length == 1 ){
					vm.rootCreate = false;
				}
			}
		} );

		//Set changes without reload
		var watch3 = $rootScope.$on( 'updateField', function( events, args ){
			if( args.field.language == vm.lang ){
				var fields = (args.field.template == 1)?'proj_fields':'unit_fields';
				for( var i = 0; i < vm[fields].length; i++ ){
					if( vm[fields][i]._id == args.field._id ){
						vm[fields][i] = args.field;
						break;
					}
				}
			}
		} );

		/*Destroy events*/
		vm.$onDestroy = function(){
			watch();
			watch1();
			watch2();
			watch3();
		};
	}
] )
.controller( 'ModifyFieldClientController', ['$uibModalInstance', '$rootScope', 'Notification', 'TemplateService', 'fieldObj'
	,function( $uibModalInstance, $rootScope, Notification, TemplateService, fieldObj ){
		var vm = this;

		vm.field_types = fieldObj.types;
		vm.option_values = [];
		vm.autocompleteOpts = {
			options: {
				html: true
				,focusOpen: true
				,minLength: 3
				,outHeight: 100
				,maxWidth: 300
				,onlySelectValid: false
				,source: function( req, res ){
					var captions = fieldObj.captions || [];
					captions = vm.autocompleteOpts.methods.filter( captions, req.term );
					res( captions );
				}
			}
			,methods: {}
		};
		vm.update = fieldObj.update;
		if( fieldObj.update ){
			vm.field = fieldObj.field;
			for( var i = 0; i < vm.field.field_opts.length; i++ ){
				vm.option_values.push( {value: vm.field.field_opts[i]} );
			}
			vm.field.field_type = vm.field.field_type + '';
		}else{
			vm.field = {
				field_caption: ''
				,field_name: ''
				,field_type: '1'
				,field_opts: []
				,field_default: ''
				,field_required: false
			};
			vm.option_values = [
				{value: ''}
			];
		}

		/*add option to array*/
		vm.addOption = function(){
			vm.option_values.push( {value: ''} );
		};

		/*remove from options array*/
		vm.removeOption = function( index ){
			vm.option_values.splice( index, 1 );
		};

		/*Store field*/
		vm.storeField = function( isValid ){
			if( !isValid ){
				Notification.warning( {message: 'Fill form correctly please!', delay: 3000} );
				return false;
			}

			var rSave = {
				template: fieldObj.tpl
				,storetoall: fieldObj.storetoall
				,template_type: $rootScope.menuValues.project_type
				,field_name: (!fieldObj.update)?vm.field.field_caption.replace( ' ', '_' ) + vm.field.field_type:vm.field.field_name
				,field_type: vm.field.field_type
				,field_caption: vm.field.field_caption
				,field_default: vm.field.field_default
				,field_opts: []
				,field_required: vm.field.field_required
				,field_pos: (fieldObj.update)?vm.field.field_pos:fieldObj.lastIndex + 1
				,language: fieldObj.language
			};
			for( var i = 0; i < vm.option_values.length; i++ ){
				rSave.field_opts.push( vm.option_values[i].value );
			}
			if( fieldObj.update ){
				rSave._id = fieldObj.field._id;
				TemplateService.update( rSave, function( response ){
					//emit here
					response.type = '';
					for( var i = 0; i < fieldObj.types.length; i++ ){
						if( response.field_type == fieldObj.types[i].id ){
							response.type = fieldObj.types[i].name;
							break;
						}
					}
					$rootScope.$emit( 'updateField', {field: response} );
					$uibModalInstance.close();
				}
				,function( err ){
					console.log( err );
					Notification.error( {message: 'Unable to update field!', delay: 3000} );
				} );
			}else{
				var field = new TemplateService( rSave );
				field.$save( function( response ){
					Notification.success( {message: 'Field created successfully!', delay: 2000} );
					//emit here
					response.data.type = '';
					for( var i = 0; i < fieldObj.types.length; i++ ){
						if( response.data.field_type == fieldObj.types[i].id ){
							response.data.type = fieldObj.types[i].name;
							break;
						}
					}
					$rootScope.$emit( 'createField', {field: response.data} );
					$uibModalInstance.close();
				}
				,function( err ){
					console.log( err );
					Notification.error( {message: 'Unable to create field!', delay: 3000} );
				} );
			}
		};

		/*cancel*/
		vm.cancel = function(){
			$uibModalInstance.dismiss( 'cancel' );
		};
	}
] )
.controller( 'AddNewTemplateLanguageClientController', ['$uibModalInstance', 'TemplateService', '$rootScope', 'Notification'
	,function( $uibModalInstance, TemplateService, $rootScope, Notification ){
		var vm = this;
		vm.languages = [];
		vm.selectedLang = '';
		vm.dialogTitle = 'Add new language';

		TemplateService.getLanguages()
		.then( function( response ){
			vm.languages = response;
		} );

		/*Add new language*/
		vm.setLang = function( isValid ){
			if( !isValid ){
				Notification.warning( {message: 'Fill form correctly please!', delay: 3000} );
				return false;
			}
			TemplateService.createFromDefault( {language: vm.selectedLang, template_type: $rootScope.menuValues.project_type} )
			.then( function( response ){
				$rootScope.$emit( 'refreshLangs', {languages: response.languages} );
				$uibModalInstance.close();
			}
			,function( err ){
				console.log( err );
				Notification.error( {message: 'Unable to add language!', delay: 3000} );
			} );
		};

		/*cancel*/
		vm.cancel = function(){
			$uibModalInstance.dismiss( 'cancel' );
		};
	}
] );