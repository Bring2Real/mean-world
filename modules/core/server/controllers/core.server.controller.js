/**
 * Controller for
 * core module of server
 */
'use strict';

var validator = require( 'validator' );

/**
 * Render a index page of Application
 * @param  {object} req Params of a request
 * @param  {object} res Resolve routines
 */
exports.renderIndex = function( req, res ){
	var user_obj = null;
	var user = (req.session.user)?req.session.user:req.user;
	var be_session = req.session.be_session || null;
	var be = req.session.be || null;
	var safeCompanyObject = null;
	//if user is logged in, then make object and store them
	//for session
	if( user ){
		user_obj = {
			displayName: validator.escape( user.displayName )
			,username: validator.escape( user.username )
			,roles: user.roles
			,created: user.created.toString()
			,email: validator.escape( user.email )
			,firstName: validator.escape( user.firstName )
			,lastName: validator.escape( user.lastName )
			,language: validator.escape( user.language ) || 'de'
			,org: (user.org)?validator.escape( user.org ):''
			,profileImageURL: user.profileImageURL
			,phone: (user.phone)?user.phone:''
			,be: be
		};
	}

	if( req.session.company ){
		safeCompanyObject = {
			name: validator.escape( req.session.company.name )
			,is_marketing: req.session.company.is_marketing
			,is_finance: req.session.company.is_finance
			,language: req.session.company.language
		};
	};

	req.session.save();
	res.render( 'modules/core/server/views/index', {
		user: JSON.stringify( user_obj )
		,anotherSess: JSON.stringify( be_session )
		,server: JSON.stringify( be )
		,company: JSON.stringify( safeCompanyObject )
	} );
};


/**
 * Create or Update
 * model on Sequelize
 */
exports.createOrUpdate = function( model, where, new_item, cbf ){
	return model.findOne( {where: where} )
	.then( function( oldItem ){
		if( !oldItem ){
			return model.create( new_item )
			.then( function( data ){
				return cbf( null, true, false );
			} )
			.catch( function( err ){
				return cbf( err, null, null );
			} );
		}else{
			return model.update( new_item, {where: where} )
			.then( function( data ){
				return cbf( null, false, true );
			} )
			.catch( function( err ){
				return cbf( err, null, null );
			} );
		}
	} )
	.catch( function( err ){
		return cbf( err, null, null );
	} );
};