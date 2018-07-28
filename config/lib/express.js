/**
 * Configure express.js
 */
var express = require( 'express' );
var bodyParser = require( 'body-parser' );
var path = require( 'path' );
var compress = require( 'compression' );
var favicon = require( 'serve-favicon' );
var methodOverride = require( 'method-override' );
var flash = require( 'connect-flash' );
var cookieParser = require( 'cookie-parser' );
var session = require( 'express-session' );
var hbs = require( 'express-hbs' );
var passport = require( 'passport' );
var config = require( '../config' );
var RedisStore = require( 'connect-redis' )( session );


/**
 * Init locals variables
 */
module.exports.initLocalVariables = function( app ){
	app.locals.title = config.app.title;
	app.locals.jsFiles = config.files.client.js;
	app.locals.cssFiles = config.files.client.css;
	//ToDo - Add icon logo
	app.locals.favicon = config.app.favicon_path;
	app.locals.domain = config.app.domain || null;
	app.locals.env = process.env.NODE_ENV;

	//Request url to locals
	app.use( function( req, res, next ){
		app.locals.host = req.protocol + '://' + req.hostname;
		app.locals.url = req.protocol + '://' + req.headers.host + req.originalUrl;
		next();
	} );
};


/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function( app ){
	app.use( compress( {
		filter: function( req, res ){
			return ( /json|text|javascript|css|font|svg/ ).test( res.getHeader( 'Content-Type' ) );
		}
		,level: 9
	} ) );

	//favicon
	app.use( favicon( app.locals.favicon ) );

	//some dependencies to development
	if( process.env.NODE_ENV == 'development' ){
		app.set( 'view cache', false );
	}else if( process.env.NODE_ENV == 'production' ){
		app.locals.cache = 'memory';
	}

	//for requests
	app.use( bodyParser.urlencoded( {extended: true} ) );
	app.use( bodyParser.json() );
	app.use( methodOverride() );

	//Session
	app.use( session( {
		saveUninitialized: true
		,resave: false
		,secret: config.session.secret
		,cookie: {
			maxAge: config.session.cookie.maxAge
			,httpOnly: config.session.cookie.httpOnly
			,secure: config.session.cookie.secure
			,domain: process.env.COOKIE_DOMAIN || config.session.cookie.domain
		}
		,store: new RedisStore( {ttl: 1200} )
		,name: config.session.sessionKey
	} ) );

	//Cookie
	app.use( flash() );
	app.use( cookieParser() );
};


/**
 * Initialize view engine
 */
module.exports.initViewEngine = function( app ){
	app.engine( 'server.view.html', hbs.express4( {extname: '.server.view.html'} ) );
	app.set( 'view engine', 'server.view.html' );
	app.set( 'views', path.resolve( './' ) );
};


/**
 * Initialize client routes
 */
module.exports.initClientRoutes = function( app ){
	//static folder
	app.use( '/', express.static( path.resolve( './public' ), {maxAge: 86400000} ) );
	//global routing
	config.folders.client.forEach( function( staticPath ){
		app.use( staticPath, express.static( path.resolve( './' + staticPath ) ) );
	} );
};


/**
 * Initialize server routes
 */
module.exports.initServerRoutes = function( app ){
	config.files.server.routes.forEach( function( routePath ){
		require( path.resolve( routePath ) )( app );
	} );
};


/**
 * Initialize server configurations
 */
module.exports.initServerConfigs = function( app ){
	config.files.server.configs.forEach( function( configPath ){
		require( path.resolve( configPath ) )( app );
	} );
};


/**
 * Initializ error routes
 */
module.exports.initErrorRoutes = function( app ){
	app.use( function( err, req, res, next ){
		if( !err ){
			return next();
		}
		console.error( err.stack );
		//redirect to error page
		res.redirect( '/server-error' );
	} );
};


/**
 * Initialize express
 */
module.exports.init = function(){
	var app = express();

	//initializes
	this.initLocalVariables( app );

	this.initMiddleware( app );

	this.initServerConfigs( app );

	this.initViewEngine( app );

	this.initClientRoutes( app );

	this.initServerRoutes( app );

	this.initErrorRoutes( app );

	return app;
};