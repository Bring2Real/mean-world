'use strict';

angular.module( 'core' ).run( ['menuService', '$rootScope'
	 ,function( menuService, $rootScope ){
	    menuService.addMenu( 'account', {
		       roles: ['admin', 'admin_company', 'admin_project', 'client_company', 'member_project', 'member_client', 'bank']
	    } );

	    menuService.addMenuItem( 'account', {
            title: ''
            ,state: 'settings'
            ,type: 'dropdown'
            ,roles: ['client', 'admin_company', 'admin_project', 'client_company', 'member_project', 'member_client', 'bank']
        } );

	    menuService.addSubMenuItem( 'account', 'settings', {
            title: 'EDIT_PROFILE',
            state: 'user-profile',
            position: 1,
            roles: ['client', 'admin_company', 'admin_project', 'client_company', 'member_project', 'member_client', 'bank']
        });
        menuService.addSubMenuItem( 'account', 'settings', {
            title: 'CHANGE_PASSWORD',
            state: 'user-password',
            position: 2,
            roles: ['client', 'admin_company', 'admin_project', 'client_company', 'member_project', 'member_client', 'bank']
        });

        menuService.addMenuItem( 'topbar', {
            title: 'SETTINGS',
            state: 'settings',
            type: 'dropdown',
            right: true,
            roles: ['admin_company', 'admin_project']
        } );

        menuService.addMenuItem( 'topbar', {
            title: 'SETTINGS',
            state: 'settings',
            type: 'dropdown',
            right: true,
            roles: ['admin_bank']
        } );

        menuService.addSubMenuItem( 'topbar', 'settings', {
            title: 'MANAGE_USERS'
            ,state: 'users-list'
            ,roles: ['admin_company']
            ,position: 1
        } );

        menuService.addSubMenuItem( 'topbar', 'settings', {
            title: 'UPDATE_COMPANY'
            ,state: 'update-company'
            ,roles: ['admin_company']
            ,position: 3
        } );

        menuService.addSubMenuItem( 'topbar', 'settings', {
            title: 'API_KEYS_COMPANY'
            ,state: 'keys-list'
            ,roles: ['admin_company']
            ,position: 2
        } );

        //Add Project and list of projects
        menuService.addMenuItem( 'topbar', {
            title: 'SELECT_PROJECT'
            ,state: 'select_project'
            ,type: 'dropdown'
            ,right: false
            ,roles: ['admin_company', 'admin_project', 'client_company', 'member_project', 'member_client', 'bank']
        } );
    }
] );