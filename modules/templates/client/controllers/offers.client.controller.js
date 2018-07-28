'use strict';

angular.module( 'templates.offer' ).controller( 'TemplateOffersClientController', ['$state', '$uibModal', 'Authentication', 'Notification', 'TemplateService', '$translate', '$rootScope'
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
		var template_type = 3; //for Offers
		var types = [];
		var prefilled = [];
		var vm = this;
		vm.lang = Authentication.company.language || 'en';

		vm.createDisabled = false; //for future
		vm.showCreateBtns = false; //for show create buttons (field or from super)
		vm.rootCreate = true;
		vm.showUpdatePos = false;
		vm.storetoall = true;
		vm.languages = [];

		/*Initialize fields list of template*/
		vm.initFields = function( project_type ){
			vm.showUpdatePos = false;
			vm.offer_fields = [];
			vm.strLanguage = $translate.instant( vm.lang.toUpperCase() );
			vm.offerTemplateTitle = (project_type == 3)?'Finance':'Marketing';
			vm.offerTemplateTitle += ' Offer Template';
			angular.element( '.loading' ).show();
			TemplateService.query( {language: vm.lang, template_type: project_type}, function( response ){
				angular.element( '.loading' ).hide();
				if( response.data ){
					for( var i = 0; i < response.data.length; i++ ){
						response.data[i].full_field_points = 0;
						if( 'field_points' in response.data[i] ){
							if( response.data[i].field_type != 2 ){
								response.data[i].full_field_points = response.data[i].field_points[0];
							}else{
								for( var j = 0; j < response.data[i].field_points.length; j++ ){
									response.data[i].full_field_points += response.data[i].field_points[j];
								}
							}
						}
						vm.offer_fields.push( response.data[i] );
					}
					if( vm.offer_fields.length ){
						vm.rootCreate = false;
					}else{
						vm.rootCreate = true;
					}
				}
				types = response.types;
				vm.languages = response.languages;
				prefilled = response.prefilled;
			}
			,function( err ){
				angular.element( '.loading' ).hide();
				console.log( err );
				Notification.error( {message: 'Unable to load offer fields list!', delay: 3000} );
			} );
		};

		/*Remove field from list*/
		vm.removeField = function( id, index ){
			if( !id ){
				Notification.error( {message: 'Ooops!', delay: 3000} );
				return false;
			}
			if( !confirm( 'Are you sure to remove field?' ) ){
				return false;
			}
			angular.element( '.loading' ).show();
			TemplateService.remove( {}, {_id: id}, function( response ){
				var fields = 'offer_fields';
				vm[fields].splice( index, 1 );
				//bulk update
				if( vm[fields].length > 0 ){
					var updates = rebuildPositions( 1 );
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

		/*Move offer field*/
		vm.moveField = function( index, direction ){
			var new_pos = index + direction;
			var field = vm.offer_fields[index];
			if( !vm.showUpdatePos ){
				vm.showUpdatePos = true;
			}
			if( new_pos < 0 ){
				new_pos = vm.offer_fields.length - 1
			}else if( new_pos > vm.offer_fields.length - 1 ){
				new_pos = 0;
			}
			vm.offer_fields.splice( index, 1 );
			vm.offer_fields.splice( new_pos, 0, field );
		};


		/*Change language of template*/
		vm.changeLanguage = function( lang ){
			vm.lang = lang;
			vm.initFields( template_type );
		};

		/*Set default language*/
		vm.setDefaultLanguage = function( lang ){
			TemplateService.setDefaultLanguage( {language: lang, template_type: template_type} )
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
			TemplateService.removeByLanguage( {language: lang, template_type: template_type} )
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
				,controller: 'AddNewOfferTemplateLanguageClientController'
				,controllerAs: 'vm'
			} );
		};

		/*Store field positions*/
		vm.updateFieldsPos = function(){
			var updates = rebuildPositions( 1 );
			//bulk update
			angular.element( '.loading' ).show();
			TemplateService.bulkUpdate( updates )
			.then( function( response ){
				angular.element( '.loading' ).hide();
				Notification.success( {message: 'Update positions successfully!', delay: 3000} );
				vm.showUpdatePos = false;
			}
			,function( err ){
				angular.element( '.loading' ).hide();
				console.log( err );
				Notification.error( {message: 'Cannot update fields positions!', delay: 3000} );
			} );
		};

		/*Copy template from supertemplate*/
		vm.copyFromSuperTemplate = function( tpl ){
			angular.element( '.loading' ).show();
			var default_language = true;
			for( var i = 0; i < vm.languages.length; i++ ){
				if( vm.lang == vm.languages[i].language ){
					default_language = vm.languages[i].default_language;
					break;
				}
			}
			TemplateService.copyFromSuper( {language: vm.lang, template_type: template_type, template: tpl, default_language: default_language} )
			.then( function( response ){
				angular.element( '.loading' ).hide();
				if( response.data ){
					for( var i = 0; i < response.data.length; i++ ){
						response.data[i].full_field_points = 0;
						if( 'field_points' in response.data[i] ){
							if( response.data[i].field_type != 2 ){
								response.data[i].full_field_points = response.data[i].field_points[0];
							}else{
								for( var j = 0; j < response.data[i].field_points.length; j++ ){
									response.data[i].full_field_points += response.data[i].field_points[j];
								}
							}
						}
						vm.offer_fields.push( response.data[i] );
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


		/*Show create field dialog*/
		vm.showFieldCreateDialog = function( tpl ){
			var modalInstance = $uibModal.open( {
				templateUrl: '/modules/templates/client/views/offer/field.client.modal.html'
				,controller: 'ModifyOfferFieldClientController'
				,controllerAs: 'vm'
				,resolve: {
					fieldObj: function(){
						var captions = [];
						captions = vm.offer_fields.map( function( value ){
							return value.field_caption;
						} );
						return {
							update: false
							,types: types
							,prefilled: prefilled
							,tpl: tpl
							,lastIndex: vm.offer_fields.length
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
			var modalInstance = $uibModal.open( {
				templateUrl: '/modules/templates/client/views/offer/field.client.modal.html'
				,controller: 'ModifyOfferFieldClientController'
				,controllerAs: 'vm'
				,resolve: {
					fieldObj: function(){
						var captions = [];
						captions = vm.offer_fields.map( function( value ){
							return value.field_caption;
						} );
						return {
							update: true
							,types: types
							,prefilled: prefilled
							,tpl: 3
							,lastIndex: vm.offer_fields.length
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
			var fields = (tpl == 1)?'offer_fields':'unit_fields';
			for( var i = 0; i < vm[fields].length; i++ ){
				vm[fields][i].field_pos = i + 1;
				updates.push( {_id: vm[fields][i]._id, field_pos: vm[fields][i].field_pos, language: vm[fields][i].language} );
			}
			return updates;
		}


		//watch for template type
		var watch = $rootScope.$watch( 'menuValues.project_type', function( newVal, oldVal ){
			//reload list of fields
			if( newVal == 1 ){
				template_type = 3;
			}else{
				template_type = 4;
			}
			vm.initFields( template_type );
		}, true );

		//Event to reload languages
		var watch1 = $rootScope.$on( 'refreshLangs', function( events, args ){
			vm.languages = args.languages;
		} );

		//Add field without reload
		var watch2 = $rootScope.$on( 'createField', function( events, args ){
			if( args.field.language == vm.lang ){
				var fields = 'offer_fields';
				args.field.full_field_points = 0;
				if( parseInt( args.field.field_type ) == 2 ){
					for( var i = 0; i < args.field.field_points.length; i++ ){
						args.field.full_field_points += args.field.field_points[i];
					}
				}else{
					args.field.full_field_points = args.field.field_points[0];
				}
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
				var fields = 'offer_fields';
				args.field.full_field_points = 0;
				if( parseInt( args.field.field_type ) == 2 ){
					for( var i = 0; i < args.field.field_points.length; i++ ){
						args.field.full_field_points += args.field.field_points[i];
					}
				}else{
					args.field.full_field_points = args.field.field_points[0];
				}
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
.controller( 'ModifyOfferFieldClientController', ['$uibModalInstance', '$rootScope', 'Notification', 'TemplateService', 'fieldObj'
	,function( $uibModalInstance, $rootScope, Notification, TemplateService, fieldObj ){
		var template_type = 3;
		var vm = this;
		vm.field_types = [];
		for( var i = 0; i < fieldObj.types.length; i++ ){
			if( fieldObj.types[i].id > 3 && fieldObj.types[i].id != 7 ) continue;
			vm.field_types.push( fieldObj.types[i] );
		}
		
		vm.prefilled = fieldObj.prefilled;
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
		if( $rootScope.menuValues && $rootScope.menuValues.project_type == 2 ){
			template_type = 4;
		}
		vm.update = fieldObj.update;
		if( fieldObj.update ){
			vm.field = fieldObj.field;
			for( var i = 0; i < vm.field.field_opts.length; i++ ){
				vm.option_values.push( {value: vm.field.field_opts[i], points: (vm.field.field_points[i])?vm.field.field_points[i]:0} );
			}
			vm.field.field_type = vm.field.field_type + '';
		}else{
			vm.field = {
				field_caption: ''
				,field_name: ''
				,field_type: '1'
				,field_opts: []
				,field_points: []
				,field_default: ''
				,field_required: false
				,field_prefilled: ''
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
				,template_type: template_type
				,field_name: (!fieldObj.update)?vm.field.field_caption.replace( ' ', '_' ) + vm.field.field_type:vm.field.field_name
				,field_type: vm.field.field_type
				,field_caption: vm.field.field_caption
				,field_default: vm.field.field_default
				,field_opts: []
				,field_points: (parseInt( vm.field.field_type ) == 2)?[]:[vm.field.field_points[0]]
				,field_required: vm.field.field_required
				,field_pos: (fieldObj.update)?vm.field.field_pos:fieldObj.lastIndex + 1
				,field_prefilled: vm.field.field_prefilled
				,language: fieldObj.language
			};
			if( parseInt( vm.field.field_type ) == 2 ){
				for( var i = 0; i < vm.option_values.length; i++ ){
					rSave.field_opts.push( vm.option_values[i].value );
					rSave.field_points.push( vm.option_values[i].points );
				}
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
.controller( 'AddNewOfferTemplateLanguageClientController', ['$uibModalInstance', 'TemplateService', '$rootScope', 'Notification'
	,function( $uibModalInstance, TemplateService, $rootScope, Notification ){
		var vm = this;
		vm.languages = [];
		vm.selectedLang = '';
		vm.dialogTitle = 'Add new language';

		TemplateService.getLanguages()
		.then( function( response ){
			vm.languages = response;
		} );

		var template_type = 3;
		if( $rootScope.menuValues && $rootScope.menuValues.project_type == 2 ){
			template_type = 4
		}

		/*Add new language*/
		vm.setLang = function( isValid ){
			if( !isValid ){
				Notification.warning( {message: 'Fill form correctly please!', delay: 3000} );
				return false;
			}
			TemplateService.createFromDefault( {language: vm.selectedLang, template_type: template_type} )
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