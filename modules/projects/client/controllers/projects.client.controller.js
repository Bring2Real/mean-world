'use strict';

angular.module( 'projects' ).controller( 'CreateProjectClientController', ['$state', '$rootScope', 'TemplateService', 'Authentication', 'Notification', 'ProjectsService', 'Upload', 'menuService'
	,function( $state, $rootScope, TemplateService, Authentication, Notification, ProjectsService, Upload, menuService ){
		var user = Authentication.user;
		if( !user ){
			$state.go( 'home' );
			return;
		}
		if( user.roles.indexOf( 'admin_company' ) == -1 && user.roles.indexOf( 'admin_project' ) == -1 ){
			$state.go( 'home' );
			return;
		}
		var template_type = ($rootScope.menuValues && $rootScope.menuValues.project_type)?$rootScope.menuValues.project_type:1;
		var storedLanguages = [];
		var vm = this;
		vm.lang = user.language || 'en';
		vm.fields = [];
		vm.project = {
			project_name: ''
			,language: vm.lang
			,project_data: {}
			,_id: null
			,project_logo: {
				field_default: ''
				,value: null
			}
		};
		vm.languages = [];
		vm.created = false; //flag - is project create?

		//Get available languages of templates
		TemplateService.templateLanguages( template_type )
		.then( function( response ){
			vm.languages = response.data;
		}
		,function( err ){
			console.log( err );
			Notification.error( {message: 'Unable to load languages list!', delay: 3000} );
		} );

		/*Initialize template when create*/
		vm.initProject = function(){
			vm.fields = [];
			/*Load template if project not stored*/
			if( !( vm.lang in vm.project.project_data ) ){
				TemplateService.query( {language: vm.lang, template_type: template_type}, function( response ){
					if( !response.data || response.data.length == 0 ){
						$state.go( 'teasers-template' );	//if no template, go to create them
						return false;
					}
					for( var i = 0; i < response.data.length; i++ ){
						if( response.data[i].template == 1 ){
							response.data[i].value = response.data[i].field_default;
							vm.fields.push( response.data[i] );
						}
					}
				}
				,function( err ){
					console.log( err );
					Notification.error( {message: 'Unable to load fields list!', delay: 3000} );
				} );
			}else{
				//Try to load stored project data
				var data = vm.project.project_data[vm.lang];
				vm.fields = [];
				for( var i = 0; i < data.length; i++ ){
					vm.fields.push( data[i] );
				}
			}
		};


		/*Change language*/
		vm.changeLanguage = function( lang ){
			vm.lang = lang;
			vm.initProject();
		};


		/*For image field*/
		vm.onChangeImage = function( files, field ){
			if( files[0] == undefined ){
				return;
			}
			vm.fileExt = files[0].name.split( '.' ).pop();
		};


		/*Store Project*/
		vm.storeProject = function( isValid ){
			if( !isValid ){
				Notification.warning( {message: 'Fill form correctly please!', delay: 3000} );
				return false;
			}
			var rSave = {
				project_name: vm.project.project_name
				,project_type: template_type
				,project_data: []
				,language: vm.lang
				,project_logo: {
					field_default: vm.project.project_logo.field_default
				}
			};
			var upload = [];
			var names = [];
			//logo
			if( vm.project.project_logo.value != null && typeof( vm.project.project_logo.value ) != 'string' ){
				names.push( 'project_logo' );
				upload.push( vm.project.project_logo.value );
			}
			//make project data for store
			for( var i = 0; i < vm.fields.length; i++ ){
				var tmp = {
					field_name: vm.fields[i].field_name
					,field_caption: vm.fields[i].field_caption
					,field_type: parseInt( vm.fields[i].field_type )
					,field_pos: parseInt( vm.fields[i].field_pos )
					,field_default: vm.fields[i].field_default
					,field_required: vm.fields[i].field_required
					,value: vm.fields[i].value
				}
				if( tmp.field_type == 2 ){
					tmp.field_opts = vm.fields[i].field_opts;
				}
				if( tmp.field_type == 4 || tmp.field_type == 5 ){
					if( tmp.value != null && typeof( tmp.value ) != 'string' ){
						tmp.field_path = ''; //Default field path
						upload.push( tmp.value );
						names.push( tmp.field_name );
					}
				}
				rSave.project_data.push( tmp );
			}
			if( !vm.created ){
				var proj = new ProjectsService( rSave );
				proj.$save( function( response ){
					if( upload.length > 0 ){
						angular.element( '.loading' ).show();
						ProjectsService.sendFiles( {_id: response.data._id, language: vm.lang, files: upload, names: names} )
						.then( function( response ){
							angular.element( '.loading' ).hide();
							Notification.success( {message: 'Teaser created successfully!', delay: 3000} );
							vm.created = true;
					        menuService.addSubMenuItem( 'topbar', 'select_project', {
					            title: response.data.project_name
					            ,state: 'curr_project'
					            ,value: {proj_id: response.data._id}
					            ,roles: ['admin_company', 'admin_project']
					        } );
					        storedLanguages.push( vm.lang );
					        vm.project = response.data.data;
					        $state.go( 'update-created-teaser', {projId: vm.project._id, language: vm.lang} );
						}
						,function( err ){
							angular.element( '.loading' ).hide();
							console.log( err );
							Notification.error( {message: 'Unable to upload files!', delay: 3000} );
						} );
					}else{
						Notification.success( {message: 'Teaser created successfully!', delay: 3000} );
						vm.created = true;
				        menuService.addSubMenuItem( 'topbar', 'select_project', {
				            title: response.data.project_name
				            ,state: 'curr_project'
				            ,value: {proj_id: response.data._id}
				            ,roles: ['admin_company', 'admin_project']
				        } );
				        storedLanguages.push( vm.lang );
				        vm.project = response.data;
				        $state.go( 'update-created-teaser', {projId: vm.project._id, language: vm.lang} );
					}
				}
				,function( err ){
					console.log( err );
					Notification.error( {message: 'Unable to create teaser!', delay: 3000} );
				} );
			}else{
				//Update project
				rSave._id = vm.project._id;
				ProjectsService.update( rSave, function( response ){
					if( upload.length > 0 ){
						ProjectsService.sendFiles( {_id: response.data._id, language: vm.lang, files: upload, names: names} )
						.then( function( response ){
							Notification.success( {message: 'Teaser stored successfully!', delay: 3000} );
							vm.created = true;
					        menuService.addSubMenuItem( 'topbar', 'select_project', {
					            title: response.data.project_name
					            ,state: 'curr_project'
					            ,value: {proj_id: response.data._id}
					            ,roles: ['admin_company', 'admin_project']
					        } );
					        storedLanguages.push( vm.lang );
					        vm.project = response.data.data;
						}
						,function( err ){
							console.log( err );
							Notification.error( {message: 'Unable to upload files!', delay: 3000} );
						} );
					}else{
						Notification.success( {message: 'Teaser stored successfully!', delay: 3000} );
						vm.created = true;
				        menuService.addSubMenuItem( 'topbar', 'select_project', {
				            title: response.data.project_name
				            ,state: 'curr_project'
				            ,value: {proj_id: response.data._id}
				            ,roles: ['admin_company', 'admin_project']
				        } );
				        storedLanguages.push( vm.lang );
				        vm.project = response.data;
					}
				}
				,function( err ){
					console.log( err );
					Notification.error( {message: 'Unable to store teaser!', delay: 3000} );
				} );
			}
		};


		/*Cancel Add Project*/
		vm.cancelAdd = function(){
			$state.go( 'all-teasers' );
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
] )
.controller( 'ListProjectsClientController', ['$state', '$rootScope', 'Authentication', 'Notification', 'ProjectsService'
	,function( $state, $rootScope, Authentication, Notification, ProjectsService ){
		var user = Authentication.user;
		if( !user ){
			$state.go( 'home' );
			return;
		}
		var vm = this;
		vm.be = (Authentication.user)?Authentication.user.be:'';
		vm.editTemplate = false;
		if( user.roles.indexOf( 'admin_company' ) != -1 ){
			vm.editTemplate = true;
		}

		/*Initialize list*/
		vm.initList = function( project_type ){
			vm.projects = [];
			vm.projectsSafe = [];
			angular.element( '.loading' ).show();
			ProjectsService.query( {project_type: project_type, nodetails: 1}, function( response ){
				angular.element( '.loading' ).hide();
				for( var i = 0; i < response.data.length; i++ ){
					switch( response.data[i].status ){
						case 1:
							response.data[i].str_status = 'New';
							break;
						case 2:
							response.data[i].str_status = 'Running';
							break;
						case 3:
							response.data[i].str_status = 'Closed';
							break;
					}
					vm.projects.push( response.data[i] );
				}
				vm.projectsSafe = vm.projects;
			}
			,function( err ){
				angular.element( '.loading' ).hide();
				console.log( err );
				Notification.error( {message: 'Unable to load teasers!', delay: 3000} );
			} );
		};


		/*Go to template Editor*/
		vm.goTemplate = function(){
			$state.go( 'teasers-template' );
		};


		/*Go to add project*/
		vm.goAddProject = function(){
			$state.go( 'create-teaser' );
		};

		//Watch for Finance/Marketing/etc
		var watch = $rootScope.$watch( "menuValues['project_type']", function( newVal, oldVal ){
			if( newVal == null ){
				newVal = 1; //Temp!!!!
			}
			vm.initList( newVal );
		}, true );

		/*Destroy events*/
		vm.$onDestroy = function(){
			watch();
		};
	}
] )
.controller( 'UpdateProjectClientController', ['$state', '$stateParams', '$rootScope', 'TemplateService', 'Authentication', 'Notification', 'ProjectsService', 'Upload', 'UnitsService'
	,function( $state, $stateParams, $rootScope, TemplateService, Authentication, Notification, ProjectsService, Upload, UnitsService ){
		var user = Authentication.user;
		if( !user ){
			$state.go( 'home' );
			return;
		}
		if( user.roles.indexOf( 'admin_company' ) == -1 && user.roles.indexOf( 'admin_project' ) == -1 ){
			$state.go( 'home' );
			return;
		}

		if( !$stateParams.projId ){
			Notification.error( {message: 'No Teaser identificator!', delay: 3000} );
			$state.go( 'home' );
			return false;
		}
		var template_type = ($rootScope.menuValues && $rootScope.menuValues.project_type)?$rootScope.menuValues.project_type:1;
		var storedLanguages = [];
		var vm = this;
		vm.be = (Authentication.user)?Authentication.user.be:'';
		vm.lang = localStorage.getItem( 'lang' );
		if( !vm.lang ){
			vm.lang = user.language || 'en';
		}
		vm.fields = [];
		vm.project = {
			project_name: ''
			,language: vm.lang
			,project_data: {}
			,_id: $stateParams.projId
			,project_logo: {
				field_default: ''
				,value: null
			}
		};
		vm.languages = [];
		vm.created = false; //flag - is project create?
		vm.unitList = false; //if unit list is presents
		vm.unit_fields = [];
		vm.units = [];

		//if from add form
		if( $stateParams.language ){
			vm.lang = $stateParams.language;
		}

		//Get available languages of templates
		TemplateService.templateLanguages( template_type )
		.then( function( response ){
			vm.languages = response.data;
		}
		,function( err ){
			console.log( err );
			Notification.error( {message: 'Unable to load languages list!', delay: 3000} );
		} );


		/*Initialize on update*/
		vm.initProject = function(){
			vm.fields = [];
			vm.units = [];
			vm.unit_headers = [];
			vm.unitList = false;
			angular.element( '.loading' ).show();
			ProjectsService.get( {language: vm.lang}, {_id: vm.project._id}, function( response ){
				angular.element( '.loading' ).hide();
				vm.project = response.data;
				/*Load template if project not stored*/
				if( !( vm.lang in vm.project.project_data ) ){
					TemplateService.query( {language: vm.lang, template_type: template_type}, function( response ){
						if( !response.data || response.data.length == 0 ){
							$state.go( 'teasers-template' );	//if no template, go to create them
							return false;
						}
						for( var i = 0; i < response.data.length; i++ ){
							if( response.data[i].template == 1 ){
								response.data[i].value = response.data[i].field_default;
								vm.fields.push( response.data[i] );
								/*if( response.data[i].field_type == 6 ){
									vm.unitList = true;
								}*/
							}
						}
					}
					,function( err ){
						angular.element( '.loading' ).hide();
						console.log( err );
						Notification.error( {message: 'Unable to load fields list!', delay: 3000} );
					} );
				}else{
					//Try to load stored project data
					var data = vm.project.project_data[vm.lang];
					vm.fields = [];
					for( var i = 0; i < data.length; i++ ){
						vm.fields.push( data[i] );
						if( data[i].field_type == 6 ){
							vm.unitList = true;
						}
					}
					if( vm.unitList ){
						//Unit list, if they are available
						var rUnit = UnitsService.makeUnitArray( vm.project.units );
						vm.unit_headers = rUnit.unit_headers;
						vm.units = rUnit.units;
					}
					delete vm.project.units;
				}
			}
			,function( err ){
				console.log( err );
				Notification.error( {message: 'Unable to load Teaser!', delay: 3000} );
			} );
		};


		/*Store project*/
		vm.storeProject = function( isValid ){
			if( !isValid ){
				Notification.warning( {message: 'Fill form correctly please!', delay: 3000} );
				return false;
			}
			var rSave = {
				project_name: vm.project.project_name
				,project_type: template_type
				,project_data: []
				,language: vm.lang
				,project_logo: {
					field_default: vm.project.project_logo.field_default
				}
			};
			var upload = [];
			var names = [];
			//logo
			if( vm.project.project_logo.value != null && typeof( vm.project.project_logo.value ) != 'string' ){
				names.push( 'project_logo' );
				upload.push( vm.project.project_logo.value );
			}
			//make project data for store
			for( var i = 0; i < vm.fields.length; i++ ){
				var tmp = {
					field_name: vm.fields[i].field_name
					,field_caption: vm.fields[i].field_caption
					,field_type: parseInt( vm.fields[i].field_type )
					,field_pos: parseInt( vm.fields[i].field_pos )
					,field_default: vm.fields[i].field_default
					,field_required: vm.fields[i].field_required
					,value: vm.fields[i].value
				}
				if( tmp.field_type == 2 ){
					tmp.field_opts = vm.fields[i].field_opts;
				}
				if( tmp.field_type == 4 || tmp.field_type == 5 ){
					if( tmp.value != null && typeof( tmp.value ) != 'string' ){
						tmp.field_path = ''; //Default field path
						upload.push( tmp.value );
						names.push( tmp.field_name );
					}
				}
				rSave.project_data.push( tmp );
			}
			//Update project
			rSave._id = vm.project._id;
			ProjectsService.update( rSave, function( response ){
				if( upload.length > 0 ){
					angular.element( '.loading' ).show();
					ProjectsService.sendFiles( {_id: response.data._id, language: vm.lang, files: upload, names: names} )
					.then( function( response ){
						angular.element( '.loading' ).hide();
						Notification.success( {message: 'Teaser stored successfully!', delay: 3000} );
						vm.created = true;
				        storedLanguages.push( vm.lang );
				        vm.project = response.data.data;
					}
					,function( err ){
						angular.element( '.loading' ).hide();
						console.log( err );
						Notification.error( {message: 'Unable to upload files!', delay: 3000} );
					} );
				}else{
					Notification.success( {message: 'Teaser stored successfully!', delay: 3000} );
					vm.created = true;
			        storedLanguages.push( vm.lang );
			        vm.project = response.data;
				}
			}
			,function( err ){
				console.log( err );
				Notification.error( {message: 'Unable to store teaser!', delay: 3000} );
			} );
		};


		/*Cancel Add Project*/
		vm.cancelUpdate = function(){
			$state.go( 'all-teasers' ); //ToDo - go to project list
		};


		/*Change language*/
		vm.changeLanguage = function( lang ){
			vm.lang = lang;
			vm.unit_fields = [];
			localStorage.setItem( 'lang', lang );
			vm.initProject();
		};

		/**************************** Units Area ***********************************/
		/*Upload XLSX file*/
		vm.uploadXLSX = function( file ){
			if( !file ){
				return;
			}
			vm.unit_fields = [];
			vm.file_name = '';
			UnitsService.uploadXLSX( file, vm.project._id, vm.lang )
			.then( function( response ){
				for( var i = 0; i < response.data.data.length; i++ ){
					response.data.data[i].value = false;
					vm.unit_fields.push( response.data.data[i] );
				}
				vm.file_name = response.data.file_name;
			}
			,function( err ){
				console.log( err );
				Notification.error( {message: 'Unable to load file for import!', delay: 3000} );
			} );
		};


		/*Start upload by selected columns*/
		vm.importXLSX = function( isValid ){
			if( !isValid ){
				return false;
			}
			var import_fields = [];
			for( var i = 0; i < vm.unit_fields.length; i++ ){
				if( !vm.unit_fields[i].value ) continue;
				import_fields.push( vm.unit_fields[i] );
			}
			if( import_fields.length == 0 ){
				Notification.warning( {message: 'No fields selected to import!', delay: 3000} );
				return false;
			}
			var rImport = {
				project_id: vm.project._id
				,language: vm.lang
				,file_name: vm.file_name
				,fields: import_fields
			};
			vm.units = [];
			vm.unit_headers = [];
			angular.element( '.loading' ).show();
			UnitsService.importXLSX( rImport )
			.then( function( response ){
				angular.element( '.loading' ).hide();
				var rUnit = UnitsService.makeUnitArray( response.data );
				vm.unit_headers = rUnit.unit_headers;
				vm.units = rUnit.units;
				//clear other's
				vm.unit_fields = [];
				Notification.success( {message: 'Units import successfully', delay: 3000} );
			}
			,function( err ){
				angular.element( '.loading' ).hide();
				console.log( err );
				Notification.error( {message: 'Unable to import xlsx file!', delay: 3000} );
			} );
		};


		/*Remove unit*/
		vm.removeUnit = function( id ){
			if( !confirm( 'Are you sure to remove unit?' ) ){
				return false;
			}
			angular.element( '.loading' ).show();
			UnitsService.remove( {}, {_id: id}, function( response ){
				var index = -1;
				for( var i = 0; i < vm.units.length; i++ ){
					if( vm.units[i]._id == id ){
						index = i;
						break;
					}
				}
				angular.element( '.loading' ).hide();
				if( index != -1 ){
					vm.units.splice( index, 1 );
					Notification.success( {message: 'Unit remove successfully!', delay: 2000} );
				}
			}
			,function( err ){
				angular.element( '.loading' ).hide();
				console.log( err );
				Notification.error( {message: 'Unable to remove unit!', delay: 3000} );
			} );
		};


		/*Hide columns in unit list*/
		vm.hideColumn = function( field_name, hidden ){
			var params = {
				project_id: vm.project._id
				,field_name: field_name
				,language: vm.lang
				,hidden: hidden
			};
			angular.element( '.loading' ).show();
			UnitsService.hideShowColumn( params )
			.then( function( response ){
				//Reload unit list
				params = {
					project_id: vm.project._id
					,language: vm.lang
					,last: true
				};
				UnitsService.query( params, function( response ){
					angular.element( '.loading' ).hide();
					var rUnit = UnitsService.makeUnitArray( response.data );
					vm.units = rUnit.units;
					vm.unit_headers = rUnit.unit_headers;
				}
				,function( err ){
					angular.element( '.loading' ).hide();
					console.log( err );
					Notification.error( {message: 'Unable to hide column!', delay: 3000} );
				} );
			}
			,function( err ){
				angular.element( '.loading' ).hide();
				console.log( err );
				Notification.error( {message: 'Unable to hide column!', delay: 3000} );
			} );
		};


		/*Remove all units from project and language*/
		vm.removeAllUnits = function(){
			if( !confirm( 'Remove all units?' ) ){
				return false;
			}
			var params = {
				project_id: vm.project._id
				,language: vm.lang
			};
			UnitsService.removeAll( params )
			.then( function( response ){
				angular.element( '.loading' ).hide();
				vm.unit_headers = [];
				vm.units = [];
			}
			,function( err ){
				angular.element( '.loading' ).hide();
				console.log( err );
				Notification.error( {message: 'Unable to remove units!', delay: 3000} );
			} );
		};


		/*Create unit for project*/
		vm.createUnit = function(){
			if( vm.units.length > 0 ){
				localStorage.setItem( 'unit_data', JSON.stringify( vm.units[0].unit_data ) );
			}else{
				localStorage.setItem( 'unit_data', '[]' );
			}
			$state.go( 'unit-create', {projId: vm.project._id, language: vm.lang} );
		};

		//---------------------------------------------------------------------------------------
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
] );