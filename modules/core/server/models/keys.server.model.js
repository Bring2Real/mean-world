/**
 * Model for core table
 * where api key is
 */
'use strict';

module.exports = function( sequelize, DataTypes ){
	var Keys = sequelize.define( 'cli_keys', {
		id: {
			field: 'id'
			,type: DataTypes.INTEGER
			,allowNull: false
			,primaryKey: true
			,autoIncrement: true
			,comment: 'Core id - Primary Key'
		}
		,backend: {
			field: 'backend'
			,type: DataTypes.STRING(30)
			,allowNull: false
			,primaryKey: false
			,comment: 'IP or Host Name of BackEnd'
		}
		,api_key: {
			field: 'api_key'
			,type: DataTypes.STRING(70)
			,allowNull: false
			,comment: 'API Key'
		}
		,key_date: {
			field: 'key_date'
			,type: DataTypes.DATE
			,comment: 'API Key End Date'
		}
		,disabled: {
			field: 'disabled'
			,type: DataTypes.BOOLEAN
			,default: true
		}
		,used: {
			field: 'used'
			,type: DataTypes.BOOLEAN
			,default: false
		}
	},{
		tableName: 'cli_keys'
		,comment: 'Client API Keys settings'
		,createdAt: '_datetime_created'
		,updatedAt: '_datetime_updated'
		,freezeTableName: true
		,charset: 'utf8'
		,underscored: true

		,indexes: [
			{
				name: 'coreidx_id'
				,unique: true
				,fields: [
					'id'
				]
			}
		]	
	} );
	return Keys;
};