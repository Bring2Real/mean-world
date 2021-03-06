'use strict';

angular.module( 'core' ).config( ['$translateProvider'
	,function( $translateProvider ){
		$translateProvider.translations( 'ru', {
			'SIGNIN': 'Вход',
			'SIGNOUT': 'Выход',
			'API_KEYS': 'Ключи',
			'BACK_END': 'Back-End',
			'API_KEY': 'Ключ',
			'KEY_DATE': 'Дата ключа',
			'DISABLED': 'Неактивен',
			'YES': 'Да',
			'NO': 'Нет',
			'ADD': 'Добавить',
			'SAVE': 'Сохранить',
			'CANCEL': 'Отмена',
			'USED': 'Используется',
			'SETTINGS': 'Настройки',
			'UPDATE_COMPANY': 'Редактировать компанию',
			'API_KEYS_COMPANY': 'Ключи компании',
			'MARKETING': 'Маркетинг',
			'FINANCE': 'Финансы',
			'FIELD_REQUIRED': 'Поле обязательно для заполнения',
			'COMPANY': 'Компания',
			'EN': 'Английский',
			'RU': 'Русский',
			'DE': 'Немецкий',
			'TEMPLATE': 'Шаблон',
			'FIELD': 'Поле',
			'REMOVE': 'Удалить',
			'DEFAULT': 'По-умолчанию',
			'SELECT_OPTIONS': 'Выбор',
			'SELECT_PROJECT': 'Выберите проект',
			'ADD_PROJECT': 'Добавить проект'
		} );

		$translateProvider.translations( 'en', {
			'SIGNIN': 'Signin',
			'SIGNOUT': 'Signout',
			'API_KEYS': 'Api Keys',
			'BACK_END': 'Back-End',
			'API_KEY': 'Api Key',
			'KEY_DATE': 'Key Date',
			'DISABLED': 'Disabled',
			'YES': 'Yes',
			'NO': 'No',
			'ADD': 'Add',
			'SAVE': 'Save',
			'CANCEL': 'Cancel',
			'USED': 'Used',
			'SETTINGS': 'Settings',
			'UPDATE_COMPANY': 'Update company',
			'API_KEYS_COMPANY': 'Company API Keys',
			'MARKETING': 'Marketing',
			'FINANCE': 'Finance',
			'FIELD_REQUIRED': 'Field is Required',
			'COMPANY': 'Company',
			'EN': 'English',
			'RU': 'Russian',
			'DE': 'German',
			'TEMPLATE': 'Template',
			'FIELD': 'Field',
			'REMOVE': 'Remove',
			'DEFAULT': 'Default',
			'SELECT_OPTIONS': 'Options',
			'SELECT_PROJECT': 'Select Teaser',
			'ADD_PROJECT': 'Add Teaser'
		} );

		$translateProvider.translations( 'de', {
			'SIGNIN': 'Anmelden',
			'SIGNOUT': 'Ausloggen',
			'API_KEYS': 'Api Schlüssel',
			'BACK_END': 'Back-End',
			'API_KEY': 'API-Schlüssel',
			'KEY_DATE': 'Datum',
			'DISABLED': 'Behindert',
			'YES': 'Ja',
			'NO': 'Nein',
			'ADD': 'Hinzufügen',
			'SAVE': 'Speichern',
			'CANCEL': 'Abbrechen',
			'USED': 'Benutzt',
			'SETTINGS': 'Einstellungen',
			'UPDATE_COMPANY': 'Firma aktualisieren',
			'API_KEYS_COMPANY': 'Unternehmens-API-Schlüssel',
			'MARKETING': 'Marketing',
			'FINANCE': 'Finanzen',
			'FIELD_REQUIRED': 'Feld ist erforderlich',
			'COMPANY': 'Firma',
			'EN': 'Englisch',
			'RU': 'Russisch',
			'DE': 'Deutsch',
			'TEMPLATE': 'Vorlage',
			'FIELD': 'Feld',
			'REMOVE': 'Löschen',
			'DEFAULT': 'Standard',
			'SELECT_OPTIONS': 'Optionen',
			'SELECT_PROJECT': 'Teaser auswählen',
			'ADD_PROJECT': 'Teaser hinzufügen'
		} );

		$translateProvider.preferredLanguage( 'en' );
	}
] );