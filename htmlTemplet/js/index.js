
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
var urlx = location.href.split('#')[0];
var urla = encodeURIComponent(urlx);
var clipboard = new ClipboardJS('.copyBtn');
$(function(){
    var isClick = true;
    var mobileReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    var resCode = 0;
    var param = getParam();
    var MT_yuyue_info = 'MT_yuyue_token_info';
    var regInfo = getCookie(MT_yuyue_info) ? JSON.parse(getCookie(MT_yuyue_info)) : '';
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
			$(".Layer").addClass("on")
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
 
	// 复制预约奖励码
	$(".copyBtn1").on("click",function(){
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
	})
   
	// 复制邀请奖励码
	$(".copyBtn2").on("click",function(){
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
	})
	// 复制链接
	$(".copyBtn3").on("click",function(){
		clipboard.on('success', function(e) {
			// console.log("copysuc");
			tipOpen("复制成功",1000);
			e.clearSelection();
		});
		
		clipboard.on('error', function(e) {
			// console.log("copyerr");
			tipOpen("复制成功",1000);
			e.clearSelection();
		});
	})
	
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

    function setCookie(cname, cvalue, exdays = 365) {
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
    
    function share(share_id, mobile){
        
        //分享文案
        var shareData = {
            'title': '我真的等了你很久呢！',
            'description': '一份来自异世界的神秘大礼，不来康康嘛(´･ω･`)',
            'Coshow': '',
            'image': _CDN + 'activity/yuyue/m/img/icon1.png',
            'link': _URL + '/activity/yuyue/m/mshare.html?share_id=' + share_id + '&mobile=' + mobile,
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