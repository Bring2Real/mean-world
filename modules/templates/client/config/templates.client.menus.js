'use strict';

angular.module( 'templates' ).run( ['menuService'
	,function( menuService ){
        menuService.addSubMenuItem( 'topbar', 'settings', {
            title: 'PROJECTS_TEMPLATE'
            ,state: 'teasers-template'
            ,roles: ['admin_company']
            ,position: 4
        } );

        menuService.addSubMenuItem( 'topbar', 'settings', {
            title: 'OFFERS_TEMPLATE'
            ,state: 'offer-template'
            ,roles: ['admin_company']
            ,position: 5
        } );
	}
] );