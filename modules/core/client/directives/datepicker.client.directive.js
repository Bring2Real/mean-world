'use strict';

angular.module( 'core' ).directive( 'jqdatepicker', function(){
	return {
		restrict: 'A'
		,require: 'ngModel'
		,link: function( scope, element, attrs, ngModelCtrl ){
			$( function(){
				var options = {
					dateFormat: 'yy-mm-dd'
					,onSelect: function( date ){
						ngModelCtrl.$setViewValue( date );
						scope.$apply();
					}
				};
				if( 'jqButtonImage' in attrs ){
					options.buttonImage = attrs.jqButtonImage;
					options.buttonImageOnly = true;
					options.showOn = 'both';
				}
				//enable only dates with history
				if( 'jqEnableFunc' in attrs && attrs.jqEnableFunc in scope ){
					options.beforeShowDay = scope[attrs.jqEnableFunc];
				}
				element.datepicker( options );
			} );
		}
	};
} );