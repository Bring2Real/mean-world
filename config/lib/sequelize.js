/**
 * Configure Sequelize
 */
'use strict';

var Sequelize = require( 'sequelize' );
var path = require( 'path' );

/**
 * Make scope of models
 * from list of files
 * Then init db for system
 */
module.exports.init = function( config ){
	var db = {};
	var sequelize = new Sequelize( config.db.dbname, config.db.username, config.db.password, {
		dialect: 'sqlite'
		,logging: false
		,pool: {
			min: 0
			,max: 5
			,idle: 10000
		}
		,storage: config.db.filename
		,operatorsAliases: false
	} );

	config.files.server.models.forEach( function( fileModel ){
		var model = sequelize.import( path.resolve( fileModel ) );
		db[model.name] = model;
	} );
	//Relations
	Object.keys( db ).forEach( function( modelName ){
		if( 'associate' in db[modelName] ){
			db[modelName].associate( db );
		}
	} );
	//set connections to db
	db.sequelize = sequelize;
	db.Sequelize = Sequelize;

	return db;
};