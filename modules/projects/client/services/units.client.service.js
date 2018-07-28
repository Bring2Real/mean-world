'use strict';

angular.module( 'projects.units' ).factory( 'UnitsService', ['$resource', 'Authentication', 'Upload'
	,function( $resource, Authentication, Upload ){
		var be = (Authentication.user)?Authentication.user.be:'';
		var Units = $resource( be + '/api/units/:unitId', {unitId: '@_id'}, {
			query: {
				isArray: false
				,withCredentials: true
			}
			,get: {
				withCredentials: true
				,isArray: false
				,method: 'GET'
			}
			,remove: {
				withCredentials: true
				,isArray: false
				,method: 'DELETE'
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
			,import_xlsx: {
				url: be + '/api/units/importxlsx'
				,withCredentials: true
				,isArray: false
				,method: 'POST'
			}
			,remove_all: {
				url: be + '/api/units/removeall'
				,withCredentials: true
				,isArray: false
				,method: 'POST'
			}
			,hide_show: {
				url: be + '/api/units/hideshow'
				,withCredentials: true
				,isArray: false
				,method: 'POST'
			}
		} );

		angular.extend( Units, {
			uploadXLSX: function( fileObj, project_id, language ){
				return Upload.upload( {
					url: be + '/api/units/uploadxlsx/' + project_id
					,data: {unit_import_file: fileObj, language: language}
					,withCredentials: true
				} );
			}
			,importXLSX: function( params ){
				return this.import_xlsx( params ).$promise;
			}
			,makeUnitArray: function( data ){
				if( !data || data.length == 0 ){
					return {unit_headers: [], units: []};
				}
				var unit_headers = [];
				var units = [];

				//make unit headers
				for( var j = 0; j < data.length; j++ ){
					for( var i = 0; i < data[j].unit_data.length; i++ ){
						if( searchInArrayObjects( 'field_pos', data[j].unit_data[i].field_pos, unit_headers ) ) continue;
						unit_headers.push( {
							field_caption: data[j].unit_data[i].field_caption
							,field_pos: data[j].unit_data[i].field_pos
							,field_name: data[j].unit_data[i].field_name
							,hidden: data[j].unit_data[i].hidden || false
						} );
					}
				}
				unit_headers.sort( sort_unit );
				for( var i = 0; i < data.length; i++ ){
					units.push( {
						_id: data[i]._id
						,version: data[i].version
						,unit_data: data[i].unit_data
					} );
					if( units[units.length - 1].unit_data.length < unit_headers.length ){
						//Adding to count
						var flag_add = true;
						for( var j = 0; j < unit_headers.length; j++ ){
							flag_add = true;
							for( var k = 0; k < data[i].unit_data.length; k++ ){
								if( unit_headers[j].field_pos == data[i].unit_data[k].field_pos ){
									flag_add = false;
									break;
								}
							}
							if( flag_add ){
								units[units.length - 1].unit_data.push( {
									field_pos: unit_headers[j].field_pos
									,field_name: unit_headers[j].field_name
									,value: '---'
									,hidden: unit_headers[j].hidden
								} );
							}
						}
					}
					units[units.length - 1].unit_data.sort( sort_unit );
				}

				//Implementstion of sort
				function sort_unit( a, b ){
					if( a.field_pos < b.field_pos ){
						return -1;
					}
					if( a.field_pos > b.field_pos ){
						return 1;
					}
					return 0;
				}

				//Search in array of objects
				function searchInArrayObjects( key, value, myArray )
				{
					var ret = false;
				    for( var i = 0; i < myArray.length; i++ ){
				        if( myArray[i][key] === value ){
				            ret = true;
				            break;
				        }
				    }
				    return ret;
				}

				return {unit_headers: unit_headers, units: units};
			}
			,removeAll: function( params ){
				return this.remove_all( params ).$promise;
			}
			,hideShowColumn: function( params ){
				return this.hide_show( params ).$promise;
			}
		} );

		return Units;
	}
] );