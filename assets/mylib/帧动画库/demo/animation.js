var STATE_INITIAL=0;
var STATE_START=1;
var STATE_STOP=2;

var TASK_SYNC=0;
var TASK_ASYNC=0;




function next(callback){
	callback&&callback();
}

function Animation() {
	this.taskQueue=[];
	this.state=STATE_INITIAL;
	this.timeline=new timeline();
	this.index=0;
}




Animation.prototype.loadImage = function(imgList) {
	var taskFn=function(next){
		loadImage(imgList.split(" "),next);
	};

	return _add(taskFn,TASK_SYNC);
};
Animation.prototype.changePosition= function(ele,imgUrl,positions) {
	var len=positions.length;
	var taskFn;
	var type;
	var me=this;
	if(len){
		taskFn=function (next,time) {
			ele.style.backgroundImage="url("+imgUrl+")";
			var index=Math.min(time/me.interval|0,len-1);
			var position=positions[index].split(' ');
			ele.style.backgroundPosition=position[0]+'px'+position[1]+'px';
			if(index===len-1){
				next();
			}
		};
		type=TASK_ASYNC;
	}else{
		taskFn=next;
		type=TASK_SYNC;
	}
	return this._add(taskFn,type);
};
Animation.prototype.repeat = function(times) {
	var me=this;
	var taskFn=function () {
		if(typeof times==="undefined"){
			me.index--;
			me._runTask();
			return;
		}
		if(times){
			times--;
			me.index--;
			me._runTask();
		}else{
			var task=me.taskQueue[me.index];
			me._next(task);
		}
	}

	return this._add(taskFn,type);
};
Animation.prototype.repeatForever = function() {
	return this.repeat();
};
Animation.prototype.wait = function(time) {
	if (this.taskQueue && this.taskQueue.length>0) {
		this.taskQueue[this.taskQueue.length-1].wait=time;
	}
};
Animation.prototype.then = function(taskFn) {
	return this._add(taskFn,TASK_SYNC);
};
Animation.prototype.enterframe = function(taskFn) {
	return this._add(taskFn,TASK_ASYNC);
};

Animation.prototype.pause = function() {
	
};
Animation.prototype._add = function(taskFn,type) {
	this.taskQueue.push({
		taskFn:taskFn,
		type:type
	})
};
Animation.prototype.start = function(interval) {
	if(this.state===STATE_START)
		return this
	this.interval=interval;
	this._runTask();
};

Animation.prototype.dispose = function() {
	if(this.state!==STATE_INITIAL){
		this.state=STATE_INITIAL;
		this.taskQueue=null;
		this.timeline.stop();
		this.timeline=null;
	}
	return this;
};
Animation.prototype._runTask = function() {
	var task=this.taskQueue[this.index];

	if(task.type==='TASK_SYNC'){
		_this._syncTask(task);
	}else{
		_this._asyncTask(task);
	}

};

Animation.prototype._syncTask = function(task) {
	var next=function(){
		this._next(task);
	}
	var taskFn=task.taskFn;
	taskFn();
};
Animation.prototype._asyncTask = function(task) {
	
	var enterframe=function (time) {
		var taskFn=task.taskFn;
		var next=function () {
			this.timeline.stop();
			this._next(task);
		}
		taskFn(next,time);

	}

	this.timeline.onenterframe=enterframe;
	this.timeline.start(this.interval);	 
};
Animation.prototype._next = function(task) {
	this.index++;
	task.wait?setTimeout(function(){
		this._runTask();
	},task.wait):this._runTask();

};