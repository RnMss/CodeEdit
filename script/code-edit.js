/**
 *  Need to include "common.js"
 *  Need to use "code-edit.css"
 **/

function CodeEdit() {

	var divs = { 
		main: Ce("div"),
		frame: Ce("div"),
		viewport: Ce("div"),
		scroll: Ce("div"),
		caret: Ce("div"),
		lines: []
	};
	this.divs = divs;
	divs.main.className = "CodeEdit-Bounding";
	divs.frame.className = "CodeEdit-Frame";
	divs.viewport.className = "CodeEdit-Sizer CodeEdit-Viewport";
	divs.scroll.className = "CodeEdit-Scroll";
	divs.caret.className = "CodeEdit-CaretV";
	Ae(divs.main, divs.frame);
	Ae(divs.frame, divs.viewport);
	Ae(divs.viewport, divs.scroll);
	Ae(divs.scroll, divs.caret);

	this.char = {width:0, height:0};
	this.caret = {x:0, y:0};
	
}

CodeEdit.prototype.getMain = function(x) {
	return this.divs.main;
}

CodeEdit.prototype.init = function() {
	var firstLine = Ce("div");
	var divs = this.divs;

	{
		this._makeLine(firstLine, 0);
	} {
		var firstChar = Ce("span");	

		firstChar.innerText = "X";
		Ae(firstLine, firstChar);
		
		this.char.width = firstChar.offsetWidth;
		this.char.height= firstLine.offsetHeight;
		
		firstLine.removeChild(firstChar);
		delete firstChar;
	} {
		firstLine.innerText = "Hello world. This should be empty after release.";
	} {
		divs.viewport.tabIndex = -1;
		OnEvent(divs.viewport, "blur" , Bind1(this, this._onBlur));
		OnEvent(divs.viewport, "focus", Bind1(this, this._onFocus));
		//OnEvent(divs.scroll, "mousedown", Bind1(this, this._onMouseDown));
		OnEvent(divs.viewport, "keydown", Bind1(this, this._onKeyDown));
		OnEvent(divs.viewport, "keypress", Bind1(this, this._onKeyPress));		
	} {
		divs.caret.style.height = this.char.height + "px";
		this._moveCaret(4, 0);
	}
	
}

function genString(s, t) {
	var r = "";
	for (; t>0; --t)
		r += s;
	return r;
}
//_aString = genString(" ", 1000);
CodeEdit.prototype._moveCaret = function(x, y) {
	var s = this.divs.caret.style;
	var l = this.divs.lines;
	if (y >= l.length)
		y = l.length - 1;
	if (x > l[y].innerText.length)
		x = l[y].innerText.length;
	this.caret.x = x; this.caret.y = y;
	
	cy = this.divs.lines[y].offsetTop;
	cx = x * this.char.width;
	s.top = cy + "px";
	s.left = cx + "px";
	if (cx > this.divs.viewport.offsetWidth) {
		this.divs.scroll.scrollLeft = cx+2;
	}
}

CodeEdit.prototype._makeLine = function (eDiv, lineNo) {
	eDiv.className = "CodeEdit-L";
	var _this = this;
	OnEvent(eDiv, "mouseover", function() {
		this.classList.add("CodeEdit-LHover");
	});
	OnEvent(eDiv, "mouseout", function() {
		this.classList.remove("CodeEdit-LHover");
	});
	OnEvent(eDiv, "mousedown", function (e) {
		return _this._myMouseDown(e, this, lineNo);
	})

	var ls = this.divs.lines;
	if (lineNo >= ls.length) {
		this.divs.scroll.appendChild(eDiv);
	} else {
		this.divs.scroll.insertBefore(eDiv, ls[lineNo]);
	}
	
	ls.splice(lineNo, 0, eDiv);
}

CodeEdit.prototype._onBlur = function (event) {
	this.divs.caret.style.display="none";
}

CodeEdit.prototype._onFocus = function (event) {
	this.divs.caret.style.display="block";
}

CodeEdit.prototype._myMouseDown = function (e, t) {
	var c = Gp(t);
	var x = event.clientX - c.x;
	var y = event.clientY - c.y;
	var ls= this.divs.lines;
	var lineNo = 0;
	for (var i in ls) {
		if (t === ls[i]) {
			lineNo = parseInt(i);
			break;
		}
	}
	this._moveCaret(Math.round(x / this.char.width), lineNo);
	return false;
}

CodeEdit.prototype._onKeyPress = function (e) {
	var c = this.caret;
	var ls= this.divs.lines; 
	var l = ls[c.y];
	var s = l.innerText;
	if (e.keyCode >= 32 || e.keyCode == 9) {
		l.innerText = s.slice(0, c.x) + Chr(e.keyCode) + s.slice(c.x);
		this._moveCaret(c.x+1, c.y);
	} else if (e.keyCode == 13) {
		l.innerText = s.slice(0, c.x);
		var l2 = Ce("div");
		l2.innerText = s.slice(c.x);
		this._makeLine(l2, c.y+1);
		this._moveCaret(0, c.y+1);
		l2.newline = l.newline;
		l.newline = true;
	}
	return true;
}

CodeEdit.prototype._onKeyDown = function (e) {
	var c = this.caret;
	var ls= this.divs.lines;
	var l = ls[c.y];
	var s = l.innerText;
	var doPrevent = true;
	switch (e.keyCode) {
		case 8: // Backspace
			if (c.x > 0) {
				l.innerText = s.slice(0, c.x-1) + s.slice(c.x);
				this._moveCaret(c.x - 1, c.y);
			} else if (c.y > 0) {
				l0 = ls[c.y - 1];
				s0 = l0.innerText;
				ls.splice(c.y, 1);
				this.divs.scroll.removeChild(l);
				this._moveCaret(s0.length, c.y - 1);
				l0.innerText = s0 + l.innerText;
				l0.newline = l.newline;
			}
		break;
		case 37: // Left
			if (c.x > 0) {
				this._moveCaret(c.x - 1, c.y)
			} else if (c.y > 0) {
				this._moveCaret(65536, c.y - 1);
			}
		break;
		case 38: // Up
			if (c.y > 0) {
				this._moveCaret(c.x, c.y - 1);
			}
		break;
		case 39: // Right
			if (c.x < s.length) {
				this._moveCaret(c.x + 1, c.y);
			} else if (c.y < ls.length - 1) {
				this._moveCaret(0, c.y + 1);
			}
		break;
		case 40: // Down
			if (c.y < ls.length - 1) {
				this._moveCaret(c.x, c.y + 1);
			}
		break;
		default: 
			doPrevent = false;
		break;
	}
	
	if (doPrevent) e.preventDefault();

	return true;
}

CodeEdit.prototype.getLines = function () {
	var ls = this.divs.lines;
	var res = new Array(ls.length);
	for (var i in ls) {
		res[i] = ls[i].innerText;
	}
	return res;
}

CodeEdit.prototype.getText = function () {
	return this.getLines().join("\n");
}
