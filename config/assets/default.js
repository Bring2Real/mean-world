/**
 * Default configuration
 * for assets
 */
'use strict';

module.exports = {
	client: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css'
				,'public/lib/bootstrap/dist/css/bootstrap-theme.css'
				,'public/lib/jquery-ui/themes/base/jquery-ui.css'
				,'public/lib/fancybox/dist/jquery.fancybox.min.css'
				,'public/lib/angular-ui-select/dist/select.min.css'
				,'public/lib/angular-ui-notification/dist/angular-ui-notification.css'
				,'public/lib/components-font-awesome/css/fontawesome-all.css'
				,'public/lib/fancybox/dist/jquery.fancybox.css'

			]
			,js: [
				'public/lib/lodash/dist/lodash.min.js'
				,'public/lib/jquery/dist/jquery.min.js'
				,'public/lib/angular/angular.js'
        		,'public/lib/angular-animate/angular-animate.min.js'
				,'public/lib/angular-bootstrap/ui-bootstrap-tpls.js'
				,'public/lib/angular-resource/angular-resource.min.js'
				,'public/lib/angular-ui-notification/dist/angular-ui-notification.js'
        		,'public/lib/angular-ui-router/release/angular-ui-router.js'
        		,'public/lib/angular-translate/angular-translate.min.js'
        		,'public/lib/angular-click-outside/clickoutside.directive.js'
        		,'public/lib/angular-cookies/angular-cookies.js'
        		,'public/lib/angular-messages/angular-messages.js'
        		,'public/lib/angular-smart-table/dist/smart-table.js'
				,'public/lib/jquery-ui/jquery-ui.min.js'
				,'public/lib/angular-ui-select/dist/select.js'
				,'public/lib/owasp-password-strength-test/owasp-password-strength-test.js'
				,'public/lib/fancybox/dist/jquery.fancybox.min.js'
				,'public/lib/ui-autocomplete/autocomplete.js'
				,'public/lib/ng-file-upload/ng-file-upload-all.js'
				,'public/lib/jspdf/dist/jspdf.min.js'
				,'public/lib/html2pdf.js/dist/html2pdf.js'
				,'public/lib/fancybox/dist/jquery.fancybox.js'
			]
		}
		,css: [
			'modules/*/client/{css,less,scss}/*.css'
		]
		,js: [
			'modules/core/client/app/config.js'
			,'modules/core/client/app/init.js'
			,'modules/*/client/*.js'
			,'modules/*/client/**/*.js'
		]
		,img: [
	      	'modules/**/*/img/**/*.jpg'
	      	,'modules/**/*/img/**/*.png'
	      	,'modules/**/*/img/**/*.gif'
	      	,'modules/**/*/img/**/*.svg'
		]
		,views: [
			'modules/*/client/views/**/*.html'
		]
	}
	,server: {
		models: [
			'modules/*/server/models/*.js'
		]
		,configs: [
			'modules/*/server/config/*.js'
		]
		,routes: [
			'modules/!(core)/server/routes/**/*.js'
			,'modules/core/server/routes/**/*.js'
		]
		,views: [
			'modules/*/server/views/*.html'
		]
	}
};