function Ge(x) { return document.getElementById(x); }
function Ce(x) { return document.createElement(x); }
function Ct(x) { return document.createTextNode(x); }
function Uc(x) { return encodeURIComponent(x); }
function Ae(x,y) { x.appendChild(y); return x; }
function OnEvent(x,e,y,u) {
    try {
        x.addEventListener(e,y,u);
    } catch (this_is_ie_oh_shit) {
        x["on"+e] = y;
    }
}
/**
 * 创建 XMLHttpRequest 对象
 */
function createAjax() {
    try {return new XMLHttpRequest()} catch (oh_shit_this_is_IE) {alert("用IE?有追求!")}
    try {return new ActiveXObject("Msxml2.XMLHTTP")} catch (oh_shit_this_is_old_IE) {}
    try {return new ActiveXObject("Microsoft.XMLHTTP")} catch (hey_welcome_to_earth) {}
    return null;
}
/**
 * 通过HTTP协议得阻塞式抓取
 */
function urlFetch(url) {
    var client = createHttpClient();
    client.open("GET", url, false);
    client.send();
    return client.responseText;
}

function Bind1(_this, _method) {
	var _t = _this;
	return function(param1) {
		_method.call(_t, param1);
	}
}

function Gp(p) {
	var x = 0, y = 0;
	/*
	while (p.tagName != "BODY") {
		x += p.offsetLeft - p.scrollLeft;
		y += p.offsetTop - p.scrollTop;
		p = p.offsetParent;
	}*/
	var t = p.getBoundingClientRect();
	return {x : t.left, y : t.top};
}

function Chr(a) {
	return String.fromCharCode(a);
}