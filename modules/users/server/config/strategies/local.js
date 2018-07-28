'use strict';

/**
 * Module dependencies
 */
var passport = require( 'passport' );
var LocalStrategy = require( 'passport-local' ).Strategy;


module.exports = function(){
    // Use local strategy
    passport.use( new LocalStrategy( {
        usernameField: 'usernameOrEmail',
        passwordField: 'password'
    },
    function( usernameOrEmail, password, done ){
        return done(null, user);
    });
};