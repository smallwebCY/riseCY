/**
 * cookie 相关
 * @type {{prefix: string, set: cookie.set, get: cookie.get, del: cookie.del, name: cookie.name}}
 */
var cookie = {
	prefix: "",
	set: function(name, val, timeout) {
		expires = new Date, expires.setTime(expires.getTime() + 1e3 * timeout), document.cookie = this.name(name) + "=" + escape(val) + "; expires=" + expires.toGMTString() + "; path=/"
	},
	get: function(name) {
		for(cookie_name = this.name(name) + "=", cookie_length = document.cookie.length, cookie_begin = 0; cookie_begin < cookie_length;) {
			if(value_begin = cookie_begin + cookie_name.length, document.cookie.substring(cookie_begin, value_begin) == cookie_name) {
				var valStr = document.cookie.indexOf(";", value_begin);
				return -1 == valStr && (valStr = cookie_length), unescape(document.cookie.substring(value_begin, valStr))
			}
			if(cookie_begin = document.cookie.indexOf(" ", cookie_begin) + 1, 0 == cookie_begin) break
		}
		return null
	},
	del: function(name) {
		new Date;
		document.cookie = this.name(name) + "=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/"
	},
	name: function(name) {
		return this.prefix + name
	}
};
/**
 * 微信锁,防止方法重复提交.
 */
var wx_lock = {
	open: function(fname) {
		if(wx_lock[fname + "_lock"] == "on") {
			return true;
		} else {
			wx_lock[fname + "_lock"] = "on";
			return false;
		}
	},
	close: function(fname) {
		wx_lock[fname + "_lock"] = "";
	}
};
/**
 @description 页面垂直平滑滚动到指定滚动高度
 @ 滚动条类
*/
//无过程滚动
var backToTop = function(rate) {
	var doc = document.body.scrollTop ? document.body : document.documentElement;
	var scrollTop = doc.scrollTop;

	var top = function() {
		scrollTop = scrollTop + (0 - scrollTop) / (rate || 2);

		// 临界判断，终止动画
		if(scrollTop < 1) {
			doc.scrollTop = 0;
			return;
		}
		doc.scrollTop = scrollTop;
		// 动画gogogo!
		requestAnimationFrame(top);
	};
	top();
};
//过程滚动
var scrollSmoothTo = function(position) {
	if(!window.requestAnimationFrame) {
		window.requestAnimationFrame = function(callback, element) {
			return setTimeout(callback, 17);
		};
	}
	// 当前滚动高度
	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	// 滚动step方法
	var step = function() {
		// 距离目标滚动距离
		var distance = position - scrollTop;
		// 目标滚动位置
		scrollTop = scrollTop + distance / 5;
		if(Math.abs(distance) < 1) {
			window.scrollTo(0, position);
		} else {
			window.scrollTo(0, scrollTop);
			requestAnimationFrame(step);
		}
	};
	step();
	if(typeof window.getComputedStyle(document.body).scrollBehavior == 'undefined') {
		// 传统的JS平滑滚动处理代码...
	}
};
//提示信息集 弹窗 tips 
var util = {
	load: function() {
		$(".loading").remove();
		$(".shade").remove();
		var msgHtml = '<div class="loading">' +
			'<img src="images/loading.gif"/>' +
			'</div>' +
			'<div class="shade">' +
			'</div>';
		$(msgHtml).appendTo("body");
	},
	//移除loading
	removeLoad: function() {
		$(".loading").remove();
		$(".shade").remove();
	},
	//提示 tost 消失
	tips: function(content, prompt_url, timeout) {
		$(".indexct_tips").remove();
		var msgHtml = '<div class="indexct_tips">' +
			'<p>' + content + '</p>' +
			'<div class="indexct_tips_overlay"></div>' +
			'</div>';
		$(msgHtml).appendTo("body").fadeIn(timeout || 1000, function() {

			$(".indexct_tips").fadeOut(timeout || 1000, function() {
				if(prompt_url != null && prompt_url != '') {
					window.location.href = prompt_url;
					//										alert()
				} else {
					console.log(null)
					return;
				}
			});

		});
	},
	//确认框
	//var dalert = function(title){
	//  var cb = arguments[1];
	//  var setting2 = {firmText:title};
	//  var defaultsetting2={
	//      firmText:'默认消息1',
	//      btnCtr:'确认'
	//  };
	//  $.extend(defaultsetting2,setting2)
	//  var confirmHtml="<article class='m-mask-c-1'></article>";
	//  confirmHtml+="<div class='confirm-box'>";
	//  confirmHtml+="<div class='u-confirm-p'>"+defaultsetting2.firmText+"</div>";
	//  confirmHtml+="<div><a class='u-confirm-btn' href=' '>"+defaultsetting2.btnCtr+"</ a></div>";
	//  confirmHtml+="</div>";
	//  $("body").append(confirmHtml);
	//  $(".u-confirm-btn").click(function(){
	//      $(".m-mask-c-1").hide();
	//      $(".confirm-box").remove();
	//      if(cb){
	//          cb();
	//      }
	//  });
	//};
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
		var confirmHtml = "<article class='m-mask-c-1'></article>";
		confirmHtml += "<div class='confirm-box'>";
		confirmHtml += "<div class='u-confirm-p'>" + defaultsetting2.firmText + "</div>";
		confirmHtml += "<div><a class='u-confirm-btn' href='javascript:'>" + defaultsetting2.btnCtr + "</ a></div>";
		confirmHtml += "</div>";
		$("body").append(confirmHtml);
		$(".u-confirm-btn").click(function() {
			$(".m-mask-c-1").hide();
			$(".confirm-box").remove();
			if(cb) {
				cb();
			}
		});
	},
	//提示 确认 确定 取消
	confirmTips: function(content,btntxt) {
		var cb = arguments[2];
		var setting2 = {
			cancel: btntxt.cancel,
			confirm: btntxt.confirm
		};
		var defaultsetting = {
			cancel: '取消',
			confirm: '确认'
		};
		$.extend(defaultsetting, setting2)
		$(".confirm_tips").remove();
		var msgHtml = '<div class="confirm_tips">' +
			'<div class="confirm_tips_area">' +
			'<div class="confirm_tips_content">' + content + '</div>' +
			'<div class="confirm_tips_bottom">' +
			'<div class="cancel-button">'+defaultsetting.cancel+'</div>' +
			'<div class="confirm-button">'+defaultsetting.confirm+'</div>' +
			'</div>' +
			'</div>' +
			'</div>';
		$(msgHtml).appendTo("body");
		//      util.tips("ssss")
		$(".cancel-button").click(function() {
			$(".confirm_tips").hide();
			$(".confirm_tips").remove();
		});
		$(".confirm-button").click(function() {
			$(".confirm_tips").hide();
			$(".confirm_tips").remove();
			if(cb) {
				cb();
			}
		});
	},
	//活动弹窗  图片 关闭
	activTips: function(content, imgSrc) {
		$(".activ_tips").remove();
		var msgHtml = '<div class="activ_tips">' +
			'<div class="activ_tips_area">' +
			'<div class="win-pyt-head">' +
			'<img src="'+imgSrc+'">' +
			'<a href="javascript:">'+content+'</a>' +
			'</div>' +
			'<div class="win-pyt-close">' +
			'<a href="javascript:">' +
			'<img src="images/window_closeico.png">' +
			'</a>' +
			'</div>' +
			'</div>' +
			'</div>'

		$(msgHtml).appendTo("body");
		//      util.tips("ssss")

	},
}
// 创定义 集方法 对象 
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
	//判断是否为安卓
	_IsAndroid: function() {
		var ua = navigator.userAgent.toLowerCase();
		if(ua.match(/Android/i) == "android") {
			return true;
		} else {
			return false;
		}
	},
	//验证手机号
	isMobel: function(value) {
		if(/^(1)\d{10}$/g.test(value)) {
			return true;
		} else {
			return false;
		}
	},
	//截取字符串 str：字符串  ，len 需要截取的长度
	cutString: function(str, len) {
		if(str.length > len) {
			str = str.substring(0, len);
			return str;
		} else {
			return str;
		}
	},
	//截取掉最后一个字符
	cutLastOne: function(str) {
		str = str.substring(0, str.length - 1);
		return str;
	},
	//获取url参数
	getQueryString: function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]);
		return null;
	},
	//判断是否有特殊字符
	matchSpecial: function(str) {
		var containSpecial = RegExp(/[(\~)(\!)(\@)(\#)(\$)(\%)(\s)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\,)(\')(\")(\.)(\/)(\<)(\>)(\?)(\【)(\】)(\（)(\）)]/gi);
		return(str.match(containSpecial));
	},
	//判断是否有特殊字符
	containSpecial: function(s) {
		var containSpecial = RegExp(/[(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\,)(\')(\")(\.)(\/)(\<)(\>)(\?)(\【)(\】)(\（)(\）)]+/);
		return(containSpecial.test(s));
	},
	//获取滚动条滚动到底部
	scrollBottom: function() {
		//滚动条在Y轴上的滚动距离
		function getScrollTop() {　　
			var scrollTop = 0,
				bodyScrollTop = 0,
				documentScrollTop = 0;　　
			if(document.body) {　　　　
				bodyScrollTop = document.body.scrollTop;　　
			}　　
			if(document.documentElement) {　　　　
				documentScrollTop = document.documentElement.scrollTop;　　
			}　　
			scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;　　
			return scrollTop;
		}
		//文档的总高度
		function getScrollHeight() {　　
			var scrollHeight = 0,
				bodyScrollHeight = 0,
				documentScrollHeight = 0;　　
			if(document.body) {　　　　
				bodyScrollHeight = document.body.scrollHeight;　　
			}　　
			if(document.documentElement) {　　　　
				documentScrollHeight = document.documentElement.scrollHeight;　　
			}　　
			scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;　　
			return scrollHeight;
		}
		//浏览器视口的高度
		function getWindowHeight() {　　
			var windowHeight = 0;　　
			if(document.compatMode == "CSS1Compat") {　　　　
				windowHeight = document.documentElement.clientHeight;　　
			} else {　　　　
				windowHeight = document.body.clientHeight;　　
			}　　
			return windowHeight;
		}

		if(getScrollTop() + getWindowHeight() == getScrollHeight()) {　　　　
			return true;
		} else {
			return false;
		}
	}
}

// 注册倒计时
function getCode(tel, $this, str, obg) {

	var _tel = tel;
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

		ajax(str, obj, function(res) {
			console.log(res)
			if (res.code == 0) {
				tipOpen(res.msg, 1000)
				$(".telNumber .form-item__error").html("")
				return false;
			}
			
			tipOpen("发送成功", 1000)
		})

	}

}

function ajax(str, param, callback) {
	$.ajax({
		// url: window.location.protocol + "//" + window.location.host + "/" + str,
		url: 'http://cq.sh7road.com/' + str,
		data: param,
		dataType: "json",
		// headers: {
		//     'token': token || '',
		//     'content-type': 'application/json'
		// },
		type: 'get',
		success: function(res) {
			callback(res);
		},
		error: function(res) {
			callback(res);
		}
	})
}
// 及那盤彈出 收起
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
// 判断对象类型
function type(obj) {
  var toString = Object.prototype.toString;
  var map = {
    '[object Boolean]' : 'boolean', 
    '[object Number]'  : 'number', 
    '[object String]'  : 'string', 
    '[object Function]' : 'function', 
    '[object Array]'  : 'array', 
    '[object Date]'   : 'date', 
    '[object RegExp]'  : 'regExp', 
    '[object Undefined]': 'undefined',
    '[object Null]'   : 'null', 
    '[object Object]'  : 'object'
  };
  return map[toString.call(obj)];
}
function countDown(times){
 var timer=null;
 timer=setInterval(function(){
  var day=0,
   hour=0,
   minute=0,
   second=0;//时间默认值
  if(times > 0){
   day = Math.floor(times / (60 * 60 * 24));
   hour = Math.floor(times / (60 * 60)) - (day * 24);
   minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
   second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
  }
  if (day <= 9) day = '0' + day;
  if (hour <= 9) hour = '0' + hour;
  if (minute <= 9) minute = '0' + minute;
  if (second <= 9) second = '0' + second;
  //
  console.log(day+"天:"+hour+"小时："+minute+"分钟："+second+"秒");
  times--;
 },1000);
 if(times<=0){
  clearInterval(timer);
 }
}
// countDown(18240)  帶天 倒計時
//删除数组里的某项  
Array.prototype.indexOf = function(val) {
	for(var i = 0; i < this.length; i++) {
		if(this[i] == val) return i;
	}
	return -1;
};
Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if(index > -1) {
		this.splice(index, 1);
	}
};
//var emp = ['abs','dsf','sdf','fd'];  
//emp.remove('fd');
//console.log(emp)

$(function() {
	window.sysinfo && window.sysinfo.cookie && window.sysinfo.cookie.pre && (cookie.prefix = window.sysinfo.cookie.pre);
})