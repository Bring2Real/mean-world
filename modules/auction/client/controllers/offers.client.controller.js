'use strict';

angular.module( 'auction.offers' ).controller( 'OffersBankClientController', ['$state', '$stateParams', 'Authentication', 'Notification', 'TemplateService', 'OfferService', 'AuctionService', '$filter'
	,function( $state, $stateParams, Authentication, Notification, TemplateService, OfferService, AuctionService, $filter ){
		var user = Authentication.user;
		if( !user ){
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
		vm.template_type = 3;
		vm.auction = {};
		vm.project = {};

		/*Initialize list of offers*/
		vm.initOffers = function(){
			vm.title = '';
			vm.auction = {};
			vm.project = {};
			vm.firm = {};
			vm.offers = [];
			vm.level = -1;
			vm.timeTitle = '';
			AuctionService.getByProject( $stateParams.projId, vm.lang )
			.then( function( response ){
				if( !response.data ){
					Notification.error( {message: 'Unable to load auction!', delay: 3000} );
					return false;
				}
				vm.auction = response.data;
				if( vm.auction.rounds.length == 0 ){
					Notification.warning( {message: 'No rounds of this auction found!', delay: 3000} );
					return false;
				}
				vm.project = response.project;
				vm.level = -1;
				for( var i = 0; i < vm.auction.rounds.length; i++ ){
					if( vm.auction.rounds[i].start && !vm.auction.rounds[i].end ){
						vm.level = vm.auction.rounds[i].level;
						break;
					}
				}
				if( vm.level == -1 ){
					Notification.warning( {message: 'Auction is not start!', delay: 3000} );
					return false;
				}
				OfferService.query( {auction_id: vm.auction._id, bank: true}, function( response ){
					//Prepare data to horizontal show
					var off = [];
					var count = 0;
					for( var i = 0; i < response.data.length; i++ ){
						if( response.data[i].level != vm.level ) continue;
						off.push( response.data[i] );
						off[off.length - 1].modify = false;
						off[off.length - 1].title = 'Offer ' + ( count + 1 );
						if( count != 0 && count % 3 == 0 ){
							vm.offers.push( off );
							off = [];
						}
						count++;
					}
					if( off.length > 0 ){
						vm.offers.push( off );
					}
					vm.title = response.firm.title + ' Round ' + vm.level;
					vm.firm = response.firm;
				}
				,function( err ){
					console.log( err );
					Notification.error( {message: 'Unable to load offers!', delay: 3000} );
					return false;
				} );
				
			}
			,function( err ){
				console.log( err );
				Notification.error( {message: 'Unable to load auction!', delay: 3000} );
			} );
		};


		/*Read offer template and show add offer form*/
		vm.addOffer = function(){
			var off = [];
			if( vm.offers.length == 0 ){
				angular.element( '.loading' ).show();
				TemplateService.query( {language: vm.lang, template_type: vm.template_type}, function( response ){
					var form_data = [];
					var date = new Date();
					//Prefilled some field
					for( var i = 0; i < response.data.length; i++ ){
						if( response.data[i].field_prefilled && response.data[i].field_prefilled.length != 0 ){
							if( response.data[i].field_prefilled == 'objects' ){
								var dat_objs = fill_prefilled_objects( response.data[i] );
								for( var j = 0; j < dat_objs.length; j++ ){
									form_data.push( dat_objs[j] );
								}
							}else{
								var dat = fill_prefilled( response.data[i], date );
								form_data.push( dat );
							}
							continue;
						}
						form_data.push( response.data[i] );
					}
					off = [
						{
							auction_id: vm.auction._id
							,level: vm.level
							,bank_id: vm.firm._id
							,form_data: form_data
							,accepted: false
							,rejected: false
							,modify: true
						}
					];
					angular.element( '.loading' ).hide();
					vm.offers.push( off );
				}
				,function( err ){
					angular.element( '.loading' ).hide();
					console.log( err );
					Notification.error( {message: 'Unable to load offer fields list!', delay: 3000} );
				} );
			}else{
				var length = vm.offers.length;
				off = angular.copy( vm.offers[length - 1][vm.offers[length - 1].length - 1] );
				off.title = 'Offer ' + ( vm.offers[length - 1].length + 1 );
				delete off._id;
				off.modify = true;
				for( var i = 0; i < off.form_data.length; i++ ){
					if( off.form_data[i].field_prefilled && off.form_data[i].field_prefilled.length > 0 ){
						off.form_data[i] = fill_prefilled( off.form_data[i], new Date() );
					}else{
						off.form_data[i].value = '';
					}
				}
				length++;
				if( length % 3 == 0 ){
					vm.offers.push( [off] );
				}else{
					vm.offers[length - 2].push( off );
				}
			}
		};


		/*Fill some prefilled fields*/
		function fill_prefilled( field, offer_date )
		{
			var ff = 'field_default';
			var length = vm.offers.length;
			var offers_length = (length != 0 )?vm.offers[length - 1].length:0;
			//if( field.field_type == 7 ){
				ff = 'value';
			//}
			switch( field.field_prefilled ){
				case 'offer_round':
					field[ff] = vm.level;
					break;
				case 'offer_number':
					field[ff] = vm.level + '.' + (offers_length + 1);
					break;
				case 'round_start':
					field[ff] = $filter( 'date' )( vm.auction.rounds[vm.level - 1].date_start, 'yyyy-MM-dd HH:mm' );
					break;
				case 'round_end':
					field[ff] = $filter( 'date' )( vm.auction.rounds[vm.level - 1].date_end, 'yyyy-MM-dd HH:mm' );
					break;
				case 'offer_date':
					field[ff] = $filter( 'date' )( offer_date, 'yyyy-MM-dd HH:mm' );
					break;
				case 'bank_address':
					field[ff] = vm.firm.post_code + ' ' + vm.firm.city + ', ' + vm.firm.street;
					break;
				case 'bank_contact_person':
					field[ff] = user.displayName;
					break;
				case 'bank_contact_email':
					field[ff] = user.email;
					break;
				case 'bank_contact_phone':
					field[ff] = user.phone;
					break;
			}
			return field;
		}


		/*Fill prefilled objects data*/
		function fill_prefilled_objects( field )
		{
			var ret = [];

			if( vm.auction.rounds[vm.level - 1].objects && vm.auction.rounds[vm.level - 1].objects.length != 0 ){
				for( var i = 0; i < vm.auction.rounds[vm.level - 1].objects.length; i++ ){
					var ff = angular.copy( field );
					ff.field_name += '_' + i + '';
					ff.value = vm.auction.rounds[vm.level - 1].objects[i].title + '  ' + vm.auction.rounds[vm.level - 1].objects[i].amount;
					ret.push( ff );
				}
			}

			return ret;
		}


		/*Store offer*/
		vm.storeOffer = function( off ){
			var isValid = true;
			for( var i = 0; i < off.form_data.length; i++ ){
				if( off.form_data[i].field_required && ( off.form_data[i].value == null || off.form_data[i].value.length == 0 ) ){
					Notification.warning( {message: 'Field ' + off.form_data[i].field_caption + ' is required!', delay: 3000} );
					isValid = false;
					break;
				}
			}
			if( !isValid ){
				return false;
			}
			var rSave = {
				auction_id: vm.auction._id
				,level: vm.level
				,bank_id: vm.firm._id
				,form_data: off.form_data
				,accepted: off.accepted
				,rejected: off.rejected
			};
			if( !( '_id' in off ) ){
				var offer = new OfferService( rSave );
				offer.$save( function( response ){
					vm.initOffers();
				}
				,function( err ){
					console.log( err );
					Notification.error( {message: 'Unable to store offer!', delay: 3000} );
				} );
			}else{
				rSave._id = off._id;
				OfferService.update( rSave, function( response ){
					off.modify = false;
				}
				,function( err ){
					console.log( err );
					Notification.error( {message: 'Unable to store offer!', delay: 3000} );
				} );
			}
		};

		/*Cancel modify*/
		vm.cancelModify = function( off ){
			vm.initOffers();
		};


		/*Modify offer*/
		vm.modifyOffer = function( off ){
			var flagModify = true;
			for( var i = 0; i < vm.offers.length; i++ ){
				for( var j = 0; j < vm.offers[i].length; j++ ){
					if( vm.offers[i][j].modify ){
						flagModify = false;
						break;
					}
				}
				if( !flagModify ){
					break;
				}
			}
			if( !flagModify ){
				return false;
			}
			off.modify = true;
		};


		/*Remove offer*/
		vm.removeOffer = function( off ){
			if( !( '_id' in off ) ){
				return false;
			}
			if( !confirm( 'Are you sure to remove offer?' ) ){
				return false;
			}
			OfferService.remove( {}, {_id: off._id}, function( response ){
				vm.initOffers();
			}
			,function( err ){
				console.log( err );
				Notification.error( {message: 'Unable to remove offer!', delay: 3000} );
			} );
		};
	}
] )
.controller( 'OffersListClientController', ['$state', '$stateParams', 'Authentication', 'Notification', 'ProjectsService', 'OfferService'
	,function( $state, $stateParams, Authentication, Notification, ProjectsService, OfferService ){
		var user = Authentication.user;
		if( !user ){
			$state.go( 'home' );
			return;
		}
		if( user.roles.indexOf( 'admin_project' ) == -1 && user.roles.indexOf( 'admin_company' ) == -1 ){
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
		vm.template_type = 3;

		/*Initialize list*/
		vm.initList = function(){
			vm.buttons = {
				start: true
				,pause: false
				,cancel: false
				,stop: false
			};
			vm.project = {};
			angular.element( '.loading' ).show();
			ProjectsService.get( {}, {_id: $stateParams.projId}, function( response ){
				//var 
			}
			,function( err ){
				angular.element( '.loading' ).hide();
				console.log( err );
				Notification.error( {message: 'Unable to load offer fields list!', delay: 3000} );
			} );
		};
	}
] )
.controller( 'OffersAdminClientController', ['$state', '$stateParams', 'Authentication', 'Notification', 'TemplateService', 'OfferService', 'AuctionService'
	,function( $state, $stateParams, Authentication, Notification, TemplateService, OfferService, AuctionService ){
		var user = Authentication.user;
		if( !user ){
			$state.go( 'home' );
			return;
		}
		if( user.roles.indexOf( 'admin_project' ) == -1 && user.roles.indexOf( 'admin_company' ) == -1 ){
			$state.go( 'home' );
			return;
		}
		console.log( $stateParams );
		if( !$stateParams.auctionId || !$stateParams.bankId ){
			Notification.error( {message: 'No Auction identificator!', delay: 3000} );
			$state.go( 'home' );
			return false;
		}

		var vm = this;

		/*Initialize offers*/
		vm.initOffers = function(){
			vm.title = '';
			vm.auction = {};
			vm.project = {};
			vm.firm = {};
			vm.offers = [];
			vm.level = $stateParams.round.level;
			vm.timeTitle = '';
			angular.element( '.loading' ).show();
			vm.auction = {
				_id: $stateParams.auctionId
				,round: $stateParams.round
			};
			OfferService.query( {auction_id: vm.auction._id, level: vm.auction.round.level, bank_id: $stateParams.bankId}, function( response ){
				//Prepare data to horizontal show
				var off = [];
				for( var i = 0; i < response.data.length; i++ ){
					if( response.data[i].level != vm.level ) continue;
					off.push( response.data[i] );
					off[off.length - 1].title = 'Offer ' + ( i + 1 );
					if( i != 0 && i % 2 == 0 ){
						vm.offers.push( off );
						off = [];
					}
				}
				if( off.length > 0 ){
					vm.offers.push( off );
				}
				vm.title = response.firm.title + ' Round ' + vm.level;
				vm.firm = response.firm;
				angular.element( '.loading' ).hide();
			}
			,function( err ){
				angular.element( '.loading' ).hide();
				console.log( err );
				Notification.error( {message: 'Unable to load offers list!', delay: 3000} );
			} );
		};


		/*Store field none*/
		vm.storeFieldNote = function( off, field_name ){
			var rSave = {
				_id: off._id
				,auction_id: vm.auction._id
				,level: vm.level
				,bank_id: vm.firm._id
				,form_data: off.form_data
				,accepted: off.accepted
				,rejected: off.rejected
			};
			OfferService.update( rSave, function( response ){
				Notification.success( {message: 'Note stored successfully!', delay: 3000} );
			}
			,function( err ){
				console.log( err );
				Notification.error( {message: 'Unable to set Note!', delay: 3000} );
			} );
		};


		/*Remove field note*/
		vm.removeFieldNote = function( off, field_name ){
			var store = false;
			for( var i = 0; i < off.form_data.length; i++ ){
				if( off.form_data[i].field_name == field_name ){
					off.form_data[i].field_note = null;
					store = true;
					break;
				}
			}
			var rSave = {
				_id: off._id
				,auction_id: vm.auction._id
				,level: vm.level
				,bank_id: vm.firm._id
				,form_data: off.form_data
				,accepted: off.accepted
				,rejected: off.rejected
			};
			OfferService.update( rSave, function( response ){
				Notification.success( {message: 'Note removed successfully!', delay: 3000} );
			}
			,function( err ){
				console.log( err );
				Notification.error( {message: 'Unable to remove Note!', delay: 3000} );
			} );
		};
	}
] );