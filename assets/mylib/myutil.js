;
(function() {
	var myutil = {
		throttle: function(method, delay, duration) {
			var that = this;
			var timer = null,
				begin = new Date();
			return function() {
				var context = that,
					args = arguments,
					current = new Date();
				clearTimeout(timer);
				if (current - begin >= duration) {
					method.apply(context, args);
					begin = current;
				} else {
					timer = setTimeout(function() {
						method.apply(context, args);
					}, delay);
				}
			}
		},
		trim:function(str){
			return str.replace(/^\s+/,"").replace(/\s+$/,"");
		},
		escapeHtml: function(str) {
			return str.replace(/[<>"&]/gi, function(match) {
				switch (match) {
					case "<":
						return "&lt;";
					case ">":
						return "&gt;";
					case "&":
						return "&amp;";
					case "\"":
						return "&quot;";
				}
			})
		},
		serilizeUrl: function(url) {
			var result = {};
			url = url.split("?")[1];
			var map = url.split("&");
			for (var i = 0; i < map.length; i++) {
				var field = map[i].split("=");
				result[field[0]] = field[1];
			}
			return result;
		},
		getRandom: function(istart, iend) {
			var iChoice = Math.abs(istart - iend + 1);
			return Math.floor(Math.random() * iChoice + istart);
		},
		clone: function(obj) {
			var o = obj.constructor === Array ? [] : {};
			for (var e in obj) {
				o[e] = typeof obj[e] === "object" ? obj[e].clone() : obj[e];
			}
			return o;
		},
		quickSort: function(arr) {
			if (arr.length <= 1) {
				return arr;
			}
			var num = Math.floor(arr.length / 2);
			var numValue = arr.splice(num, 1);
			var left = [];
			var right = [];

			for (var i = 0; i < arr.length; i++) {
				if (arr[i] < numValue) {
					left.push(arr[i]);
				} else {
					right.push(arr[i]);
				}
			}

			return quickSort(left).concat(numValue, quickSort(right));
		},
		getEleH: function($ele) {
			var eleH = [];
			var len = $ele.length;
			for (var i = 0; i < len; i++) {
				var height = $ele.eq(i).offset().top;
				eleH.push(height);
			}
			return eleH;
		},
		getPositions: function($ele) {
			var positions = {};
			var len = $ele.length;
			for (var i = 0; i < len; i++) {
				positions[i] = $ele.eq(i).offset().top;
			}
			return positions;
		},
		getSection: function(winTop) {
			var returnValue;
			var positions = this.getPositions($('.m_block'));
			for (key in positions) {
				if (winTop + 120 > positions[key]) {
					returnValue = key;
				}
			}
			return returnValue;
		},
		scrollChange: function(winTop, $ele) {
			var section = this.getSection(winTop);
			var index = +section + 1;
			$('.u_ani' + index).addClass('a_fadeIn')

		}

	}

	window.myutil = myutil;

})();



//滚动效果
// var throttlescrollChange=myutil.throttle(myutil.scrollChange,200);
// $(window).scroll(function(){
// 	var winTop=$(window).scrollTop();
// 	throttlescrollChange(winTop,$('.m_block'));
// })