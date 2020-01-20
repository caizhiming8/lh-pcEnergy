// function getYesterdayDate() {
//     var myDate = new Date();
//     var year = myDate.getFullYear();
//     var month = myDate.getMonth()+1;
//     var day = myDate.getDate();
//     var hour = myDate.getHours();
//     var minuts = myDate.getMinutes();
//     var seconds = myDate.getSeconds();
//     if(month < 10) {
//         month = '0' + month;
//     }
//     if(day < 10) {
//         day = "0" + day;
//     }
//     if(hour < 10) {
//         hour = "0" + hour;
//     }
//     if(minuts < 10) {
//         minuts = "0" + minuts;
//     }
//     if(seconds < 10) {
//         seconds = "0" + seconds;
//     }
//     var dateStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minuts + ':' + seconds;
//     return dateStr;
// }


// 时间转换
function timeForMat(count) {
  // 拼接时间
  const time1 = new Date()
  const time2 = new Date()
  if (count === 1) {
    time1.setTime(time1.getTime() - (24 * 60 * 60 * 1000))
  } else {
    if (count >= 0) {
      time1.setTime(time1.getTime())
    } else {
      if (count === -2) {
        time1.setTime(time1.getTime() + (24 * 60 * 60 * 1000) * 2)
      } else {
        time1.setTime(time1.getTime() + (24 * 60 * 60 * 1000))
      }
    }
  }

  const Y1 = time1.getFullYear()
  const M1 = ((time1.getMonth() + 1) > 9 ? (time1.getMonth() + 1) : '0' + (time1.getMonth() + 1))
  const D1 = (time1.getDate() > 9 ? time1.getDate() : '0' + time1.getDate())
  const timer1 = Y1 + '-' + M1 + '-' + D1 + ' ' + '23:59:59'

  time2.setTime(time2.getTime() - (24 * 60 * 60 * 1000 * count))
  const Y2 = time2.getFullYear()
  const M2 = ((time2.getMonth() + 1) > 9 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1))
  const D2 = (time2.getDate() > 9 ? time2.getDate() : '0' + time2.getDate())
  const timer2 = Y2 + '-' + M2 + '-' + D2 + ' ' + '00:00:00'
  return [timer2, timer1]
}

function days(num) {
  const timer = timeForMat(num)
  return timer
}

function thirtyDays() {
  // 获取最近30天
  const timer = timeForMat(30)
  return timer
}

// 获取最近7天
function sevenDays() {
  // 获取最近7天
  const timer = this.timeForMat(7)
  return timer
}

function yesterday() {
  // 校验是不是选择的昨天
  const timer = this.timeForMat(1)
  return timer
}

function today() {
  const timer = this.timeForMat(0)
  return timer
}

function tomorrow() {
  const timer = this.timeForMat(-1)
  return timer
}

function theDayAfterTomorrow() {
  const timer = this.timeForMat(-2)
  return timer
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
