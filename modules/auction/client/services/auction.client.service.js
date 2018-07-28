'use strict';

angular.module( 'auction' ).factory( 'AuctionService', ['$resource', 'Authentication'
	,function( $resource, Authentication ){
		var be = (Authentication.user)?Authentication.user.be:'';
		var Auction = $resource( be + '/api/auctions/:auctionId', {auctionId: '@_id'}, {
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
			,get_by_project: {
				url: be + '/api/auctions/project'
				,withCredentials: true
				,isArray: false
				,method: 'GET'
			}
			,manual_start: {
				url: be + '/api/auctions/start'
				,withCredentials: true
				,isArray: false
				,method: 'POST'
			}
			,manual_pause: {
				url: be + '/api/auctions/pause'
				,withCredentials: true
				,isArray: false
				,method: 'POST'
			}
			,manual_resume: {
				url: be + '/api/auctions/resume'
				,withCredentials: true
				,isArray: false
				,method: 'POST'
			}
			,manual_cancel: {
				url: be + '/api/auctions/cancel'
				,withCredentials: true
				,isArray: false
				,method: 'POST'
			}
			,manual_stop: {
				url: be + '/api/auctions/stop'
				,withCredentials: true
				,isArray: false
				,method: 'POST'
			}
			,send_mails: {
				url: be + '/api/auctions/mails'
				,withCredentials: true
				,isArray: false
				,method: 'POST'
			}
		} );

		angular.extend( Auction, {
			getByProject: function( project_id, language, with_offers ){
				return this.get_by_project( {project_id: project_id, language: language, offers: with_offers || false} ).$promise;
			}
			,manualStart: function( params ){
				return this.manual_start( params ).$promise;
			}
			,manualPause: function( params ){
				return this.manual_pause( params ).$promise;
			}
			,manualResume: function( params ){
				return this.manual_resume( params ).$promise;
			}
			,manualCancel: function( params ){
				return this.manual_cancel( params ).$promise;
			}
			,manualStop: function( params ){
				return this.manual_stop( params ).$promise;
			}
			,sendMails: function( params ){
				return this.send_mails( params ).$promise;
			}
			,getCurrentRound: function( rounds ){
				var round = 1;
				for( var i = 0; i < rounds.length; i++ ){
					if( rounds[i].start && !rounds[i].end ){
						round = rounds[i].level;
						break;
					}
				}
				return round;
			}
			,calcDate: function( startDate, days ){
				var counter = 0;
				var date = new Date( startDate );
				while( days >= 0 ){
					date.setTime( startDate.getTime() + counter * 86400000 );
					if( isWorkDay( date ) ){
						days--;
					}
					counter++;
				}

				//Lite function. Later get holidays from timezone
				function isWorkDay( date ){
					var dayOfWeek = date.getDay();
					if( dayOfWeek == 0 || dayOfWeek == 6 ){
						return false;
					}
					return true;
				}
				//-------------------------------------------------
				return date;
			}
		} );

		return Auction;
	}
] );