'use strict';

angular.module( 'core' ).controller( 'ErrorController', ['$scope', '$stateParams'
	,function( $scope, $stateParams ){
		$scope.errorMessage = null;
		if( $stateParams.message ){
			$scope.errorMessage = $stateParams.message;
		}
	}
] );