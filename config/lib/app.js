/**
 * Application configuration
 */
'use strict';

var chalk = require( 'chalk' );
var express = require( './express' );
var sequelize = require( './sequelize' );
var config = require( '../config' );

module.exports.start = function start( cbf ){
	var app = express.init();
	var db = sequelize.init( config );
	db.sequelize.sync().then( function(){
		global.db = db;
		//Start application
		app.listen( config.app.port, config.app.host, function(){
			//debug info
			console.log( chalk.green( '-----' ) );
			console.log();
			console.log( chalk.green( 'Environment		' + process.env.NODE_ENV ) );
			console.log( chalk.green( 'Server			' + config.app.host + ':' + config.app.port ) );
			console.log( chalk.green( '-----' ) );
			//---------------------------------
			if( cbf ){
				cbf( app, config );
			}
		} );
	} );
};