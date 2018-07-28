'use strict';

angular.module( 'templates' ).factory( 'TemplateService', ['$resource', 'Authentication'
	,function( $resource, Authentication ){
		var be = (Authentication.user)?Authentication.user.be:'';
		var Template = $resource( be + '/api/template/:tplfId', {tplfId: '@_id'}, {
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
			,copy_from_super: {
				url: be + '/api/template/super'
				,method: 'POST'
				,isArray: false
				,withCredentials: true
			}
			,create_default: {
				url: be + '/api/template/create'
				,method: 'POST'
				,isArray: false
				,withCredentials: true
			}
			,bulk_update: {
				url: be + '/api/template/update'
				,method: 'POST'
				,isArray: false
				,withCredentials: true
			}
			,set_default_language: {
				url: be + '/api/template/defaultlang'
				,method: 'POST'
				,isArray: false
				,withCredentials: true
			}
			,get_languages: {
				url: be + '/api/languages'
				,method: 'GET'
				,isArray: true
				,withCredentials: true
			}
			,remove_by_language: {
				url: be + '/api/template/remove'
				,method: 'POST'
				,isArray: false
				,withCredentials: true
			}
			,template_languages: {
				url: be + '/api/template/languages'
				,method: 'GET'
				,isArray: false
				,withCredentials: true
			}
		} );

		angular.extend( Template, {
			copyFromSuper: function( rParam ){
				return this.copy_from_super( rParam ).$promise;
			}
			,createFromDefault: function( rData ){
				return this.create_default( rData ).$promise;
			}
			,bulkUpdate: function( aData ){
				return this.bulk_update( {values: aData} ).$promise;
			}
			,setDefaultLanguage: function( rParam ){
				return this.set_default_language( rParam ).$promise;
			}
			,getLanguages: function(){
				return this.get_languages().$promise;
			}
			,removeByLanguage: function( rData ){
				return this.remove_by_language( rData ).$promise;
			}
			,templateLanguages: function( template_type ){
				return this.template_languages( {template_type: template_type} ).$promise;
			}
		} );
		return Template;
	}
] );