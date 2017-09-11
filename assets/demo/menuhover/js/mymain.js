(function($) {
    $(document).ready(function() {
        /*****************订单管理页面***********************/
        //筛选查看订单时间
        function menuHover(containerStr, listStr, startClass, endClass) {
            var ocontainer = $(containerStr);
            var olist = ocontainer.find(listStr);
            var timer;
            ocontainer.hover(function() {
                clearTimeout(timer);
                olist.show();
                ocontainer.addClass(startClass);
                ocontainer.removeClass(endClass);
            }, function() {
                ocontainer.removeClass(startClass);
                ocontainer.addClass(endClass);
                timer = setTimeout(function() {
                    olist.hide();
                }, 500)
            })
        }
        menuHover('.j_ordertime-cont', '.time-list', 'ordertime-cont_open', 'ordertime-cont_close');
        menuHover('.j_deal-state-cont', '.state-list', 'deal-state-cont_open', 'deal-state-cont_close');
        menuHover('.j_user', '.user-list', 'user_open ', 'user_close');
    })
})(jQuery);