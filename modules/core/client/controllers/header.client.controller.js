'use strict';

angular.module( 'core' ).controller( 'HeaderController', ['$scope', '$state', 'Authentication', 'menuService', '$rootScope', '$translate', 'UsersService', 'ProjectsService', 'ProjectRelations', '$window'
	,function( $scope, $state, Authentication, menuService, $rootScope, $translate, UsersService, ProjectsService, ProjectRelations, $window ){
		var vm = this;
	    var user = Authentication.user;
	    var lang = (!user)?'de':user.language;

        if( user && !user.language ){
            user.language = navigator.language || navigator.userLanguage;
            user.language = user.language.split( '-' )[0];
            if( user.language != 'en' && user.language != 'de' && user.language != 'ru' ){
                user.language = 'de';
            }
            lang = user.language;
        }
        $translate.use( lang );

	    vm.accountMenu = menuService.getMenu( 'account' ).items[0];
	    vm.authentication = Authentication;
	    vm.isCollapsed = false;
	    vm.menu = menuService.getMenu( 'topbar' );
	    $scope.$on( '$stateChangeSuccess', stateChangeSuccess );

	    if( vm.authentication.user ){
	    	$rootScope.menuActive = true;
	    }else{
	    	$rootScope.menuActive = false;
	    }

	    $rootScope.menuValues = {
	    	project_type: 1			//Finace by default
	    };

	    function stateChangeSuccess(){
	    	// Collapsing the menu after navigation
	    	vm.isCollapsed = false;
	    }

	    /*signout*/
	    vm.signout = function(){
	    	UsersService.userSignout()
	    	.then( function(){
	    		Authentication.user = null;
	    		window.user = null;
	    		$window.location.href = '/ssologin';
	    	} );
	    };

	    /*Set value from menu to RootScope*/
	    vm.setValue = function( value, title ){
	    	var sett = {};
	    	try{
	    		sett = JSON.parse( value );
	    	}catch( e ){
	    		sett = value;
	    	}
	    	angular.extend( $rootScope.menuValues, sett );
	    	//if key of value is named as some state, change title on them
	    	//to title of menu which was clicked
	    	var keys = Object.keys( sett );
	    	for( var i = 0; i < keys.length; i++ ){
	    		for( var j = 0; j < vm.menu.items.length; j++ ){
	    			if( keys[i] == vm.menu.items[j].state ){
	    				vm.menu.items[j].title = title;
	    				break;
	    			}
	    		}
	    	}
	    	//For change project
	    	if( 'proj_id' in value ){
	    		if( !value.proj_id ){
	    			return false;
	    		}
	    		//clear language
	    		localStorage.removeItem( 'lang' );
	    		localStorage.removeItem( 'unit_data' );
	    		$state.go( 'teaser-expose', {projId: value.proj_id} );
	    	}
	    };

	    //if user
	    if( user ){
	    	var isBank = (user.roles.indexOf( 'bank' ) != -1)?true:false;
	    	if( !isBank ){
    			//Menu finance and marketing
    			if( !Authentication.company ){
    				return  false;
    			}
    			setFinanceMarketingMenu( Authentication.company.is_finance, Authentication.company.is_marketing );
    			//----------------------------
    		}else{
    			ProjectRelations.projectsByUser( {} )
    			.then( function( response ){
		    		var is_finance = false;
		    		var is_marketing = false;
		    		if( response.data ){
		    			for( var i = 0; i < response.data.length; i++ ){
		    				if( response.data[i].project_type == 1 ){
		    					is_finance = true;
		    				}else if( response.data[i].project_type == 2 ){
		    					is_marketing = true;
		    				}
		    				if( is_finance && is_marketing ){
		    					break;
		    				}
		    			}
		    			setFinanceMarketingMenu( is_finance, is_marketing );
		    		}
    			} );
    		}

	    	var watch = $rootScope.$watch( 'menuValues.project_type', function( newVal, oldVal ){
	    		if( !newVal ){
	    			return false;
	    		}
	    		//clear projects from menu
	    		for( var i = 0; i < vm.menu.items.length; i++ ){
	    			if( vm.menu.items[i].state == 'select_project' ){
	    				vm.menu.items[i].items = [];
	    				break;
	    			}
	    		}
		    	if( user.roles.indexOf( 'admin_company' ) != -1 || user.roles.indexOf( 'admin_project' ) != -1 ){
			        menuService.addSubMenuItem( 'topbar', 'select_project', {
			            title: 'ADD_PROJECT'
			            ,state: 'create-teaser'
			            ,roles: ['admin_company', 'admin_project']
			            ,position: 1
			        } );
		    	}
		    	//Add projects
		    	if( !isBank ){
			    	ProjectsService.allStrict( newVal )
			    	.then( function( response ){
			    		if( response.data ){
			    			for( var i = 0; i < response.data.length; i++ ){
						        menuService.addSubMenuItem( 'topbar', 'select_project', {
						            title: response.data[i].project_name
						            ,state: 'curr_project'
						            ,value: {proj_id: response.data[i]._id}
						            ,roles: ['admin_company', 'admin_project']
						            ,position: i + 2
						        } );
			    			}
			    		}
				        menuService.addSubMenuItem( 'topbar', 'select_project', {
				            title: 'ALL_PROJECTS'
				            ,state: 'all-teasers'
				            ,roles: ['admin_company', 'admin_project', 'client_company', 'member_project', 'member_client']
				            ,position: 1
				        } );
			    	}
			    	,function( err ){
			    		console.log( err );
			    	} );
			    }else{
			    	ProjectRelations.projectsByUser( {project_type: newVal} )
			    	.then( function( response ){
			    		if( response.data ){
			    			for( var i = 0; i < response.data.length; i++ ){
						        menuService.addSubMenuItem( 'topbar', 'select_project', {
						            title: response.data[i].project_name
						            ,state: 'curr_project'
						            ,value: {proj_id: response.data[i]._id}
						            ,roles: ['bank']
						            ,position: i + 1
						        } );
			    			}
			    		}
			    	}
			    	,function( err ){
			    		console.log( err );
			    	} );
			    }
	    	}, true );

	    	//Expose project
	    	/*var watch1 = $rootScope.$watch( 'menuValues.proj_id', function( newVal, oldVal ){
	    		if( !newVal ){
	    			return false;
	    		}
	    		//clear language
	    		localStorage.removeItem( 'lang' );
	    		localStorage.removeItem( 'unit_data' );
	    		$state.go( 'project-expose', {projId: newVal} );
	    	}, true );*/
	    	
			/*Destroy events*/
			vm.$onDestroy = function(){
				watch();
				//watch1();
			};


			function setFinanceMarketingMenu( is_finance, is_marketing )
			{
	    		if( is_finance && is_marketing ){
			        //Set state of projects
			        menuService.addMenuItem( 'topbar', {
			            title: 'FINANCE'
			            ,state: 'project_type'
			            ,type: 'dropdown'
			            ,right: false
			            ,roles: ['admin_company', 'admin_project', 'client_company', 'member_project', 'member_client', 'bank']
			        } );

			        menuService.addSubMenuItem( 'topbar', 'project_type', {
			            title: 'FINANCE'
			            ,state: 'set_finance'
			            ,value: {project_type: 1}
			            ,roles: ['admin_company', 'admin_project', 'client_company', 'member_project', 'member_client', 'bank']
			            ,position: 1
			        } );

			        menuService.addSubMenuItem( 'topbar', 'project_type', {
			            title: 'MARKETING'
			            ,state: 'set_marketing'
			            ,value: {project_type: 2}
			            ,roles: ['admin_company', 'admin_project', 'client_company', 'member_project', 'member_client', 'bank']
			            ,position: 2
			        } );
	    		}else{
	    			if( is_finance ){
				        menuService.addMenuItem( 'topbar', {
				            title: 'FINANCE'
				            ,state: 'set_finance'
				            ,value: {project_type: 1}
				            ,roles: ['admin_company', 'admin_project', 'client_company', 'member_project', 'member_client', 'bank']
				        } );
	    			}else if( is_marketing ){
				        menuService.addMenuItem( 'topbar', {
				            title: 'MARKETING'
				            ,state: 'set_marketing'
				            ,value: {project_type: 2}
				            ,roles: ['admin_company', 'admin_project', 'client_company', 'member_project', 'member_client', 'bank']
				        } );
	    			}
	    		}
			}
	    }
	}
] );