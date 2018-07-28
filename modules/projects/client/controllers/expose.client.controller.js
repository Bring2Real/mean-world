'use strict';

angular.module( 'projects.expose' ).controller( 'ProjectExposeClientController', ['$state', '$rootScope', '$stateParams', 'Authentication', 'Notification', 'ProjectsService', 'UnitsService', 'FancyBox', '$uibModal', '$scope', '$q'
	,function( $state, $rootScope, $stateParams, Authentication, Notification, ProjectsService, UnitsService, FancyBox, $uibModal, $scope, $q ){
		var user = Authentication.user;
		if( !user ){
			$state.go( 'home' );
			return;
		}

		var go_pdf = false;
		var g_file_name = null;
		var vm = this;
		vm.canEdit = true;
		/*if( user.roles.indexOf( 'member_project' ) != -1 || user.roles.indexOf( 'member_client' ) != -1 ){
			vm.canEdit = false;
		}*/
		vm.lang = user.language || 'en';
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
		vm.be = (user)?user.be:'';
		vm.pdf_url = '';
		vm.pdf_file_download = '';
		vm.canInvite = false;
		vm.canAddOffer = false;
		vm.unitsToShow = 10;
		vm.showMoreButton = true;

		if( user.roles.indexOf( 'bank' ) != -1 ){
			vm.canEdit = false;
			vm.canAddOffer = true;
		}

		/*Initialize project data*/
		vm.initProject = function(){
			//For show on page
			vm.fields = [];
			vm.unitList = false;
			vm.units = [];
			vm.unit_headers = [];
			vm.pdf_file_download = '';
			vm.attachtments = false;
			FancyBox.removeAll();
			//get project id from rootScope or stateParams
			vm.project._id = ($rootScope.menuValues && $rootScope.menuValues.proj_id)?$rootScope.menuValues.proj_id:$stateParams.projId;
			if( !vm.project._id ){
				Notification.warning( {message: 'No Teaser was select!', delay: 3000} );
				$state.go( 'home' );
				return false;
			}
			angular.element( '.loading' ).show();
			ProjectsService.get( {}, {_id: vm.project._id}, function( response ){
				angular.element( '.loading' ).hide();
				vm.project = response.data;
				if( vm.project.project_type != 1 ){
					vm.canInvite = false;
				}
				vm.pdf_file_download = vm.project.project_name + '.pdf';
				var lang = vm.lang;
				if( !( lang in vm.project.project_data ) ){
					//try to get first lang of projects
					var keys = Object.keys( vm.project.project_data );
					if( keys.length == 0 ){
						return false; //???, but...
					}
					lang = keys[0];
				}
				//Add logo to fancybox
				if( vm.project.project_logo ){
					FancyBox.addItem( vm.project.project_logo.field_default, vm.be + vm.project.project_logo.field_url );
				}
				//Try to load stored project data
				var data = vm.project.project_data[lang];
				vm.fields = [];
				for( var i = 0; i < data.length; i++ ){
					vm.fields.push( data[i] );
					if( data[i].field_type == 6 ){
						vm.unitList = true;
					}
					//Add pictures into fancybox
					if( data[i].field_type == 4 ){
						FancyBox.addItem( data[i].field_default, vm.be + data[i].field_url );
					}
					if( data[i].field_type == 5 ){
						vm.attachtments = true;
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
			,function( err ){
				angular.element( '.loading' ).hide();
				console.log( err );
				Notification.error( {message: 'Unable to load teaser!', delay: 3000} );
			} );
		};


		/*Show more units*/
		vm.showAllUnits = function(){
			vm.unitsToShow += 10000; //I think, that is no more units to show
			vm.showMoreButton = false; //No more button there... (plak, plak)
		};


		/*Create pdf from DOM*/
		vm.createPDF = function( file_name ){
			var reShow = false;
			var element = null;
			angular.element( '.loading' ).show();
			if( vm.showMoreButton ){
				vm.showAllUnits();
				reShow = true;
				go_pdf = true;
				g_file_name = file_name;
			}else{
				element = document.getElementById( 'project-to-download' );
				html2pdf( element, {
					margin: 1
					,filename: file_name
					,image: {type: 'jpeg', quality: 0.98}
					,html2canvas: {dpi: 192, letterRendering: true, useCORS: true}
					,jsPDF: {unit: 'mm', format: 'a3', orientation: 'portrait'}
				} );
			}
			angular.element( '.loading' ).hide();
		};


		/*Open gallery*/
		vm.openImage = function( index ){
			FancyBox.open( index );
		};


		/*Open invite dialog*/
		vm.showInvite = function(){
			var modalInstance = $uibModal.open( {
				templateUrl: '/modules/auction/client/views/email.client.modal.html'
				,controller: 'InviteUserClientController'
				,controllerAs: 'vm'
				,resolve: {
					projectObj: function(){
						return {
							project_id: vm.project._id
							,project_name: vm.project.project_name
							,project_type: vm.project.project_type
						};
					}
				}
			} );
		};


		/*Go to the add offer page*/
		vm.addOffer = function(){
			$state.go( 'add-offer', {projId: vm.project._id} );
		};


		/*Show list of offers*/
		vm.showOffers = function(){
			$state.go( 'auction', {projId: vm.project._id} );
		};

		$scope.$on( 'lastRepeaterElement', function(){
			if( vm.unitsToShow >= vm.units.length ){
				if( go_pdf ){
					var promise = $q( function( resolve, reject ){
						setTimeout( function(){
							var element = document.getElementById( 'project-to-download' );
							html2pdf( element, {
								margin: 1
								,filename: g_file_name
								,image: {type: 'jpeg', quality: 0.98}
								,html2canvas: {dpi: 192, letterRendering: true, useCORS: true}
								,jsPDF: {unit: 'mm', format: 'a3', orientation: 'portrait'}
							} );
							vm.unitsToShow = 10;
							vm.showMoreButton = true;
							resolve();
						}, 1000 );
					} );
					promise.then( function(){
						go_pdf = false;
						g_file_name = null;
					} );
				}
			}
		} );
	}
] );