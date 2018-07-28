'use strict';

angular.module( 'company' ).config( ['$translateProvider'
	,function( $translateProvider ){
		$translateProvider.translations( 'ru', {
			"COMPANY_NAME": "Наименование",
			"ADMIN_NAMES": "Администраторы",
			"CREATED": "Создан",
			"MEMBERS": "Представители",
			"MODULES": "Модули",
			"INACTIVE": "Неактивно",
			"API_KEY": "Ключ API",
			"KEY_DATE": "Дата окончания ключа",
			"DISABLED": "Отключено",
			"API_KEY_UPDATE": "Редактирование ключа",
			"BY": " ",
			"UPDATED": "Обновлено",

			"COMPANY_PREFIX": "Префикс компании",
			"COMPANY_STREET_ADDRESS": "Адрес компании",
			"COMPANY_STREET_ADDRESS2": "Адрес компании 2",
			"COMPANY_POST_CODE": "Почтовый код компании",
			"COMPANY_CITY": "Город компании",
			"COMPANY_PHONE": "Телефон компании",
			"CUSTOM_SUB_DOMAIN": "Субдомен",

			"ADMIN_EMAIL": "Эл.почта Администратора",
			"ADMIN_MOBILE": "Телефон Администратора",
			"ADMIN_USERNAME": "Имя пользователя Администратора",
			"ADMIN_PASSWORD": "Пароль Администратора",
			"COMPANY_NAME_REQUIRED": "Имя компании обязательно для заполнения",
			"DEFAULT_LANGUAGE": "Язык по-умолчанию"
		} );

		$translateProvider.translations( 'en', {
			"COMPANY_NAME": "Company Name",
			"ADMIN_NAMES": "Admin Names",
			"CREATED": "Created",
			"MEMBERS": "Members",
			"MODULES": "Modules",
			"INACTIVE": "Inactive",
			"API_KEY": "API Key",
			"KEY_DATE": "API Key Date",
			"DISABLED": "Disabled",
			"API_KEY_UPDATE": "API Key Update",
			"BY": "By",
			"UPDATED": "Updated",

			"COMPANY_PREFIX": "Company prefix",
			"COMPANY_STREET_ADDRESS": "Company address",
			"COMPANY_STREET_ADDRESS2": "Company address 2",
			"COMPANY_POST_CODE": "Company postcode",
			"COMPANY_CITY": "Company city",
			"COMPANY_PHONE": "Company phone",
			"CUSTOM_SUB_DOMAIN": "Custom subdomain",

			"ADMIN_EMAIL": "Admin E-Mail",
			"ADMIN_MOBILE": "Admin mobile",
			"ADMIN_USERNAME": "Admin username",
			"ADMIN_PASSWORD": "Admin password",
			"COMPANY_NAME_REQUIRED": "Company name is Required",
			"DEFAULT_LANGUAGE": "Default language"
		} );

		$translateProvider.translations( 'de', {
			"COMPANY_NAME": "Name der Firma",
			"ADMIN_NAMES": "Admin-Namen",
			"CREATED": "Erstellt",
			"MEMBERS": "Mitglieder",
			"MODULES": "Module",
			"INACTIVE": "Inaktiv",
			"API_KEY": "API-Schlüssel",
			"KEY_DATE": "API-Schlüsseldatum",
			"DISABLED": "Behindert",
			"API_KEY_UPDATE": "API-Schlüsselaktualisierung",
			"BY": "Von",
			"UPDATED": "Aktualisiert",

			"COMPANY_PREFIX": "Firmenpräfix",
			"COMPANY_STREET_ADDRESS": "Firmenanschrift",
			"COMPANY_STREET_ADDRESS2": "Firmenanschrift 2",
			"COMPANY_POST_CODE": "Postleitzahl des Unternehmens",
			"COMPANY_CITY": "Firmenstadt",
			"COMPANY_PHONE": "Telefon des Unternehmens",
			"CUSTOM_SUB_DOMAIN": "Benutzerdefinierte Subdomain",

			"ADMIN_EMAIL": "Admin E-Mail",
			"ADMIN_MOBILE": "Admin mobil",
			"ADMIN_USERNAME": "Admin-Nutzername",
			"ADMIN_PASSWORD": "Administrator-Passwort",
			"COMPANY_NAME_REQUIRED": "Firmenname ist erforderlich",
			"DEFAULT_LANGUAGE": "Standardsprache"
		} );

		$translateProvider.preferredLanguage( 'en' );
	}
] );