'use strict';

angular.module( 'projects.fancybox' ).factory( 'FancyBox', function(){
	var images_arr = [];
	var service = {
		addItem: addItem
		,removeItem: removeItem
		,removeAll: removeAll
		,open: open
		,close: close
	};

	return service;


	/*add image object to array*/
	function addItem( caption, src )
	{
		images_arr.push( {src: src, caption: caption} );
	}

	/*remove image obj*/
	function removeItem( index )
	{
		if( images_arr.length < index ){
			images_arr.splice( index, 1 );
		}
	}

	/*clear all objs*/
	function removeAll()
	{
		images_arr = [];
	}


	/*open fancybox dialog*/
	function open( index )
	{
		var idx = index || 0;
		$.fancybox.open( images_arr, {
			index: idx
			,type: 'image'

			,openEffect: 'elastic'
			,openSpeed: 150

			,closeEffect: 'elastic'
			,closeSpeed: 150
		} );
	}


	/*close fancybox dialog*/
	function close()
	{
		$.fancybox.close();
	}

} );