;
(function($) {
	var hotsPot = {
		//获取MAP中元素属性
		adjust: function(map) {
			var coords = [];
			var element = map.children();
			var itemNumber = element.length;
			for (var i = 0; i < itemNumber; i++) {
				coords[i] = element[i].coords;
			}
			return coords;
		},
		//调整MAP中坐标
		adjustPosition: function($elem, w, h, ratio, coords) {
			var elemchild = $elem.children();
			//获取页面宽度
			var pageWidth = document.body.clientWidth;
			var pageHeith = Math.round(pageWidth / ratio);
			//图片的原始长宽
			var imageWidth = w;
			var imageHeigth = h;
			var len = coords.length;
			for (var j = 0; j < len; j++) {
				var coord = coords[j];
				var arr = coord.split(",");
				//获取每个坐标点
				for (var i = 0; i < arr.length; i++) {
					//x坐标
					arr[i] = Math.round(arr[i] * pageWidth / imageWidth);
					i++;
					//y坐标
					arr[i] = Math.round(arr[i] * pageHeith / imageHeigth);
				}
				var str = arr.join(",");
				elemchild[j].setAttribute("coords", str);
			}
		},
		bindEvent: function($img, callback) {
			$img.each(function() {
				var that = this;
				var img = new Image();
				img.onload = function() {
					var imgW = img.width;
					var imgH = img.height;
					var ratio = imgW / imgH;
					callback.call(that, imgW, imgH, ratio);
				};
				img.src = $img.attr("original");
			})
		}
	}
	window.hots = hotsPot;
})(jQuery);



//热点自适应
// hots.bindEvent($(".j_img"), function(imgW, imgH, ratio) {
//     var elemMap = $(this).next();
//     var coords = hots.adjust(elemMap);
//     hots.adjustPosition(elemMap, imgW, imgH, ratio, coords)
// })