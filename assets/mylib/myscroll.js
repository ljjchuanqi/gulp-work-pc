;
(function ($, winodow, document, undefined) {
    var mScroll = function (options) {
        this.options = options;
        this.animationEleH = [];
        this.$win = $(window);
        this.winH = this.$win.height();
        this.docH = $(document).height();
    };

    mScroll.prototype = {
        defaults: { 
            eleClass: "ani",
            animationClass: "fadeInDown",
            scrollThreshold: "0.6"
        },
        init: function () {
            this.config = $.extend({}, this.defaults, this.options);
            this.$ele = $("." + this.config.eleClass);
            //获得动画元素高度
            this.getAnimationEleH();
            //函数节流
            this.throttleAddAnimationClass = this.throttle(this.addAnimationClass, 200, 1000);
            //滚动事件绑定
            this.$win.scroll($.proxy(this.scrollChange, this));
        },
        getAnimationEleH: function () {
            var len = this.$ele.length;
            this.$ele = $("." + this.config.eleClass);
            for (var i = 0; i < len; i++) {
                var height = this.$ele.eq(i).offset().top;
                this.animationEleH.push(height);
                
            }
        },
        addAnimationClass: function (scrollY) {
            for (var i = 0; i < this.$ele.length; i++) {
                var eleAbsH = this.animationEleH[i] - scrollY;
                if (eleAbsH <= Math.round(this.winH * this.config.scrollThreshold)) {
                    this.$ele.eq(i).addClass(this.config.animationClass);
                }
            }
        },
        scrollChange: function () {
            var scrollY = this.$win.scrollTop();
            if ($(document).height() !== this.docH) {
                this.docH = $(document).height();
                this.getAnimationEleH();
            }
            this.throttleAddAnimationClass(scrollY);
        },
        throttle: function (method, delay, duration) {
            var that = this;
            var timer = null,
                begin = new Date();
            return function () {
                var context = that,
                    args = arguments,
                    current = new Date();
                clearTimeout(timer);
                if (current - begin >= duration) {
                    method.apply(context, args);
                    begin = current;
                } else {
                    timer = setTimeout(function () {
                        method.apply(context, args);
                    }, delay);
                }
            }
        }
    };

    $.fn.mScroll = function (options) {
        return new mScroll(options).init();
    }
})(jQuery, document, window);