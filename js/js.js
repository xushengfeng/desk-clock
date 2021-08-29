if (localStorage.desk_clock == undefined) {
    var privacy = {
        music_id: '',
        music_passwd: '',
        weather_id: ''
    }
    privacy.music_id = prompt('你的网易云音乐邮箱', )
    privacy.music_passwd = md5(prompt('你的网易云音乐密码', ))
    privacy.weather_id = prompt('彩云天气秘钥和地址', 'xxxxx/116.00,39.00')
    localStorage['desk_clock'] = JSON.stringify(privacy)
} else {
    privacy = JSON.parse(localStorage.desk_clock)
}

// widget
var widget = ''

// data
data = [
    [0, 0, 2, 2, ],
    [2, 0, 2, 1],
    [2, 1, 1, 1],
    [0, 2, 2, 2],
    [0, 4, 5, 3],
    [4, 0, 1, 1],
    [3, 1, 2, 1],
    [2, 2, 3, 2]
]


base_width = (document.body.clientWidth - 16) / 5
for (i in data) {
    widget += '<div id="' + i + '" class="widget" style="left:' + (data[i][0] * base_width + 16) + 'px;top:' + (data[i][1] * base_width + 16) + 'px;width:' + (data[i][2] * base_width - 16 - 16) + 'px;height:' + (data[i][3] * base_width - 16 - 16) + 'px"></div>'
}
document.getElementById('app').innerHTML = widget

function draw_widget() {
    base_width = (document.body.clientWidth - 32) / 5
    for (i in data) {
        document.getElementById(i).style.left = (data[i][0] * base_width + 32) + 'px'
        document.getElementById(i).style.top = (data[i][1] * base_width + 32) + 'px'
        document.getElementById(i).style.width = (data[i][2] * base_width - 32 - 32) + 'px'
        document.getElementById(i).style.height = (data[i][3] * base_width - 32 - 32) + 'px'
    }
}
draw_widget()
window.addEventListener('resize', draw_widget)

initialD = ''
initialS = ''
var tt, yy, MM, dd, wd, hh, mm, ss

function reflash() {
    var today = new Date(); //获得当前日期
    tt = today.getTime()
    yy = today.getYear();
    if (yy < 1900) yy = yy + 1900;
    MM = today.getMonth() + 1;
    dd = today.getDate();
    wd = today.getDay();
    hh = today.getHours();
    mm = today.getMinutes();
    ss = today.getSeconds();
    if (hh > 12) hh = hh - 12;
    if (hh < 10) hh = '0' + hh;
    if (mm < 10) mm = '0' + mm;
    if (ss < 10) ss = '0' + ss;

    if (document.getElementById('0').innerHTML == '' || document.getElementById('4').innerHTML == '' || document.getElementById('5').innerHTML == '' || document.getElementById('6').innerHTML == '') { // 不刷新
        document.getElementById('0').innerHTML = clock()
        document.getElementById('4').innerHTML = music()
        user_music_list_load()
        player_load()
        document.getElementById('5').innerHTML = countdown()
        countdown_n()
        document.getElementById('6').innerHTML = tzg()
    }
    if (ss != initialS) { // 秒刷新
        initialS = new Date().getSeconds()
        document.getElementById('1').innerHTML = showTime() + showDay() + showCDD() + playMiniControl()
    }

    if (dd != initialD) { // 天刷新
        initialD = new Date().getDate()
        document.getElementById(2).innerHTML = showCalendar()
        autoResize(document.getElementById('calendar'), 420 + 64)
        mark_day()
    }
    setTimeout(reflash, 100)
}
reflash()

document.getElementById(3).addEventListener('click', function () { // 自动刷新
    weather()
    setTimeout(function () {
        document.getElementById(3).innerHTML = main_weather()[0] + other_weather() + daily_weather()
        document.getElementById(3).style.background = main_weather()[1]
        document.getElementById(7).innerHTML = precipitation() + humidity() + sun_rise_set() + hourly_weather() + weather_tips()
        document.getElementById(7).style.background = main_weather()[1]
        weather_data = ''
    }, 500)
})


function autoResize(element, nativeSize) {
    var update = function () {
        var scale = Math.min(element.parentNode.offsetWidth, element.parentNode.offsetHeight) / nativeSize
        element.style.zoom = scale.toFixed(3)
    }
    update()
}

window.addEventListener('resize', function () {
    autoResize(document.getElementById('calendar'), 420 + 64)
    autoResize(document.getElementById('countdown'), 500 + 64)
})
autoResize(document.getElementById('calendar'), 420 + 64)
autoResize(document.getElementById('countdown'), 500 + 64)