// 删除cookie
function removeCookie(name){
    setCookie(name, "", -1);
}

// 增加cookie, 修改cookie, 删除cookie
function setCookie(name, value, expires){
    var exp = new Date();
    exp.setDate(exp.getDate() + expires);
    var gmtStr = exp.toGMTString();
    document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + gmtStr;
}

// 查询cookie, 根据cookie的name, 查询对应的value值
function getCookie(name){
    var cookieStr = document.cookie;
    var datas = cookieStr.split("; ");
    for(var i = 0; i < datas.length; i++){
        var detail = datas[i].split("=");
        if(detail[0] == name){
            return decodeURIComponent(detail[1]);
        }
    }
    // 如果查不到, 返回空字符串
    return "";
}


function startMove(obj, json, func) {
	clearInterval(obj.timer);
	obj.timer = setInterval(function() {
		var bStop = true;
		for(var attr in json) {
			var iCur = 0;
			if(attr == "opacity") {
				iCur = parseFloat(getStyle(obj, attr)) * 100;
			} else {
				iCur = parseInt(getStyle(obj, attr));
			}
			var speed = (json[attr] - iCur) / 8;
			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
			if(iCur != json[attr]) {
				bStop = false;
			}

			if(attr == "opacity") {
				obj.style.filter = "alpha(opacity=" + (iCur + speed) + ");";
				obj.style.opacity = (iCur + speed) / 100;
			} else {
				obj.style[attr] = iCur + speed + "px";
			}

		}

		if(bStop) {
			clearInterval(obj.timer);
			if(func) {
				func();
			}
		}
	}, 30);
}

function getStyle(element, style) {
	return element.currentStyle ? element.currentStyle[style] : getComputedStyle(element)[style];
}


// 使用说明：startMove(Div, {
//  					width: 300,
// 					height: 300
//                 }, function() {})
