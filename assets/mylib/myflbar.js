;
(function($, window, document, underfined) {
	var OnePageNav = function(ele, options) {
		this.ele = ele;
		this.$ele = $(ele);
		this.options = options;
		this.$win = $(window);
		this.sections = {};
		this.didScroll = false;
		this.$doc = $(document);
		this.docHeight = this.$doc.height();
	};
	OnePageNav.prototype = {
		defaults: {
			navItems: ".jj_item a",
			currentClass: 'current',
			easing: 'swing',
			filter: '',
			scrollSpeed: 750,
			scrollThreshold: 0.5,
			begin: false,
			end: false,
			scrollChange: false
		},
		init: function() {
			//配置信息初始化
			this.config = $.extend({}, this.defaults, this.options);
			this.$nav = this.$ele.find(this.config.navItems);
			//导航绑定事件
			this.$nav.on('click.onePageNav', $.proxy(this.handleClick, this));

			//获得位置信息。
			this.getPositions();

			//绑定滚动变化
			this.bindInterval();

			return this;
		},
		triggerNav: function(opacity) {
			this.$ele.stop().animate({
				opacity: opacity
			})
		},
		adjustNav: function(self, $parent) {
			self.$ele.find('.' + self.config.currentClass).removeClass(self.config.currentClass);
			if ($parent) {
				$parent.addClass(self.config.currentClass);
			}

		},
		bindInterval: function() {
			var self = this;
			var docHeight;

			self.$win.on('scroll.onePageNav', function() {
				self.didScroll = true;
			});

			self.t = setInterval(function() {

				docHeight = self.$doc.height();

				if (self.didScroll) {
					self.didScroll = false;
					self.scrollChange();
				}

				if (docHeight !== self.docHeight) {
					self.docHeight = docHeight;
					self.getPositions();
				}
			}, 250);
		},
		getHash: function($link) {
			return $link.attr("href").split('#')[1];
		},
		getPositions: function() {
			var self = this;
			var linkHref;
			var topPos;
			var $target;

			self.$nav.each(function() {
				linkHref = self.getHash($(this));
				$target = $('#' + linkHref);

				if ($target.length) {
					var topPos = $target.offset().top;
					self.sections[linkHref] = Math.round(topPos);
				}
			});
		},
		getSection: function(windowPos) {
			var returnValue = null;
			var windowHeight = Math.round(this.$win.height() * this.config.scrollThreshold);

			for (section in this.sections) {
				if ((windowPos + windowHeight) > this.sections[section]) {
					returnValue = section;
				}
			}
			return returnValue;
		},
		handleClick: function(e) {
			var self = this;
			var $link = $(e.currentTarget);
			var $parent = $link.parent();
			var newLoc = '#' + self.getHash($link);
			if (!$parent.hasClass(self.config.currentClass)) {
				self.adjustNav(self, $parent);
				self.unbindInterval();
				self.scrollTo(newLoc, function() {
					self.bindInterval();
					//结束回调
					if (self.config.end) {
						self.config.end();
					}
				});

			}
			e.preventDefault();
		},
		scrollChange: function() {
			//1.定位；2.更变导航
			var windowTop = this.$win.scrollTop();
			var position = this.getSection(windowTop);
			var $parent;
			if (position !== null) {
				this.triggerNav(1);
				$parent = this.$ele.find('a[href$="#' + position + '"]').parent();
				if (!$parent.hasClass(this.config.currentClass)) {
					this.adjustNav(this, $parent);

				}
			} else {
				this.adjustNav(this);
				this.triggerNav(0);
			}


		},
		scrollTo: function(target, callback) {
			var offset = $(target).offset().top;
			$('html,body').animate({
				scrollTop: offset
			}, this.config.scrollSpeed, this.config.easing, callback);
		},
		unbindInterval: function() {
			clearInterval(this.t);
			this.$win.unbind('scroll.onePageNav');
		}

	};
	$.fn.OnePageNav = function(options) {
		return this.each(function() {
			new OnePageNav(this, options).init();
		});
	};

})(jQuery, window, document);