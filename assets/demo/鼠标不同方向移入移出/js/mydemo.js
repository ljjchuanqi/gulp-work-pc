MouseEvent=function(element,opts){
	//opts处理
	var $element=$(element);
	//extend方法的使用
	opts=$.extend({},{
			enter:$.noop,
			leave:$.noop
		},opts||{});
	var dirs=['top','left','right','bottom'];
	
	//计算方向
	//元素与坐标的关系
	//dirs与DIR_POS的关系
	//元素（矩形）的坐标；
	var calutate=function(element,e){
		var x1,y1,x4,y4,x0,y0;
		var k;
		var rect=element.getBoundingClientRect();
		if(!rect.width){
			rect.width=rect.right-rect-left;
		}
		if(!rect.height){
			rect.height=rect.bottom-rect.top;
		}
		x1=rect.left;
		y1=-rect.top;

		x4=rect.left+rect.widht;
		y4=-rect.top+rect.height;

		x0 = rect.left + rect.width / 2;
        y0 = -(rect.top + rect.height / 2);
        //矩形不够大，不考虑
        if (Math.abs(x1 - x4) < 0.0001) return 4;
        k=(y1-y4)/(x1-x4);
        var range=[k,-k];

        var x,y;
        x=e.clientX;
        y=-e.clientY;

        var kk;
        kk=(y-y0)/(x-x0);
        if(isFinite(kk)&&range[0]<kk&&kk<range[1]){
        	return x>x0?2:1;
        }else{
        	return y>y0?0:3;
        }

	}


	//事件绑定
	$element.on("mouseenter",function(e){
		var r=calutate(this,e);
		opts.enter($element,dirs[r]);
	}).on("mouseleave",function(this,e){

	})



}