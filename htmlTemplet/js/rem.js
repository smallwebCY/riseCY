(function (doc, win) {
	var i = 0;
    if (!i) {
        var p = window.navigator.userAgent,
            q = (!!p.match(/android/gi), !!p.match(/iphone/gi)),
            r = q && !!p.match(/OS 9_3/),
            s = window.devicePixelRatio;
        i = q && !r ? s >= 3 && (!i || i >= 3) ? 3 : s >= 2 && (!i || i >= 2) ? 2 : 1 : 1
    }
    doc.documentElement.setAttribute("data-dpr", i);
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function () {
			var clientWidth = docEl.clientWidth;
			if (!clientWidth) return;
			if (clientWidth >= 414) {
				docEl.style.fontSize = '41px';
			} else {
				docEl.style.fontSize = 100 * (clientWidth / 1000) + 'px';
			}
		}; 
	
	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
