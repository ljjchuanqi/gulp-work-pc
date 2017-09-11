'use strict';

var __id=0;

function getId(){
	return ++__id;
}


function loadImages(images,callback,timeout) {
	//变量



	for (key in images) {
		if(images.hasOwnProperty(key))
			continue;


		var item=images[key];

		if(typeof item==="string"){
			item=images[key]={
				src:item
			}
		}
		if(!item||item.src)
			continue

		count++;
		item.id="__img_"+key+getId();
		item.img=window[item.id]=new Image();


		doLoad(item);
	}

	function doLoad(item){
		item.status="loading";

		var img=item.img;
		img.onload=function(){
			success=success&&true;
			item.status="loaded";
			done();
		}
		img.onerror=function(){
			success=false;
			item.status="error";
			done();
		}


		function done() {
			
		}
	}


	function onTimeout(){

	}


}