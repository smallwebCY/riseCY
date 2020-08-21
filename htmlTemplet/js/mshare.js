$(function() {
	// var token = getCookie('token') || '';
	var mobileReg = /^1[0-9]{10}$/;
	var isOver = false;//再次发送验证码
	var MT_yuyue_info = 'MT_yuyue_token_info';
	var regInfo = getCookie(MT_yuyue_info) ? JSON.parse(getCookie(MT_yuyue_info)) : '';
	var param = getParam()
	// 分享者tel
	$(".fd-id").html(param["mobile"]||"***");
	// 浏览器高度
	// alert($(window).height())
	$(".head-bar").on("click",function(){
		if(regInfo['token']){
		    tipOpen("已加入预约",1000)
		    return;
		}else{
			$(".Layer").addClass("on")
			$(".regist").removeClass("hide")
		}
		
	})
	// 立即打开 有无token判断
	$(".share-get").on("click",function(){
		// 
		if(regInfo){
			// 获取是否展示兑换码状态
			
			// $(".Layer").addClass("on")
			// $(".sharePop").removeClass("hide")
			// rewardsInfo(regInfo['token']);//获取展示兑换码
			if(regInfo['share_id']==param["share_id"]){
				// 自己打开本人的 
				window.location.href = "index.html"
			}else if(regInfo['inviter_share_id']==param["share_id"]){
				$('.Layer').addClass("on");
				$('.invit-pop').removeClass("hide");
				rewardsInfo(regInfo['token']);//获取展示兑换码
			}else{
				// 提示再次打开非分享者的链接
				$(".Layer").addClass("on")
				$(".reopen").removeClass("hide")
			}

		}else{
			
			$(".Layer").addClass("on")
			$(".regist").removeClass("hide")
		}
		
	})
	
	// 关闭弹窗
	$(".close").on("click",function(){
		$(".pop").addClass("hide");
		$(".Layer").removeClass("on");
		$(".pop input").val("");
		$(".pop .err-tip").html("");
	})
	
	// 关闭弹窗
	$(".close").on("click",function(){
		$(".pop").addClass("hide");
		$(".Layer").removeClass("on");
		$(".pop input").val("");
	})
	
	// console.log(window.location.host)
	// 确认按钮跳转活动页
	$(".confirm").on("click",function(){
		$(".pop").addClass("hide");
		$(".Layer").removeClass("on");

		window.location.href = "index.html"
	})
	// 预约 弹窗按钮
	// $(".lgyy_btn").on("click",function(){
	// 	$(".pop").removeClass("hide");
	// 	$(".Layer").addClass("on");
	// })
	
	//预约
    $('.registBtn').click(function(){
        var mobile = $('.phone').val();
		var code = $('.fy-code').val();
		// console.log(param['share_id'])
        if($.trim(mobile) == '' || $.trim(code) == ''){
            tipOpen('手机号或验证码有误！',1000)
        }else{
            var obj = {
                mobile: mobile,
				verify_code: code,
            }
            ajax('activity/appoint/appoint?inviter_share_id='+param['share_id'], obj, 'post', function(res){
                console.log(res)
                if(res['code'] == 0){
                    var obj = {};
                    obj['token'] = res['data']['token'];
                    obj['mobile'] = res['data']['appoint_data']['mobile'];
					obj['share_id'] = res['data']['appoint_data']['share_id'];
					obj['inviter_share_id'] = res['data']['appoint_data']['inviter_share_id'];
                    setCookie(MT_yuyue_info, JSON.stringify(obj));
					regInfo = obj;
					if(regInfo['share_id']==param["share_id"]){
						// 自己打开本人的 
						window.location.href = "index.html"
					}else if(regInfo['inviter_share_id']==param["share_id"]){
						$('.regist').addClass("hide");
						$('.invit-pop').removeClass("hide");
						rewardsInfo(regInfo['token']);//获取展示兑换码
					}else{
						// 提示再次打开非分享者的链接
						// $(".Layer").addClass("on")
						// console.log(1)
						$(".regist").addClass("hide")
						$(".reopen").removeClass("hide")
					}
					// rewardsInfo(regInfo['token']);
					return;
				}
				tipOpen(res['msg'],1000);
            })
        }
    })

	// 倒计时
	resetTime(120,"#minute","#second")
	function resetTime(time,mdom,sdom) {
		var timer = null;
		var t = time;
		var m = 0;
		var s = 0;
		m = Math.floor(t / 60 % 60);
		m < 10 && (m = '0' + m);
		s = Math.floor(t % 60);

		function countDown() {
			s--;
			s < 10 && (s = '0' + s);
			if (s.length >= 3) {
				s = 59;
				m = "0" + (Number(m) - 1);
			}
			if (m.length >= 3) {
				m = '00';
				s = '00';
				clearInterval(timer);
			}
			// console.log(m  + s );
			$(mdom).html(m);
			$(sdom).html(s);
		}
		timer = setInterval(countDown, 1000);
	}
	
	
	// 获取验证码 手机号
	
	$(".getcode").on("click", function() {
		var mobile = $.trim($("#phone").val());
		var str = 'activity/mt.reservation/sendSms';
		if (mobile == '') {
			$(".tel-err").html("请输出正确的手机号码")
			// tipOpen("请填写手机号", 1000)
			return;
		}
		if (!mobileReg.test(mobile)) {
			$(".tel-err").html("请输出正确的手机号码")
			// tipOpen("请输出正确的手机号码", 1000)
			return;
		}
		$(".err-tip").html("")
		var obj = {
			mobile: mobile,
			type: 1
		}
		// 
		getCode($(this),str,obj)
		
	
	})
	// 注册倒计时
	function getCode($this, str, obj) {
	
		var timer = null;
		var s = 60;
		if (!isOver) {
	
			isOver = true;
	
			$this.html(s + 's');
			timer = setInterval(function() {
				// console.log(isOver)
				s--;
				if (s < 1) {
					isOver = false;
					$this.html('重新发送');
					clearInterval(timer);
					timer = null;
					s = 60;
					return;
				}
				$this.html(s + 's')
			}, 1000)
	
			ajax(str, obj, 'post', function(res) {
				// console.log(res)
				tipOpen(res['msg'], 1000)
				// if (res.code == 0) {
				// 	tipOpen("用户已存在", 1000)
				// 	return false;
				// }
				// if (res.code == 1) {
				// 	tipOpen("发送成功", 1000)
				// }
				// if (res.code == null||res.code == undefined) {
				// 	tipOpen("网络错误", 1000)
				// }
				
				
			})
	
		}
	
	}
	function ajax(str, param, method, callback) {
		$.ajax({
			url: 'http://pub.sh7road.com/' + str,
			// url: _URL + str,
			data: param,
			dataType: "json",
			// headers: {
			//     'token': token || '',
			//     'content-type': 'application/json'
			// },
			type: method,
			success: function(res) {
				callback(res);
			},
			error: function(res) {
				callback(res);
			}
		})
	}
	//奖励信息
    function rewardsInfo(token){
		var clipboard = new ClipboardJS('.share-copy');
		var obj ={
			code_type:2,
			token:token,
		}
        ajax('activity/mt.reservation/getCode', obj, 'post', function(res){
            // console.log(res);
            if(res['code'] == 0){
				
				// console.log(res.data.gift_code)
				

				$("#share-invit-code").html(res.data.gift_code||'***');

				$("#awardCode").val($("#share-invit-code").html());

				$("#awardCode").attr("readonly","readonly");
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
				return;
			}
			tipOpen(res['msg'],1000);
        })
    }
	$("input,select,textarea").on("focus", function() {
	
		// alert($(window).height())
		// $("body").height($(window).height())
	
	})
	$("input,select,textarea").blur(function() {
		// $(".navWrap").show();
		// alert($(window).height())
		setTimeout(function() {
			var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
			window.scrollTo(0, Math.max(scrollHeight - 1, 0));
			// console.log(window.scrollY);
		}, 100);
	
	})
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
	
	
	function storageset(key, data) {
		window.localStorage.setItem(key, JSON.stringify(data))
	}
	
	function storageget(key) {
		return JSON.parse(window.localStorage.getItem(key))
	}
	
	function storageremove(key) {
		window.localStorage.removeItem(key)
	}
	
	function storageclearAll() {
		window.localStorage.clear()
	}
	// 存取cooki
	function setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		var expires = "expires=" + d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}
	
	function getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
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
})
	
