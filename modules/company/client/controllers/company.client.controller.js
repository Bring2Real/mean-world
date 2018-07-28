angular.module( 'company' ).controller( 'CompanyClientController', ['$scope', '$state', 'Authentication', 'CompanySrc', 'Notification', 'TemplateService'
	,function( $scope, $state, Authentication, CompanySrc, Notification, TemplateService ){
		var user = Authentication.user;
		if( !user ){
			$state.go( 'home' );
			return;
		}
		if( user.roles.indexOf( 'admin' ) == -1 && user.roles.indexOf( 'admin_company' ) == -1  ){
			$state.go( 'home' );
			return;
		}
		$scope.company = {};
		$scope.languages = [];

		TemplateService.getLanguages()
		.then( function( response ){
			$scope.languages = response;
			CompanySrc.getCompany( {} )
			.then( function( response ){
				$scope.company = response.data;
			}
			,function( err ){
				console.log( err );
				Notification.error( {message: 'Unable to load Company!', delay: 3000} );
			} );
		} );

		/*Save company*/
		$scope.saveCompany = function( isValid ){
			if( !isValid ){
				Notification.warning( {message: 'Please, fill the form correctly!', delay: 3000} );
				return false;
			}
			var rUpdate = {
				name: $scope.company.name
				,address: $scope.company.address
				,address2: $scope.company.address2
				,post_code: $scope.company.post_code
				,city: $scope.company.city
				,phone: $scope.company.phone
				,is_marketing: $scope.company.is_marketing
				,is_finance: $scope.company.is_finance
				,language: $scope.company.language
			};
			CompanySrc.updateCompany( rUpdate )
			.then( function( response ){
				Notification.success( {message: 'Company updated successfully!', delay: 3000} );
				$state.go( 'home' );
			}
			,function( err ){
				console.log( err );
				Notification.error( {message: 'Unable to update Company!', delay: 3000} );
			} );
		};
	}
] );