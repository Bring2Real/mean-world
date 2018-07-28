'use strict';

angular.module( 'auction' ).config( ['$translateProvider'
	,function( $translateProvider ){
		$translateProvider.translations( 'ru', {
			'SEND_INVITATION_EMAIL': 'Отослать электронное приглашение',
			'SEND': 'Отослать',
			'INVITE': 'Пригласить',
			'START_COLLECTING_OFFERS': 'Начать аукцион',
			'PROJECT_MANAGER': 'Менеджер проекта',
			'INVITE_REMINDER': 'Напомнить о приглашениях',
			'FINISH_REMINDER': 'Напомнить об окончании',
			'ACTIVE': 'Активно',
			'EDIT': 'Изменить',
			'VIEW_TEASER': 'Просмотреть',
			'ROUND': 'Раунд',
			'ADD_ROUND': 'Добавить раунд',
			'WORK_DAYS': 'Раб.дни',
			'END': 'Окончание',
			'REVIEW_RESULTS_UNTIL': 'Работа с результатами до',
			'REVIEW_RESULTS_EMAIL_TEXT': 'Текст письма работы с результатами',
			'CALC_DATE': 'Расчитать дату',
			'INVITE_USER_OR_EMAIL': 'Пригласить пользователя или письмом',
			'INVITE_USER': 'Пригласить пользователя',
			'INVITE_EMAIL': 'Пригласить письмом',
			'FINISH_UNTIL': 'Окончание',
			'PAUSE': 'Пауза',
			'STOP': 'Стоп',
			'RESUME': 'Возобновить',
			'SUBJECT': 'Тема',
			'MESSAGE': 'Сообщение',
			'INVITED': 'Приглашено',
			'ACCEPTED': 'Подтверждено',
			'REJECTED': 'Отклонено',
			'COMPLETED': 'Окончено',
			'UNFINISHED': 'Неокончено',
			'FEEDBACK': 'Ответ',
			'IN_PROGRESS': 'В процессе',
			'OFFER_DATE': 'Дата предложения',
			'MAXIMUM_OFFER': 'Максимальное предложение',
			'INVITE_TO_ROUND': 'Пригласить в рануд',
			'WINNER': 'Победитель',
			'OFFER': 'Предложение',
			'SELECT': 'Выбрать',
			'REJECT': 'Отклонить',
			'ADD_NOTE': 'Примечание',
			'OBJECTS': 'Объекты',
			'ADD_OBJECT': '+ Объект'
		} );

		$translateProvider.translations( 'en', {
			'SEND_INVITATION_EMAIL': 'Send invitation email',
			'SEND': 'Send',
			'INVITE': 'Invite',
			'START_COLLECTING_OFFERS': 'Start collecting offers',
			'PROJECT_MANAGER': 'Project Manager',
			'INVITE_REMINDER': 'Invite Reminder',
			'FINISH_REMINDER': 'Finish Reminder',
			'ACTIVE': 'Active',
			'EDIT': 'Edit',
			'VIEW_TEASER': 'View Teaser',
			'ROUND': 'Round',
			'ADD_ROUND': 'Add Round',
			'WORK_DAYS': 'Workdays',
			'END': 'End',
			'REVIEW_RESULTS_UNTIL': 'Review results until',
			'REVIEW_RESULTS_EMAIL_TEXT': 'Review results email text',
			'CALC_DATE': 'Calc date',
			'INVITE_USER_OR_EMAIL': 'Invite user or by email',
			'INVITE_USER': 'Invite user',
			'INVITE_EMAIL': 'Invite by Email',
			'FINISH_UNTIL': 'Finish until',
			'PAUSE': 'Pause',
			'STOP': 'Stop',
			'RESUME': 'Resume',
			'SUBJECT': 'Subject',
			'MESSAGE': 'Message',
			'INVITED': 'Invited',
			'ACCEPTED': 'Accepted',
			'REJECTED': 'Rejected',
			'COMPLETED': 'Completed',
			'UNFINISHED': 'Unfinished',
			'FEEDBACK': 'Feedback',
			'IN_PROGRESS': 'In progress',
			'OFFER_DATE': 'Offer date',
			'MAXIMUM_OFFER': 'Maximum offer',
			'INVITE_TO_ROUND': 'Invite to round',
			'WINNER': 'Winner',
			'OFFER': 'Offer',
			'SELECT': 'Select',
			'REJECT': 'Reject',
			'ADD_NOTE': 'Add note',
			'OBJECTS': 'Objects',
			'ADD_OBJECT': '+ Object'
		} );

		$translateProvider.translations( 'de', {
			'SEND_INVITATION_EMAIL': 'Einladungs-E-Mail senden',
			'SEND': 'Senden',
			'INVITE': 'Einladen',
			'START_COLLECTING_OFFERS': 'Begginen Sie Angebote einzuholen',
			'PROJECT_MANAGER': 'Projektmanager',
			'INVITE_REMINDER': 'Einladung versenden',
			'FINISH_REMINDER': 'Erinnerung Runde beendet',
			'ACTIVE': 'Aktiv',
			'EDIT': 'Bearbeiten',
			'VIEW_TEASER': 'Teaser ansehen',
			'ROUND': 'Runden',
			'ADD_ROUND': 'Runde hinzufügen',
			'WORK_DAYS': 'Arbeitstage',
			'END': 'Ende',
			'REVIEW_RESULTS_UNTIL': 'Überprüfen Sie die Ergebnisse bis',
			'REVIEW_RESULTS_EMAIL_TEXT': 'Überprüfen Sie den E-Mail-Text der Ergebnisse',
			'CALC_DATE': 'Rechendatum',
			'INVITE_USER_OR_EMAIL': 'Benutzer einladen oder per E-Mail',
			'INVITE_USER': 'Nutzer einladen',
			'INVITE_EMAIL': 'Einladung per E-Mail',
			'FINISH_UNTIL': 'Fertig bis',
			'PAUSE': 'Pause',
			'STOP': 'Halt',
			'RESUME': 'Fortsetzen',
			'SUBJECT': 'Gegenstand',
			'MESSAGE': 'Botschaft',
			'INVITED': 'Eingeladen',
			'ACCEPTED': 'Akzeptiert',
			'REJECTED': 'Abgelehnt',
			'COMPLETED': 'Abgeschlossen',
			'UNFINISHED': 'Unvollendet',
			'FEEDBACK': 'Feedback',
			'IN_PROGRESS': 'In Bearbeitung',
			'OFFER_DATE': 'Angebotsdatum',
			'MAXIMUM_OFFER': 'Maximales Angebot',
			'INVITE_TO_ROUND': 'Zur Runde einladen',
			'WINNER': 'Gewinner',
			'OFFER': 'Angebot',
			'SELECT': 'Wählen',
			'REJECT': 'Ablehnen',
			'ADD_NOTE': 'Notiz hinzufügen',
			'OBJECTS': 'Objekte',
			'ADD_OBJECT': '+ Objekt'
		} );

		$translateProvider.preferredLanguage( 'en' );
	}
] );