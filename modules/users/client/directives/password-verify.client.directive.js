'use strict';

angular.module( 'users' ).directive( 'passwordVerify', function(){
	return {
		require: 'ngModel'
		,link: link
		,scope: {
			passwordVerify: '='
		}
	};


	function link( scope, element, attrs, ngModel )
	{
		var status = true;
			scope.$watch( function(){
				var combined;
				if( scope.passwordVerify || ngModel ){
					combined = scope.passwordVerify + '_' + ngModel;
				}
				return combined;
			}
			,function( value ){
				if( value ){
					ngModel.$validators.passwordVerify = function( password ){
						var origin = scope.passwordVerify;
						return ( origin === password );
					};
				}
		} );
	}
} );