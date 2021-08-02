
var mySwiper = new Swiper ('.swiper-container', {
    loop: true,
    lazyLoading: true,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    autoplay: 2500,
    speed:1000,
    autoplayDisableOnInteraction: false
})   
var shareId = '';   
var mobile = '';  
var urlx = location.href.split('?')[0];//截取  官网拉人链接
var urlc = location.href.split("#")[0];//截取  wx分享 参数链接
var urla = encodeURIComponent(urlc);
var clipboard = new ClipboardJS('.copyBtn');
var tools = {
	//是否微信
	isWeixn: function() {
		var ua = navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i) == "micromessenger") {
			return true;
		} else {
			return false;
		}
	},
	//是否qq
	isQq: function() {
		var ua = navigator.userAgent.toLowerCase();
		if(ua.match(/QQ/i) == 'qq' && ua.indexOf('mqqbrowser') < 0) {
			return true;
		} else {
			return false;
		}
	},
	//判断是否为ios
	_IsIOS: function() {
		var ua = navigator.userAgent.toLowerCase();
		if(ua.match(/iPhone\sOS/i) == "iphone os") {
			return true;
		} else {
			return false;
		}
	},
	//判断是否为ipad
	_IsIpad: function() {
		var ua = navigator.userAgent.toLowerCase();
		if(ua.match(/ipad/i) == "ipad") {
			return true;
		} else {
			return false;
		}
	},
			//判断是否为mac os
	_mac: function() {
		var ua = navigator.userAgent.toLowerCase();
		if(ua.match(/mac\sos/i) == "mac os") {
			return true;
		} else {
			return false;
		}
	},
	//判断是否为安卓
	_IsAndroid: function() {
		var ua = navigator.userAgent.toLowerCase();
		if(ua.match(/Android/i) == "android") {
			return true;
		} else {
			return false;
		}
	},
	//判断是否为windows
	_IsWindows: function() {
		var ua = navigator.userAgent.toLowerCase();
		if(ua.indexOf("win32") >= 0||ua.indexOf("wow32") >= 0||ua.indexOf("win64") >= 0||ua.indexOf("wow64") >= 0) {
			return true;
		} else {
			return false;
		}
	},
}
var util = {
	//单个确定框  + 回调
	dalert: function(title) {
		var cb = arguments[1];
		var setting2 = {
			firmText: title
		};
		var defaultsetting2 = {
			firmText: '默认消息1',
			btnCtr: '确认'
		};
		$.extend(defaultsetting2, setting2)
		$(".m-mask-c-1").remove();
		$(".confirm-box").remove();
		var confirmHtml = "<article class='m-mask-c-1'></article>";
		confirmHtml += "<div class='confirm-box'>";
		confirmHtml += "<div class='u-confirm-p'>" + defaultsetting2.firmText + "</div>";
		confirmHtml += "<div><a class='u-confirm-btn' href='javascript:'>" + defaultsetting2.btnCtr + "</ a></div>";
		confirmHtml += "</div>";
		$("body").append(confirmHtml);
		$(".u-confirm-btn").click(function(evt) {
			var _evt = evt||window.event;
			_evt.stopPropagation();
			$(".m-mask-c-1").remove();
			$(".confirm-box").remove();
			if(cb) {
				cb();
			}
		});
	},
}
$(function(){
    var isClick = true;
    var mobileReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    var resCode = 0;
    var param = getParam();
    var akdy_yuyue_info = 'akdy_yuyue_info';
    var regInfo = getCookie(akdy_yuyue_info) ? JSON.parse(getCookie(akdy_yuyue_info)) : '';
	$("body").addClass("show");
	// 是否登录 显示信息
	if(regInfo && regInfo['token']){
	    $('.acount').removeClass('hide');
	    $('.mobile').text(regInfo['mobile']);
	    rewardsInfo(regInfo['token']);
	}
	// 未登录 分享
	share('', '');
	// 立即预约
	
	$(".head-bar").on("click",function(){
		if(regInfo['token']){
		    tipOpen("已加入预约",1000)
		    return;
		}else{
			$(".regist").removeClass("hide")
		}
	})
	// 关闭弹窗
	$(".close").on("click",function(){
		$(".Layer").removeClass("on")
		$(".pop").addClass("hide")
		$(".pop input").val("");
		$(".pop .err-tip").html("");
	})
	
    //获取验证码
    $('.getcode').click(function(){
        var mobile = $.trim($('.phone').val());
        if(mobile == '' || !mobileReg.test(mobile)){
			tipOpen('请填写正确的手机号！',1000);
            return;
        }
        if(isClick && mobile != ''){
            isClick = false;
            countDown('getcode');
            var obj = {
                mobile: mobile,
                type: 1
            }
            //console.log(222)
            ajax('activity/mt.reservation/sendSms', obj, 'post', function(res){
                // console.log(res);
				tipOpen(res['msg'],1000);
            })
        }
    })
	 //预约
	 $('.registBtn').click(function(){
			 var mobile = $('.mobile').val();
			 var code = $('.fy-code').val();
			 if($.trim(mobile) == '' || $.trim(code) == ''){
				 tipOpen('手机号或验证码有误！',1000)
			 }else{
				 var obj = {
					 mobile: mobile,
					 verify_code: code
				 }
				 ajax('index/akda/appoint', obj, 'post', function(res){
					 // console.log(res)
					 tipOpen(res['msg'],1000);
					 if(res['code'] == 0){
						 var obj = {};
						if(res['msg'] == "预约成功"){
							$("#yyNum").text(yynum+1);
						}
						 obj['token'] = res['data']['token'];
						 obj['mobile'] = res['data']['appoint_data']['mobile'];
						 setCookie(akdy_yuyue_info, JSON.stringify(obj));
						 regInfo = obj;
						
						 $('.phonebox').removeClass('hide');
						 $('.phone').text(res['data']['appoint_data']['mobile']);
						 
						$(".yyBtn").addClass('hide')
						$('.yyedbtn').removeClass('hide');
						// $('.pop').removeClass('hide');
						// $('.yySuccess').removeClass('hide');
						
						$(".regist").addClass("hide")
					 }
				 })
			 }
	 })
	 // 下载按钮
	 $(window).on("click",function(evt){
	 	var ua = navigator.userAgent.toLowerCase();
	 	var evt = evt||window.event;
	 	var protocol = location.protocol;
	 	if (ua.indexOf('iphone') > -1) {
	 		util.dalert("下载请联系QQ(烈火小番茄):2077156702")
	 		return ;
	 	}
	 	if(ua.match(/MicroMessenger/i)=="micromessenger"){
	 		if (ua.indexOf('iphone') > -1||ua.indexOf('ipad') > -1||ua.indexOf('mac os x') > -1) {          //苹果
	 			$(".loadTipPop img").attr("src","img/browserIosTip.png");
	 		}
	 		$(".loadTipPop").show();
	 		evt.preventDefault()
	 		return ;
	 	}
	 	
	 	if (ua.indexOf('iphone') > -1) {
	 		return ;
	 	}else if(ua.indexOf('ipad') > -1||ua.indexOf('mac os x') > -1){
	 		location.href = protocol+"//uufenfa.com/c/rOvs0"
	 	} else{
	 		// $(".start").attr("href",protocol+"//plsp.gzlxq.com/bidvq47d/")
	 		location.href = protocol+"//plsp.gzlxq.com/bidvq47d/"
	 	}
	 })
	// 复制预约奖励码
	clipboard.on('success', function(e) {
		// console.log("copysuc");
		tipOpen("兑换码复制成功",1000);
		e.clearSelection();
	});
	
	clipboard.on('error', function(e) {
		// console.log("copyerr");
		tipOpen("长按兑换码复制",1000);
		e.clearSelection();
	});
   
	
	// 检测机型
	function detectOS() {
	    var u = navigator.userAgent;
	    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
	        alert("安卓手机");    //安卓手机
	    } else if (u.indexOf('iPhone') > -1) {          //苹果手机
	        alert("苹果手机");
	    } else if (u.indexOf('Windows Phone') > -1) {           //winphone手机
	        alert("winphone手机");
	    }
	}
	// 检测机型
	function detectOS() {
	    var u = navigator.userAgent.toLowerCase();
		var protocol = location.protocol;
	    if (u.indexOf('iphone') > -1||u.indexOf('ipad') > -1||u.indexOf('mac os x') > -1) {          //苹果
	    } else{
	    }
	}
    // toast 提示
    function tipOpen(tipContent, tipTime) {
    	var tipHtml = "<article class='m-tiphtml-box' style='z-index:999;text-align:center'>";
    	tipHtml += "<div class='tip-box-op0'></div>";
    	tipHtml += "<div class='tip-box-op1'>" + tipContent + "</div>";
    	tipHtml += "</article>";
    	$("body").append(tipHtml);
    	tipTimeOut = setTimeout(function() {
    		tipClose();
    	}, tipTime);
    }
    function tipClose() {
    	if (tipTimeOut) {
    		clearTimeout(null);
    	}
    	$(".m-tiphtml-box").remove();
    }
    function getParam(){
        var obj = {};
        var url = decodeURI(window.location.href);
        if(url.indexOf("?") == -1){
            return {};
        }
        var param = url.slice(url.indexOf("?") + 1);
        // console.log(url.indexOf("?"),param)
        var kv = param.split('&');
        for(var i = 0, len = kv.length; i < len; i++){
            var o = kv[i].split('=');
            obj[o[0]] = o[1];
        }
        return obj;
    }

    function setCookie(cname, cvalue, exdays) {
		var exdays = exdays||365
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
             }
            if (c.indexOf(name)  == 0) {
                return c.substring(name.length, c.length);
             }
        }
        return "";
    }
	function delCookie(cname) {
		new Date;
		document.cookie = cname + "=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/"
	}
	
    function countDown(cls){
        var time = 60;
        $('.' + cls).text(time+'s');
        var timer = setInterval(function(){
            time--;
            if(time < 1){
                $('.' + cls).text('重新发送');
                clearInterval(timer);
                isClick = true;
                return;
            }
            $('.' + cls).text(time+'s');
        }, 1000)
    }
    function ajax(str, param, method, callback){
        $.ajax({
            url: 'http://pub.sh7road.com/' + str,
            // url: _URL + str,
            data: param,
            dataType: "json",
            type: method,
            success: function(res){
                callback(res);
            },
            error: function(res){
                // console.log(res)
            }
        })
    }
    function popShow(cls){
        $('.pop').show();
        $('.'+cls).show().siblings().hide();   
        $('.pop').css({'position': 'fixed'});
    }
	// 飘落
    function falldown(){
        // var d = "<div class='maple'>🍁<div>";
        var domH = $(document).height();
        setInterval(function () {
            var d = "<img class='maple rotate" + Math.ceil(Math.random() * 4) + "' src='" + "img/feather.png'>"
            var f = $(document).width();
            var e = 100 + Math.random() * f; // 花的定位left值
            var o = 0.4 + Math.random(); // 花的透明度
            var fon = 100 + Math.random() * 15; // 花大小
            var l = e - 2 * f * Math.random(); // 花的横向位移
            var k = 30000 + 20000 * Math.random();
            var deg = Math.random() * 360; // 花的方向
            // console.log(e,l)
            $(d).clone().appendTo("body").css({
                left: e + "px",
                top: 0,
                opacity: o,
                transform: "rotate(" + deg + "deg)",
                width: fon,
                zIndex: 50
            }).animate({
                top: $(document).height() - 30,
                left: l + "px",
                // opacity: 1,
            }, k, "linear", function () {
                $(this).remove()
            })
        }, 2000)
    }
    function share(share_id, mobile){
        
        //分享文案
        var shareData = {
            'title': '我真的等了你很久呢！',
            'description': '一份来自异世界的神秘大礼，不来康康嘛(´･ω･`)',
            'Coshow': '',
            'image': 'https://static.sh7img.com/activity/cn/m/img/navbar.png',
            'link': urlx + '?share_id=' + share_id,
        };
        // console.log(shareData);
        $.ajax({
		    url: 'https://lscq.wan.com/wechat/js_sdk/ajaxWx?jsonpcallback=1',
		    data: {url: urla},
		    dataType: "jsonp",
			contentType: "application/json; charset=utf-8",
		    type: 'get',
		    success: function(res){
		        // console.log(res)
				var ua = navigator.userAgent.toLowerCase();
				if(ua.match(/MicroMessenger/i)=="micromessenger") {
				    wx.config({
				      //debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				      // appId: "wxcc2d408a390ddb18",
				      appId: res.appId, // 必填，公众号的唯一标识
				      timestamp: res.timestamp, // 必填，生成签名的时间戳
				      nonceStr: res.wxnonceStr, // 必填，生成签名的随机串
				      signature: res.wsSha1,// 必填，签名
				    	jsApiList: [
				    	  'updateTimelineShareData',//“分享到朋友圈”及“分享到QQ空间”
				    	  'updateAppMessageShareData',//“分享给朋友”及“分享到QQ”
				    	  'onMenuShareTimeline',//分享到朋友圈
				    	  'onMenuShareAppMessage',//分享给朋友
				    	  
				    	] // 必填，需要使用的JS接口列表
				    });
				    
				    wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
				    	
				      wx.updateAppMessageShareData({ 
				        title: shareData.title, // 分享标题
				        desc: shareData.description, // 分享描述
				        link: shareData.link,
				        imgUrl: shareData.image, // 分享图标
				        success: function () {
				          // 设置成功
				    	  console.log("分享成功")
				        }
				      });
				      wx.updateTimelineShareData({
				         title: shareData.title, // 分享标题
				         desc: shareData.description, // 分享描述
				         link: shareData.link,
				         imgUrl: shareData.image, // 分享图标
				          success: function(res) {
				    		  // 设置成功
				    		  console.log("分享成功")
				    	  },
				          cancel: function(res) {},
				          fail: function(res) {}
				      });
				    });
				    wx.error(function(res){
				    	console.log(res)
				      // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
				    });
				} else {
				    setShareInfo({
				        title: shareData.title,
				        summary: shareData.description,
				        pic: shareData.image,
				        url: shareData.link,
				    });
				}
				
				
		    },
		    error: function(res){
		        console.log(res)
		    }
		}) 
    }
 
})