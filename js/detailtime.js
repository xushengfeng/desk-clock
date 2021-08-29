function showTime() { //数字时间
    return '<p id="time" class="time">' + hh + ':' + mm + ':' + ss + '</p>';
}


function showDay() { //日期
    yy = Number(yy)
    MM = Number(MM)
    dd = Number(dd)
    var d = LunarCalendar.solarToLunar(yy, MM, dd);

    function festival(d) {
        if (d.solarFestival == undefined) {
            var solarFestival = ''
        } else {
            var solarFestival = d.solarFestival
        }
        if (d.lunarFestival == undefined) {
            var lunarFestival = ''
        } else {
            var lunarFestival = d.lunarFestival
        }
        if (d.term == undefined) {
            var term = ''
        } else {
            var term = '今日' + d.term + '</br>'
        }
        return '<span class="festival">' + term + solarFestival + ' ' + lunarFestival + '</span>'
    }

    if (dd < 10) dd = '0' + dd;
    if (MM < 10) MM = '0' + MM;

    var wdList = ['日', '一', '二', '三', '四', '五', '六'];
    var wdt = wdList[wd];

    return '<p id="day" class="day">' + yy + '.' + MM + '.' + dd + '星期' + wdt + '</br>农历' + d.lunarMonthName + d
        .lunarDayName + '</br>' + d.GanZhiYear + ' ' + d.GanZhiMonth + ' ' + d.GanZhiDay + '' + '</br>' + festival(d)
}


function showCalendar() { //日历
    function rmrb(yy, MM, dd) { //人民日报日期格式
        if (MM < 10) {
            MM = '0' + MM
        }
        if (dd < 10) {
            dd = '0' + dd
        }
        return yy + '' + MM + '' + dd
    }

    calendarDoc = '<div class="cDiv"><p class="week">日</p></div><div class="cDiv"><p class="week">一</p></div><div class="cDiv"><p class="week">二</p></div><div class="cDiv"><p class="week">三</p></div><div class="cDiv"><p class="week">四</p></div><div class="cDiv"><p class="week">五</p></div><div class="cDiv"><p class="week">六</p></div>'
    calendar = LunarCalendar.solarCalendar(yy, MM, true).monthData
    for (ndd in calendar) {
        if (calendar[ndd].month == MM) { // 本月
            // if (calendar[ndd].day == dd) { // 本日
            // calendarDoc = calendarDoc + '<div class="cDiv" style="background-color:#2a97ff;border-radius:20px"><a href="file:///home/pi/rmrb/' + rmrb(yy, MM, calendar[ndd].day) + '.pdf" target="view_window"><p class="DtD">' + calendar[ndd].day + '</p></a></div>'
            calendarDoc = calendarDoc + '<div class="cDiv" id="d' + calendar[ndd].year + '-' + calendar[ndd].month + '-' + calendar[ndd].day + '"><p class="Dt">' + calendar[ndd].day + '</p></div></a>'
            // } else {
            // calendarDoc = calendarDoc + '<div class="cDiv"><a href="file:///home/pi/rmrb/' + rmrb(yy, MM, calendar[ndd].day) + '.pdf" target="view_window"><p class="Dt">' + calendar[ndd].day + '</p></a></div>'
            // }
        } else { // 不是本月
            calendarDoc = calendarDoc + '<div class="cDiv" id="d' + calendar[ndd].year + '-' + calendar[ndd].month + '-' + calendar[ndd].day + '"><p class="NDt">' + calendar[ndd].day + '</p></div>'
        }
    }
    calendar = null
    return '<div class="calendar" id="calendar">' + calendarDoc + '</div>'
}


function showCDD() { //倒数日
    function fInShowCDD(now, text, mdd) {
        var endDate = new Date(mdd); //设置截止时间
        var end = endDate.getTime();
        var leftTime = end - now; //时间差
        var d, h, m, s, ms;
        if (leftTime >= 0) {
            d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
            h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
            m = Math.floor(leftTime / 1000 / 60 % 60) + 1;
            s = Math.floor(leftTime / 1000 % 60);
            ms = Math.floor(leftTime % 1000);
            if (ms < 100) {
                ms = "0" + ms;
            }
            if (s < 10) {
                s = "0" + s;
            }
            if (m < 10) {
                m = "0" + m;
            }
            if (m == 60) {
                m = '60'
            }
        }
        if (d != undefined) {
            return '距离' + text + '：' + d + '</br>'
        } else {
            return ''
        }

    }

    countt = ''
    for (i in markdd) {
        if (markdd[i][0] != undefined) {
            countt += fInShowCDD(tt, markdd[i][0], markdd[i][1])
        }
    }
    return '<p id="count" class="count">' + countt + '</p>'
}

markdd = [
    ['高考', '2023-6-7'],
    ['开学', '2021-8-31']
]

function mdd(mdd) {
    var mdd = mdd.split('-')
    return Number(mdd[0]) + '-' + Number(mdd[1]) + '-' + Number(mdd[2])
}

function mark_day() {
    document.getElementById('d' + Number(yy) + '-' + Number(MM) + '-' + Number(dd)).style.backgroundColor = '#2a97ff'
    document.getElementById('d' + Number(yy) + '-' + Number(MM) + '-' + Number(dd)).style.borderRadius = '20px'
    document.getElementById('d' + Number(yy) + '-' + Number(MM) + '-' + Number(dd)).firstElementChild.style.color = '#fff'
    for (i in markdd) { // 标记日
        if (document.getElementById('d' + mdd(markdd[i][1])) != null) {
            // document.getElementById('d' + mdd(markdd[i][1])).style.height = '52px'
            // document.getElementById('d' + mdd(markdd[i][1])).style.width = '52px'
            // document.getElementById('d' + mdd(markdd[i][1])).style.border = '4px solid #2a97ff'
            document.getElementById('d' + mdd(markdd[i][1])).style.boxShadow = '#2a97ff 0 0 0 4px'
            document.getElementById('d' + mdd(markdd[i][1])).style.borderRadius = '30px'
        }
    }
}