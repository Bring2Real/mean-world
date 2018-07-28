'use strict';

angular.module( 'users.services' ).factory( 'PasswordStrength', ['$window'
	,function( $window ){
		var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;
		var serv = {
			getResult: getResult
			,getPopoverMsg: getPopoverMsg
		};

		return serv;

		/******************************************************************/

		function getResult( password )
		{
			var result = owaspPasswordStrengthTest.test( password );
			return result;
		}


		function getPopoverMsg()
		{
			var popoverMsg = 'Please enter a passphrase or password with ' + owaspPasswordStrengthTest.configs.minLength + ' or more characters, numbers, lowercase, uppercase, and special characters.';
			return popoverMsg;
		}
	}
] );