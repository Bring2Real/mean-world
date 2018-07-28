'use strict';

angular.module( 'firms' ).run( ['menuService'
	,function( menuService ){
        menuService.addSubMenuItem( 'topbar', 'settings', {
            title: 'UPDATE_BANK'
            ,state: 'update-bank'
            ,roles: ['admin_bank']
            ,position: 1
        } );
	}
] );