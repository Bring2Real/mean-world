'use strict';

angular.module( 'core.utils' ).directive( 'validateEmail', function(){
	var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

	return {
		require: 'ngModel'
		,restrict: ''
		,link: function( scope, elem, attrs, ctrl ){
			//Only if ng-model and email validator are presents
			if( ctrl && ctrl.$validators.email ){
				ctrl.$validators.email = function( value ){
					return ctrl.$isEmpty( value ) || EMAIL_REGEXP.test( value );
				};
			}
		}
	};
} );