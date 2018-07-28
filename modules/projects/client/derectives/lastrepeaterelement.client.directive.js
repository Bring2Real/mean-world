'use strict';
angular.module( 'projects.expose' ).directive( 'emitLastRepeaterElement'
	,function(){
		return function( scope ){
			if( scope.$last ){
				scope.$emit( 'lastRepeaterElement' );
			}
		}
	}
);