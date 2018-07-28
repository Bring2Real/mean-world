'use strict';

angular.module( 'templates' ).directive( 'autoComplete', function( $timeout ){
	return function( scope, elem, attrs ){
		elem.autocomplete( {
			source: scope[attrs.uiItems]
			,select: function(){
				console.log( scope );
				$timeout( function(){
					elem.trigger( 'input' );
				}, 0 );
			}
		} );
	};
} );