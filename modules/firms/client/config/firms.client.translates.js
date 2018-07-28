'use strict';

angular.module( 'firms' ).config( ['$translateProvider'
	,function( $translateProvider ){
		$translateProvider.translations( 'ru', {
			'UPDATE_BANK': 'Обновить Банк',
			'COUNTRY': 'Страна',
			'POST_CODE': 'Почтовый код',
			'CITY': 'Город',
			'STREET': 'Улица',
			'EMAIL_DOMAIN': 'Домен эл.почты'
		} );

		$translateProvider.translations( 'en', {
			'UPDATE_BANK': 'Update Bank',
			'COUNTRY': 'Country',
			'POST_CODE': 'Post code',
			'CITY': 'City',
			'STREET': 'Street',
			'EMAIL_DOMAIN': 'Email domain'
		} );

		$translateProvider.translations( 'de', {
			'UPDATE_BANK': 'Bank aktualisieren',
			'COUNTRY': 'Land',
			'POST_CODE': 'Postleitzahl',
			'CITY': 'Stadt',
			'STREET': 'Straße',
			'EMAIL_DOMAIN': 'E-Mail-Domäne'
		} );

		$translateProvider.preferredLanguage( 'en' );
	}
] );