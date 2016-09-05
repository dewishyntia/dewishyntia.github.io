define(function(require,exports,module){
	$ = require('jquery');
	var f = require('const');
	var dot = require('dot');
	
	f.$doc.delegate('.shi-click','click',function(e){
		var c = $(this).attr('shi-click');
		var b = $(this).attr('shi-back');
		if(typeof(c) == "undefined") return true;
		if(c.length>6){
			eval(c);
		}
		if(typeof(b) == "undefined") return true;
		return false;	
	})
	
	//定义模拟json数据
	
	/**
	 * 定义music操作类
	 */
	var MUSIC = {
		is_play: false,
		musicMode: 'list',
		init: function(index) {
			this.setMusicAttr(index);
			$("#divsonglist > ul #m_list_" + index).find('strong').css("color", "#0cc65b");
			
		},
		//加载数据
		loadData : function(func){
			$.getJSON('music/data.json',{},function(r){
				var tempFn = doT.template($('#music_list_tmpl').html());
				var resultText = tempFn(r.data);
				$('.single_list > ul').html(resultText);
				$('#music_list_num').text(r.data.length);
				m_index = r.data[0].id;
				func();
			})
		},
		setMusicAttr: function(index) {
			var node = $("#divsonglist ul").find('#m_list_' + index).eq(0);
			var data = jQuery.parseJSON($(node).find(".data").text());
			$('#audio').attr('src', data.musicURL);
			$('.album_pic img').attr('src', data.avatarURL);
			$('.music_info_main .music_name span').html(data.musicName);
			$('.music_info_main .singer_name').html(data.artist);
			$('.music_info_main .play_date').html(data.musicTime);
		},
		play: function(index, is) {
			if (!index) index = m_index;
			if (!this.is_play) {
				this.setMusicAttr(index);
			}
			if (is) { //点击播放按钮可能是暂停或播放
				if ($("#btnplay").hasClass('play_bt')) { //播放
					this.player('play');
					this.is_play = true; //设置成播放中
				} else { //暂停
					this.player('pause');
				}
			} else { //点击列表直接播放
				this.player('pause');
				document.getElementById("audio").load();
				this.player('play');
				this.is_play = true; //设置成播放中	
			}
		},
		is_muted: function(is) {
			document.getElementById("audio").muted = is;
		},
		player: function(action) {
			if (action == 'play') {
				$("#btnplay").removeClass('play_bt');
				$("#btnplay").addClass('pause_bt');
				document.getElementById("audio").play();
			} else if (action == 'pause') {
				$("#btnplay").removeClass('pause_bt');
				$("#btnplay").addClass('play_bt');
				document.getElementById("audio").pause();
			} else if (action == 'prev') {
				this.randPlayer('prev');
			} else if (action == 'next') {
				this.randPlayer('next');
			}
	
		},
		changeMusicMode: function(mode, obj) {
			this.musicMode = mode;
	
			cla = $('#btnPlayway').attr('class');
			$('#btnPlayway').removeClass(cla);
			$('#btnPlayway').addClass($(obj).attr('class'));
			$('#divselect').hide();
		},
		bufferBar: function() {
			bufferTimer = setInterval(function() {
				var bufferIndex = audio.buffered.length;
				if (bufferIndex > 0 && audio.buffered != undefined) {
					var bufferValue = audio.buffered.end(bufferIndex - 1) / audio.duration * 324;
					$('.buffer').style.width = parseInt(bufferValue) + 'px';
	
					if (Math.abs(audio.duration - audio.buffered.end(bufferIndex - 1)) < 1) {
						$('.buffer').style.width = 324 + 'px';
						clearInterval(bufferTimer);
					};
				};
			},
			1000);
		},
		adjustPorgress: function(dom, e, duration) { //播放进度控制
			var event = window.event || e;
			var w = parseInt($(dom).css('width'));
			var progressX = event.clientX - dom.getBoundingClientRect().left;
			var num = (progressX / w);
			var t = parseInt(duration * num);
	
			document.getElementById("audio").currentTime = t;
			$("#spanplaybar").css('width', num + '%');
			$('#spanprogress_op').css('left', num - 1 + '%');
		},
		randPlayer: function(action) { //播放模式的控制
			if (this.musicMode == 'list' && action == 'prev') {
				if ($("#m_list_" + m_index).prev().length > 0) {
					$("#m_list_" + m_index).prev().trigger('click');
				} else {
					var len = $("#divsonglist > ul > li").length;
					var node = $("#divsonglist > ul > li").eq(len - 1);
					$(node).trigger('click');
				}
				$("#m_list_" + m_index).find('strong').css("color", "#0cc65b");
			} else if (this.musicMode == 'repeat' && action == 'prev') {
				$("#m_list_" + m_index).trigger('click');
				$("#m_list_" + m_index).find('strong').css("color", "#0cc65b");
			} else if (this.musicMode == 'shuffle' && action == 'prev') {
				//随即播放
				var len = $("#divsonglist > ul > li").length;
				var randNum = this.randN(0, len - 1);
				var node = $("#divsonglist > ul > li").eq(randNum);
				$(node).trigger('click');
				$(node).find('strong').css("color", "#0cc65b");
			} else if (this.musicMode == 'list' && action == 'next') {
				if ($("#m_list_" + m_index).next().length > 0) {
					$("#m_list_" + m_index).next().trigger('click');
				} else {
					var node = $("#divsonglist > ul > li").eq(0);
					$(node).trigger('click');
				}
	
				$("#m_list_" + m_index).find('strong').css("color", "#0cc65b");
			} else if (this.musicMode == 'repeat' && action == 'next') {
				$("#m_list_" + m_index).trigger('click');
				$("#m_list_" + m_index).find('strong').css("color", "#0cc65b");
			} else if (this.musicMode == 'shuffle' && action == 'next') {
				//随即播放
				var len = $("#divsonglist > ul > li").length;
				var randNum = this.randN(0, len - 1);
				var node = $("#divsonglist > ul > li").eq(randNum);
				$(node).trigger('click');
				$(node).find('strong').css("color", "#0cc65b");
			} else if (this.musicMode == 'list' && action == 'end') {
	
				if ($("#m_list_" + m_index).next().length > 0) {
					$("#m_list_" + m_index).next().trigger('click');
				} else {
					var node = $("#divsonglist > ul > li").eq(0);
					$(node).trigger('click');
				}
				$("#m_list_" + m_index).find('strong').css("color", "#0cc65b");
			} else if (this.musicMode == 'repeat' && action == 'end') {
				$("#m_list_" + m_index).trigger('click');
				$("#m_list_" + m_index).find('strong').css("color", "#0cc65b");
			} else if (this.musicMode == 'shuffle' && action == 'end') {
				//随即播放
				var len = $("#divsonglist > ul > li").length;
				var randNum = this.randN(0, len - 1);
				var node = $("#divsonglist > ul > li").eq(randNum);
				$(node).trigger('click');
				$(node).find('strong').css("color", "#0cc65b");
			}
		},
		randN: function(s, e) {
			return (((Math.random() * (e - s + 1)) + "").split(".")[0]) * 1 + s;
		},
		adjustVolume: function(dom, e) {
			var event = window.event || e;
			var w = parseInt($(dom).css('width'));
			var progressX = event.clientX - dom.getBoundingClientRect().left;
			var num = (progressX / w);
			document.getElementById("audio").volume = num.toFixed(2);
			//设置声音进度
			$('#spanvolumebar').css('width', num * 100 + '%');
			$('#spanvolumeop').css('left', num * 100 + '%');
		},
		music_like: function(mid, obj) {
			$.getJSON('?a=music&f=musiclike', {
				mid: mid
			},
			function(r) {
				if (r) {
					$(obj).removeClass('btn_like');
					$(obj).addClass('btn_liked');
				} else {
					$(obj).removeClass('btn_liked');
					$(obj).addClass('btn_like');
				}
			})
		},
		music_del: function(id) {
			$.getJSON('?a=music&f=musicdel', {
				id: id
			},
			function(r) {
				$('#m_list_' + id).remove();
			})
		},
		//外界点击添加到播放列表并播放
		addPlay: function(mid) {
			$.ajax({
				url: '?a=music&f=addplay',
				data: {
					mid: mid
				},
				type: 'get',
				dataType: 'json',
				cache: false,
				success: function(r) {
					if (r.status) {
						$('#divsonglist > ul').append(r.data);
					}
					$('#m_list_' + r.msg).trigger('click');
					$("#m_list_" + r.msg).find('strong').css("color", "#0cc65b");
				}
			})
		}
	}
	var m_index;
	//开始处理事件绑定和
	$("#divsonglist > ul").on('mouseover','li',function(e){
		$(this).css("background","#000000");	
		$(this).find('strong').css("color","#ffffff");
		$(this).find('.list_cp').show();
		
	})
	$("#divsonglist > ul").on('mouseout','li',function(e){
		$(this).css("background","#1B1B1B");
		if($(this).attr("mid")!=m_index){
			$(this).find('strong').css("color","#999999");
		}else{
			$(this).find('strong').css("color","#0cc65b");		
		}
		$(this).find('.list_cp').hide();	
	})
	$("#divsonglist > ul").on('click','li',function(e){
		e.stopPropagation();
		m_index = $(this).attr("mid");
		$("#divsonglist > ul > li > strong").css("color","#999999");
		$(this).find('strong').css("color","#FFFFFF");	
		MUSIC.is_play = false;	
		MUSIC.play(m_index,false);
	})
	//喜欢按钮点击
	$("#divsonglist > ul").on('click','li #bt_like',function(e){
		e.stopPropagation();
		var data = $(this).parents('li').find('.data').text();
		var obj = jQuery.parseJSON(data);
		MUSIC.music_like(obj.mid,this);
	})
	//删除按钮点击
	$("#divsonglist > ul").on('click','li .btn_del',function(e){
		e.stopPropagation();
		var data = $(this).parents('li').find('.data').text();
		var obj = jQuery.parseJSON(data);
		MUSIC.music_del(obj.id);
	})
	//分享按钮
	$("#divsonglist > ul").on('click','li .btn_share',function(e){
		e.stopPropagation();
		var data = $(this).parents('li').find('.data').text();
		var obj = jQuery.parseJSON(data);
		loadWindow("index.php?a=book&f=share2&id="+obj.mid,'分享给好友','',400,120);
	})
	//展开收缩播放列表
	$("#spansongnum1,#btnclose").on('click',function(e){
		if($("#divplayframe").css('display')=='none'){
			$("#divplayframe").fadeTo(400, 1);
			setTimeout(function(){
				$("#divplayframe").show();
				},400);

		}else{
			$("#divplayframe").fadeTo(400, 0);
			setTimeout(function(){
				$("#divplayframe").hide();
				},400);
		}
	})
	//弹出选择播放模式
	$("#btnPlayway").on('click',function(e){
		$("#divselect").show();	
	})
	//静音的切换
	$("#spanmute").on('click',function(e){
		if($(this).hasClass('volume_mute')){
			$(this).removeClass('volume_mute');
			$(this).addClass('volume_icon');	
			MUSIC.is_muted(false);
		}else{
			$(this).removeClass('volume_icon');
			$(this).addClass('volume_mute');	
			MUSIC.is_muted(true);
		}
	})
	//播放完成后播放下一首
	document.getElementById("audio").addEventListener('ended',function(){
		MUSIC.randPlayer('end');
	},false);
	//显示播放进度条
	document.getElementById("audio").addEventListener('timeupdate',function(){
		if (!isNaN(audio.duration)) {
			//计算百分百
			var cur = audio.currentTime;
			var zong = audio.duration;
			var num = (cur/zong)*100;
			
			$("#spanplaybar").css('width',num+'%');
			$('#spanprogress_op').css('left',num-1+'%');
		};
	},false);
	//播放进度被改变
	$('.player_bar').on('click',function(e){
		MUSIC.adjustPorgress(this,e,audio.duration);	
	})
	//声音大小控制
	$('#spanvolume').on('click',function(e){
		MUSIC.adjustVolume(this,e);
	})
	//收缩
	$('#btnfold').on('click',function(e){
		//隐藏播放列表
			if($("#divplayframe").css('display')=='none'){
				if($('#divplayer').css('left')=='0px'){
					$('#divplayer').animate({left: '-470px'}, "slow",function(){
						$('#btnfold').css({backgroundPosition:'-46px -10px'});	
					});
				}else{ 
					$('#divplayer').animate({left: '0px'}, "slow",function(){
						$('#btnfold').css({backgroundPosition:'0px -10px'});	
					});
				}	
			}else{
				$("#divplayframe").fadeTo(400, 0);
				setTimeout(function(){
					$("#divplayframe").hide();
					if($('#divplayer').css('left')=='0px'){
						$('#divplayer').animate({left: '-470px'}, "slow",function(){
							$('#btnfold').css({backgroundPosition:'-46px 0px'});
						});
					}else{ 
						$('#divplayer').animate({left: '0px'}, "slow",function(){
							$('#btnfold').css({backgroundPosition:'0px 0px'});	
						});
					}
				},400);
			}
	})
	
	MUSIC.loadData(function(){MUSIC.init(m_index);});
	
	audio.volume = 0.9
	
	module.exports = MUSIC;
		
});