'use strict';

angular.module( 'auction' ).controller( 'AuctionClientController', ['$state', '$stateParams', 'Authentication', 'Notification', 'AuctionService', '$rootScope', 'UsersService', '$uibModal', 'ProjectsService'
	,function( $state, $stateParams, Authentication, Notification, AuctionService, $rootScope, UsersService, $uibModal ){
		var user = Authentication.user;
		if( !user || ( user.roles.indexOf( 'admin_company' ) == -1 && user.roles.indexOf( 'admin_project' ) == -1 ) ){
			$state.go( 'home' );
			return;
		}
		if( !$stateParams.projId ){
			Notification.error( {message: 'No Teaser identificator!', delay: 3000} );
			$state.go( 'home' );
			return false;
		}
		var vm = this;
		vm.lang = user.language || 'en';
		vm.auction = {};
		vm.auctionSafe = {};
		vm.showOffers = false;
		vm.pageTitle = ($rootScope.menuValues && $rootScope.menuValues.project_type == 1)?'Financing':'Marketing';
		vm.pageTitle += ' Offers';
		vm.editAuction = false;
		vm.managers = [];
		vm.auctionSafe = {};
		vm.modifyRound = false;
		vm.statistics = [];
		vm.firstRowWidth = 380;
		vm.rowWidth = 260;

		/*Initialize auction*/
		vm.initAuction = function(){
			angular.element( '.loading' ).show();
			UsersService.getUsers( {} ).then( function( response ){
				vm.managers = [];
				for( var i = 0; i < response.length; i++ ){
					if( response[i].roles.indexOf( 'admin_project' ) != -1/* || response[i].roles.indexOf( 'admin_company' ) != -1*/ ){
						vm.managers.push( response[i] );
					}
				}
				AuctionService.getByProject( $stateParams.projId, vm.lang, true )
				.then( function( response ){
					var auction = response.data;
					if( !auction ){
						auction = {};
					}
					auction.project = response.project;
					auction.offers = response.offers || [];
					if( !auction || !( '_id' in auction ) ){
						vm.showOffers = false;
						vm.auction = {};
						angular.element( '.loading' ).hide();
					}else{
						if( parseInt( auction.status ) == 3 ){
							//Cancelled!
							angular.element( '.loading' ).hide();
							Notification.warning( {message: 'Auction was cancelled!', delay: 5000} );
						}
						vm.showOffers = true;
						vm.auction = auction;
						vm.auctionSafe.offers = auction.offers;
						//Make statistics
						for( var i = 0; i < auction.rounds.length; i++ ){
							var stat = {
								invited: 0
								,accepted: 0
								,rejected: 0
							};
							//prepare offers
							var width = vm.firstRowWidth; //The first element
							for( var j = 0; j < auction.offers.length; j++ ){
								if( auction.offers[j].level == auction.rounds[i].level ){
									width += vm.rowWidth;
								}
							}
							auction.rounds[i].table_width = width + 'px';

							for( var j = 0; j < auction.banks.length; j++ ){
								if( auction.banks[j].level == auction.rounds[i].level ){
									auction.banks[j].colspan = 0;
									stat.invited++;
									if( auction.banks[j].accepted ){
										stat.accepted++;
									}
									if( auction.banks[j].rejected ){
										stat.rejected++;
									}
									//colspan
									for( var k = 0; k < auction.offers.length; k++ ){
										if( auction.offers[k].bank_id._id == auction.banks[j].bank_id && auction.offers[k].level == auction.banks[j].level ){
											auction.banks[j].colspan++;
											auction.offers[k].num = auction.banks[j].colspan;
										}
									}
								}
							}
							vm.statistics.push( stat );
						}
						angular.element( '.loading' ).hide();
					}
				}
				,function( err ){
					console.log( err );
					Notification.error( {message: 'Unable to load auction!', delay: 3000} );
				} );
			}
			,function( err ){
				console.log( err );
				Notification.error( {message: 'Unable to load users!', delay: 3000} );
			} );
		};

		/*Create auction*/
		vm.createAuction = function(){
			var rSave = {
				project_id: $stateParams.projId
				,language: vm.lang
				,from_default: true
			};
			var auction = new AuctionService( rSave );
			auction.$save( function( response ){
				vm.auction = response.data;
				vm.auction.project = response.project;
				vm.showOffers = true;
			}
			,function( err ){
				console.log( err );
				Notification.error( {message: 'Unable to create auction!', delay: 3000} );
			} );
		};


		/*Start edit auction*/
		vm.startEditAuction = function(){
			vm.editAuction = true;
			vm.auctionSafe = angular.copy( vm.auction );
		};


		/*Cancel edit auction*/
		vm.cancelEditAuction = function(){
			vm.editAuction = false;
			vm.auctionSafe = {};
		};


		/*Change manager of project*/
		vm.changeManager = function(){
			for( var i = 0; i < vm.managers.length; i++ ){
				if( vm.auctionSafe.manager._id === vm.managers[i]._id ){
					vm.auctionSafe.manager = vm.managers[i];
					break;
				}
			}
		};


		/*Update auction*/
		vm.updateAuction = function(){
			var rUpdate = angular.copy( vm.auctionSafe );
			rUpdate.manager = rUpdate.manager._id
			delete rUpdate.user;
			delete rUpdate.user_update;
			delete rUpdate.createdAt;
			delete rUpdate.updatedAt;
			AuctionService.update( rUpdate, function( response ){
				vm.auction = angular.copy( vm.auctionSafe );
				vm.auctionSafe = {};
				vm.editAuction = false;
			}
			,function( err ){
				console.log( err );
				Notification.error( {message: 'Unable to update auction!', delay: 3000} );
			} );
		};


		/*Show add or modify round*/
		vm.showModifyRound = function( round ){
			vm.round = {
				level: (vm.auction.rounds)?vm.auction.rounds.length + 1:1
				,update: false
				,objects: []
			};
			if( round ){
				vm.round = round;
				vm.round.update = true;
				vm.round.date_start = vm.round.date_start.split( 'T' )[0];
				vm.round.date_end = vm.round.date_end.split( 'T' )[0];
				vm.round.date_review = vm.round.date_review.split( 'T' )[0];
			}else{
				if( vm.auction.rounds && vm.auction.rounds.length != 0 ){
					vm.round.objects = vm.auction.rounds[0].objects;
				}
			}
			vm.modifyRound = true;
		};


		/*Calc end date from work days*/
		vm.calcEndRoundDate = function( round ){
			if( !round.date_start ){
				Notification.warning( {message: 'Enter valid start round date, please!', delay: 3000} );
				return false;
			}
			if( !round.work_days ){
				Notification.warning( {message: 'Enter valid work days, please!', delay: 3000} );
				return false;
			}
			var date_end = AuctionService.calcDate( new Date( round.date_start ), round.work_days );
			console.log( date_end );
			var days = date_end.getDate() + '';
			var month = ( date_end.getMonth() + 1 ) + '';
			var year = date_end.getFullYear();
			var str_date_end = year + ''; //To Str
			if( days.length == 1 ){
				days = '0' + days;
			}
			if( month.length == 1 ){
				month = '0' + month;
			}

			round.date_end = year + '-' + month + '-' + days;
		};


		/*Add object to round*/
		vm.addObject = function( round ){
			if( !round.objects ){
				round.objects = [];
			}
			round.objects.push( {
				title: ''
				,amount: 0.00
			} );
		};


		/*Remove object from round*/
		vm.removeObject = function( round, index ){
			if( !round.objects || index > round.objects.length - 1 ){
				return false;
			}
			round.objects.splice( index, 1 );
		};

		/*Store round data*/
		vm.storeRound = function( isValid ){
			if( !isValid ){
				Notification.warning( {message: 'Fill form correctly please!', delay: 3000} );
				return false;
			}
			//First checks
			if( !vm.round.date_start ){
				Notification.warning( {message: 'Select round start date please!', delay: 3000} );
				return false;
			}
			if( !vm.round.date_end ){
				Notification.warning( {message: 'Select round end date please!', delay: 3000} );
				return false;
			}
			if( !vm.round.date_review ){
				Notification.warning( {message: 'Select round review date please!', delay: 3000} );
				return false;
			}

			var rUpdate = {
				_id: vm.auction._id
				,round: angular.copy( vm.round )
			}
			rUpdate.round.date_start = new Date( vm.round.date_start );
			rUpdate.round.date_start.setHours( 8 );
			rUpdate.round.date_start.setMinutes( 0 );
			rUpdate.round.date_start.setSeconds( 0 );

			rUpdate.round.date_end = new Date( vm.round.date_end );
			rUpdate.round.date_end.setHours( 8 );
			rUpdate.round.date_end.setMinutes( 0 );
			rUpdate.round.date_end.setSeconds( 0 );

			rUpdate.round.date_review = new Date( vm.round.date_review );
			rUpdate.round.date_review.setHours( 8 );
			rUpdate.round.date_review.setMinutes( 0 );
			rUpdate.round.date_review.setSeconds( 0 );

			if( vm.round.update ){
				rUpdate.update_round = true;
				delete rUpdate.round.update;
				AuctionService.update( rUpdate, function( response ){
					for( var i = 0; i < vm.auction.rounds.length; i++ ){
						if( vm.auction.rounds[i].level == vm.round.level ){
							vm.auction.rounds[i] = vm.round;
							break;
						}
					}
					vm.modifyRound = false;
				}
				,function( err ){
					console.log( err );
					Notification.error( {message: 'Unable to update round!', delay: 3000} );
				} );
			}else{
				rUpdate.add_round = true;
				delete rUpdate.round.update;
				AuctionService.update( rUpdate, function( response ){
					vm.auction.rounds.push( rUpdate.round );
					vm.modifyRound = false;
					vm.statistics.push( {
						invited: 0
						,accepted: 0
						,rejected: 0
					} );
				}
				,function( err ){
					console.log( err );
					Notification.error( {message: 'Unable to update round!', delay: 3000} );
				} );
			}
		};

		/*Cancel modify round*/
		vm.cancelModifyRound = function(){
			vm.round = {};
			vm.modifyRound = false;
		};


		/*Invite by Email*/
		vm.inviteEmail = function( level ){
			var modalInstance = $uibModal.open( {
				templateUrl: '/modules/auction/client/views/email.client.modal.html'
				,controller: 'InviteUserClientController'
				,controllerAs: 'vm'
				,resolve: {
					projectObj: function(){
						return {
							project_id: vm.auction.project_id
							,project_name: vm.auction.project.project_name
							,project_type: vm.auction.project.project_type
							,auction_id: vm.auction._id
							,level: level
							,stat: vm.statistics[level - 1]
						};
					}
				}
			} );
		};

		/*Invite User*/
		vm.inviteUser = function( level ){
			var modalInstance = $uibModal.open( {
				templateUrl: '/modules/auction/client/views/users.client.modal.html'
				,controller: 'InviteOldUserClientController'
				,controllerAs: 'vm'
				,resolve: {
					projectObj: function(){
						return {
							project_id: vm.auction.project_id
							,project_name: vm.auction.project.project_name
							,project_type: vm.auction.project.project_type
							,auction_id: vm.auction._id
							,level: level
							,stat: vm.statistics[level - 1]
						};
					}
				}
			} );
		};

		/*Manual start auction*/
		vm.setStart = function(){
			var level = 1;
			for( var i = 0; i < vm.auction.rounds.length; i++ ){
				if( !vm.auction.rounds[i].start ){
					level = vm.auction.rounds[i].level;
					break;
				}
			}
			AuctionService.manualStart( {auction_id: vm.auction._id, level: level} )
			.then( function( response ){
				vm.auction.status = response.data.status;
				vm.auction.rounds = response.data.rounds;
			}
			,function( err ){
				console.log( err );
				Notification.error( {message: 'Unable to start auction!', delay: 3000} );
			} );
		};

		/*Manual pause auction*/
		vm.setPause = function(){
			AuctionService.manualPause( {auction_id: vm.auction._id} )
			.then( function( response ){
				vm.auction.status = response.data.status;
				vm.auction.rounds = response.data.rounds;
				sendMails( 2 );
			}
			,function( err ){
				console.log( err );
				Notification.error( {message: 'Unable to paused auction!', delay: 3000} );
			} );
		};

		/*Manual resume auction*/
		vm.setResume = function(){
			AuctionService.manualResume( {auction_id: vm.auction._id} )
			.then( function( response ){
				vm.auction.status = response.data.status;
				vm.auction.rounds = response.data.rounds;
				sendMails( 3 );
			}
			,function( err ){
				console.log( err );
				Notification.error( {message: 'Unable to resume auction!', delay: 3000} );
			} );
		};

		/*Manual cancel auction*/
		vm.setCancel = function(){
			AuctionService.manualCancel( {auction_id: vm.auction._id} )
			.then( function( response ){
				vm.auction.status = response.data.status;
				vm.auction.rounds = response.data.rounds;
				sendMails( 4 );
			}
			,function( err ){
				console.log( err );
				Notification.error( {message: 'Unable to cancel auction!', delay: 3000} );
			} );
		};

		/*Manual stop auction*/
		vm.setStop = function(){
			var level = 1;
			for( var i = 0; i < vm.auction.rounds.length; i++ ){
				if( vm.auction.rounds[i].start && !vm.auction.rounds[i].end ){
					level = vm.auction.rounds[i].level;
					break;
				}
			}
			AuctionService.manualStop( {auction_id: vm.auction._id, level: level} )
			.then( function( response ){
				vm.auction.status = response.data.status;
				vm.auction.rounds = response.data.rounds;
			}
			,function( err ){
				console.log( err );
				Notification.error( {message: 'Unable to stop auction!', delay: 3000} );
			} );
		};


		/*Send invite to next round*/
		vm.acceptToNext = function( bank, level ){
			var modalInstance = $uibModal.open( {
				templateUrl: '/modules/auction/client/views/mail.client.modal.html'
				,controller: 'SendAcceptEmailsClientController'
				,controllerAs: 'vm'
				,resolve: {
					mailObj: function(){
						if( !bank.accepted ){
							bank.accepted = true;
							bank.rejected = false;
						}
						var subject = (level == vm.auction.rounds.length)?'Winner letter!':'Invite ro round ' + ( level + 1 );
						var message = 'Notes: ';
						for( var i = 0; i < vm.auction.offers.length; i++ ){
							if( vm.auction.offers[i].bank_id._id != bank.bank_id ) continue;
							if( vm.auction.offers[i].level != level ) continue;
							for( var j = 0; j < vm.auction.offers[i].form_data.length; j++ ){
								if( vm.auction.offers[i].form_data[j].field_note && vm.auction.offers[i].form_data[j].field_note.length > 0 ){
									message += '\n';
									message += 'Field: ' + vm.auction.offers[i].form_data[j].field_name + ', ' + vm.auction.offers[i].form_data[j].field_note;
								}
							}
						}
						return {
							bank: bank
							,subject: subject
							,auction: vm.auction
							,message: message
							,dialogTitle: 'Accept Email'
						};
					}
				}
			} );
		};


		/*Send reject*/
		vm.rejectBank = function( bank, level ){
			var modalInstance = $uibModal.open( {
				templateUrl: '/modules/auction/client/views/mail.client.modal.html'
				,controller: 'SendAcceptEmailsClientController'
				,controllerAs: 'vm'
				,resolve: {
					mailObj: function(){
						if( !bank.rejected ){
							bank.rejected = true;
							bank.accepted = false;
						}
						var subject = 'Reject Email';
						var message = 'Notes: ';
						for( var i = 0; i < vm.auction.offers.length; i++ ){
							if( vm.auction.offers[i].bank_id._id != bank.bank_id ) continue;
							if( vm.auction.offers[i].level != level ) continue;
							for( var j = 0; j < vm.auction.offers[i].form_data.length; j++ ){
								if( vm.auction.offers[i].form_data[j].field_note && vm.auction.offers[i].form_data[j].field_note.length > 0 ){
									message += '\n';
									message += 'Field: ' + vm.auction.offers[i].form_data[j].field_name + ', ' + vm.auction.offers[i].form_data[j].field_note;
								}
							}
						}
						return {
							bank: bank
							,subject: subject
							,auction: vm.auction
							,message: message
							,dialogTitle: 'Reject Email'
						};
					}
				}
			} );
		};

		/*Open send mails dialog*/
		function sendMails( type )
		{
			var modalInstance = $uibModal.open( {
				templateUrl: '/modules/auction/client/views/mail.client.modal.html'
				,controller: 'SendEmailsClientController'
				,controllerAs: 'vm'
				,resolve: {
					mailObj: function(){
						var obj = {
							project_id: vm.auction.project_id
							,message: ''
							,subject: ''
							,dialogTitle: 'Send emails'
						};
						switch( type ){
							case 2:
								obj.dialogTitle = 'Pause of Auction Emails';
								obj.subject = 'Pausing auction';
								obj.message = 'Auction of ' + vm.auction.project.project_name + ' was paused';
								break;
							case 3:
								obj.dialogTitle = 'Resume of Auction Emails';
								obj.subject = 'Resuming auction';
								obj.message = 'Auction of ' + vm.auction.project.project_name + ' was resumed';
								break;
							case 4:
								obj.dialogTitle = 'Auction Cancel Emails';
								obj.subject = 'Cancelling auction';
								obj.message = 'Auction of ' + vm.auction.project.project_name + ' was cancelled!';
								break;
						}
						return obj;
					}
				}
			} );
		}

	}
] )
.controller( 'SendEmailsClientController', ['$state', '$uibModalInstance', 'Authentication', 'Notification', 'mailObj', 'AuctionService'
	,function( $status, $uibModalInstance, Authentication, Notification, mailObj, AuctionService ){
		var user = Authentication.user;
		if( !user ){
			$state.go( 'home' );
			return;
		}
		var vm = this;
		vm.mail = {
			subject: mailObj.subject || ''
			,message: mailObj.message || ''
		};
		vm.process = false;

		vm.dialogTitle = mailObj.dialogTitle || 'Send Emails';

		/*Send Emails*/
		vm.sendEmails = function( isValid ){
			if( !isValid ){
				return false;
			}
			var rSend = {
				project_id: mailObj.project_id
				,subject: vm.mail.subject
				,mail: vm.mail.message
			};
			vm.process = true;
			AuctionService.sendMails( rSend )
			.then( function( response ){
				vm.process = false;
				Notification.success( {message: 'Emails send successfully!', delay: 3000} );
				$uibModalInstance.close();
			}
			,function( err ){
				vm.process = false;
				console.log( err );
				Notification.error( {message: 'Unable to send emails!', delay: 3000} );
			} );
		};

		/*cancel*/
		vm.cancel = function(){
			$uibModalInstance.dismiss( 'cancel' );
		};
	}
] )
.controller( 'SendAcceptEmailsClientController', ['$state', '$uibModalInstance', 'Authentication', 'Notification', 'mailObj', 'AuctionService'
	,function( $state, $uibModalInstance, Authentication, Notification, mailObj, AuctionService ){
		var user = Authentication.user;
		if( !user ){
			$state.go( 'home' );
			return;
		}
		var vm = this;
		vm.mail = {
			subject: mailObj.subject || ''
			,message: mailObj.message || ''
		};
		vm.process = false;

		vm.dialogTitle = mailObj.dialogTitle || 'Send Emails';

		/*Send Emails*/
		vm.sendEmails = function( isValid ){
			if( !isValid ){
				return false;
			}
			var rSend = {
				bank_id: mailObj.bank.bank_id
				,subject: vm.mail.subject
				,mail: vm.mail.message
			};
			vm.process = true;
			var rSave = {
				_id: mailObj.auction._id
				,invite_reminder: mailObj.auction.invite_reminder
				,finish_reminder: mailObj.auction.finish_reminder
				,bank: mailObj.bank
			};
			AuctionService.update( rSave, function( response ){
				AuctionService.sendMails( rSend )
				.then( function( response ){
					vm.process = false;
					Notification.success( {message: 'Emails send successfully!', delay: 3000} );
					$uibModalInstance.close();
				}
				,function( err ){
					vm.process = false;
					console.log( err );
					Notification.error( {message: 'Unable to send emails!', delay: 3000} );
				} );
			}
			,function( err ){
				vm.process = false;
				console.log( err );
				Notification.error( {message: 'Unable to send emails!', delay: 3000} );
			} );
		};

		/*cancel*/
		vm.cancel = function(){
			$uibModalInstance.dismiss( 'cancel' );
		};
	}
] );