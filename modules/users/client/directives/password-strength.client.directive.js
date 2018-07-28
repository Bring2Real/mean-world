'use strict';

angular.module( 'users' ).directive( 'passwordValidator', ['PasswordStrength'
	,function( PasswordStrength ){
		return {
			require: 'ngModel'
			,link: link
		};

		function link( scope, element, attrs, ngModel )
		{
			ngModel.$validators.requirements = function( password ){
				var status = true;
				if( password ){
					var result = PasswordStrength.getResult( password );
					var reqIdx = 0;
					var reqColors = [
						{
							color: 'danger'
							,progress: 20
						},{
							color: 'warning'
							,progress: 40
						},{
							color: 'info'
							,progress: 60
						},{
							color: 'primary'
							,progress: 80
						},{
							color: 'success'
							,progress: 100
						}
					];

					if( result.errors.length < reqColors.length ){
						reqIdx = reqColors.length - result.errors.length - 1;
					}
					scope.requirementsColor = reqColors[reqIdx].color;
					scope.requirementsProgress = reqColors[reqIdx].progress;

					if( result.errors.length ){
						scope.getPopoverMsg = PasswordStrength.getPopoverMsg();
						scope.passwordErrors = result.errors;
						status = false;
					}else{
						scope.getPopoverMsg = '';
						scope.passwordErrors = [];
						status = true;
					}
				}
				return status;
			};
		}
	}
] );