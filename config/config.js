/**
 * Making configuration
 * to use with other modules
 */
'use strict';

var path = require( 'path' );
var fs = require( 'fs' );
var _ = require( 'lodash' );
var glob = require( 'glob' );
var config_app = require( './config.json' );


/**
 * Get file list by glob
 * patterns
 */
function getGlobPaths( patterns, excludes )
{
	var urlRegex = new RegExp( '^(?:[a-z]+:)?\/\/', 'i' );
	var ret = [];

	if( _.isArray( patterns ) ){
		patterns.forEach( function( ptt ){
			ret = _.union( ret, getGlobPaths( ptt, excludes ) );
		} );
	}else if( _.isString( patterns ) ){
		if( urlRegex.test( patterns ) ){
			ret.push( patterns );
		}else{
			var files = glob.sync( patterns );
			if( excludes ){
				files = files.map( function( file ){
					if( _.isArray( excludes ) ){
						for( var i in excludes ){
							if( excludes.hasOwnProperty( i ) ){
								file = file.replace( excludes[i], '' );
							}
						}
					}else{
						file = file.replace( excludes, '' );
					}
					return file;
				} );
			}
			ret = _.union( ret, files );
		}
	}

	return ret;
}


/**
 * Init global config folders
 */
function initGlobalConfigFolders( config, assets )
{
	config.folders = {
		server: {}
		,client: {}
	};

	//glob client path
	config.folders.client = getGlobPaths( path.join( process.cwd(), 'modules/*/client/' ), process.cwd().replace( new RegExp( /\\/g ), '/' ) );
}


/**
 * Init global configuration
 */
function initGlobalConfigFiles( config, assets )
{
	config.files = {
		server: {}
		,client: {}
	};

	//configs
  	config.files.server.configs = getGlobPaths( assets.server.configs );
  	//routes
	config.files.server.routes = getGlobPaths( assets.server.routes );
	//models
	config.files.server.models = getGlobPaths( assets.server.models );

	//client js files
	config.files.client.js = getGlobPaths( assets.client.lib.js, 'public/' ).concat( getGlobPaths( assets.client.js, ['public/'] ) );
	//client css files
	config.files.client.css = getGlobPaths( assets.client.lib.css, 'public/' ).concat( getGlobPaths( assets.client.css, ['public/'] ) );
}


/**
 * Initialize config
 */
var initGlobConfig = function(){
	var defaultAssets = require( path.join( process.cwd(), 'config/assets/default' ) );
	var config = {};

	initGlobalConfigFolders( config, defaultAssets );
	initGlobalConfigFiles( config, defaultAssets );

	config.utils = {
		getGlobPaths: getGlobPaths
	};

	config.app = config_app.application;
	config.session = config_app.session;

	//set NODE_ENV
	if( !process.env.NODE_ENV ){
		process.env.NODE_ENV = 'development';
	}
	config.db = {
		filename: (process.env.NODE_ENV == 'development')?'db/cli_dev.sqlite':'db/cli_prod.sqlite'
		,dbname: 'z_client'
		,username: 'root'
		,password: ''
	};

	return config;
};

module.exports = initGlobConfig();