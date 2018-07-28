'use strict';

angular.module( 'projects' ).factory( 'ProjectsService', ['$resource', 'Authentication', 'Upload'
	,function( $resource, Authentication, Upload ){
		var be = (Authentication.user)?Authentication.user.be:'';
		var Projects = $resource( be + '/api/projects/:projId', {projId: '@_id'}, {
			query: {
				isArray: false
				,withCredentials: true
			}
			,get: {
				withCredentials: true
				,isArray: false
				,method: 'GET'
			}
			,save: {
				withCredentials: true
				,isArray: false
				,method: 'POST'
			}
			,update: {
				method: 'PUT'
				,withCredentials: true
				,isArray: false
			}
			,remove: {
				method: 'DELETE'
				,withCredentials: true
				,isArray: false
			}
			,all_strict: {
				url: be + '/api/projects/strict'
				,method: 'GET'
				,withCredentials: true
				,isArray: false
			}
		} );

		angular.extend( Projects, {
			sendFiles: function( rFile ){
				if( rFile.names ){
					rFile.names = JSON.stringify( rFile.names );
				}
				return Upload.upload( {
					url: be + '/api/projects/upload'
					,data: rFile
					,header: {'Content-Type': undefined}
					,withCredentials: true
				} );
			}
			,allStrict: function( project_type ){
				return this.all_strict( {project_type: project_type} ).$promise;
			}
		} );

		return Projects;
	}
] );