var weather_data

function weather() {
    //     weather_data = weather_data.result.realtime = weather_data.result.hourly = weather_data.result.daily = weather_get = ''
    // if (weather_data == undefined || weather_data.server_time * 1000 - new Date().getTime() < -100000) {
    // weather_get = 
    $.ajax({
        url: "https://api.caiyunapp.com/v2.5/" + privacy['weather_id'] + "/weather.json?alert=true",
        dataType: "jsonp", //指定服务器返回的数据类型
        jsonpCallback: "define",
        // async: false,
        type: "GET",
        'content-type': 'application/json',
        success: function (data) {
            weather_data = data
        }
    })
    // }
}

// function weather() {
//     weather_get().then(function(){})
// }

//天气转icon
function skyconIcon(data, width) {
    var skylist = {
        CLEAR_DAY: ['晴', 'weather_0/day', '#0a77d4', '#6da7e6'],
        CLEAR_NIGHT: ['晴', 'weather_0/night', '#04195c', '#3772b4'],
        PARTLY_CLOUDY_DAY: ['多云', 'weather_1/day', '#5b7fb9', '#91a9cd'],
        PARTLY_CLOUDY_NIGHT: ['多云', 'weather_1/night', '#2d3c63', '#486381'],
        CLOUDY: ['阴', 'weather_2/day', '#8fa2c0', '#8d9fb3'],
        CLOUDY_NIGHT: ['阴', 'weather_2/day', '#434d57', '#47505f'],
        LIGHT_RAIN: ['小雨', 'weather_4/day', '#5e6f88', '#7a8a99'],
        MODERATE_RAIN: ['中雨', 'weather_4/day', '#5e6f88', '#7a8a99'],
        HEAVY_RAIN: ['大雨', 'weather_4/day', '#5e6f88', '#7a8a99'],
        STORM_RAIN: ['暴雨', 'weather_7/day', '#5e6f88', '#7a8a99'],
        LIGHT_SNOW: ['小雪', 'weather_13/day', '', ''],
        MODERATE_SNOW: ['中雪', 'weather_13/day', '', ''],
        HEAVY_SNOW: ['大雪', 'weather_13/day', '', ''],
        FOG: ['雾', 'weather_3/day', '', ''],
        HAZE: ['雾霾', 'weather_24/day', '', ''],
        LIGHT_HAZE: ['轻霾', 'weather_0/day', '', ''],
        WIND: ['大风', 'weather_0/day', '', ''],
        DUST: ['浮尘', 'pm_dirt']
    }
    var skycon = String(data)
    var list = [skylist[skycon][0], '<img style="width:' + width + 'px" src="assets/weather/weather/' + skylist[skycon][1] + '.webp" title="' + skylist[skycon][0] + '">', '<img style="width:' + width + 'px" src="assets/weather/weather_small/' + skylist[skycon][1] + '.webp" title="' + skylist[skycon][0] + '">', 'linear-gradient(' + skylist[skycon][2] + ',' + skylist[skycon][3] + ')']
    return list
}


//aqi icon  
function aqi_icon() {
    aqi = weather_data.result.realtime.air_quality.aqi.chn
    if (aqi >= 0 && aqi <= 100) {
        aqi = 'aqi_leaf.png'
    } else if (aqi >= 101 && aqi <= 200) {
        aqi = 'aqi_skull.png'
    } else if (aqi >= 201) {
        aqi = 'aqi_gas_mask.png'
        return aqi
    }
}

var update = new Date()

//主要天气
function main_weather() {
    // var x
    // $.when(weather_get).done(function () {
    x = skyconIcon(weather_data.result.realtime.skycon, 80)[1] + Math.round(weather_data.result.realtime.temperature) + '°';
    // })
    return ['<p id="weather">' + x + '</p>', skyconIcon(weather_data.result.realtime.skycon, 50)[3]]
}

// 其他天气
function other_weather() {
    // $.when(weather_get).done(function () {
    cloudrate = '<img src="assets/weather/cloud.png" style=" opacity:' + weather_data.result.realtime.cloudrate + ';" height="30px"></img>'
    visibility = '能见度 ' + weather_data.result.realtime.visibility + '%'
    apparent_temperature = '体感 ' + Math.round(weather_data.result.realtime.apparent_temperature) + '° ';
    wind = '<img style="width:20px;transform: rotate(' + weather_data.result.realtime.wind.direction + 'deg);" src="assets/weather/wind_d.png">' + weather_data.result.realtime.wind.speed + 'km/h';
    pressure = '气压 ' + Math.round(weather_data.result.realtime.pressure / 100 + 0.5) + 'hPa';
    // })
    return '<div id="otherweather"><span>' + cloudrate + '</span><span>' + visibility + '</span><span>' + apparent_temperature + '</span><span>' + wind + '</span><span>' + pressure + '</span></div>'
}

// 更新时间
// document.getElementById('updatetime').innerHTML = update.getHours() + ':' + update.getMinutes() + '更新';
// aqi
// document.getElementById('airquality').innerHTML = '<span class="weatherli">aqi ' + weather_data.result.realtime.air_quality.description.chn + ' ' + weather_data.result.realtime.air_quality.aqi.chn + '<img style="width:20px" src="assets/weather/' + aqi + '">' + '</span><span class="weatherli">PM2.5 ' + weather_data.result.realtime.air_quality.pm25 + '</span><span class="weatherli">PM10 ' + weather_data.result.realtime.air_quality.pm10 + '</span><span class="weatherli">O<sub>3</sub> ' + weather_data.result.realtime.air_quality.o3 + '</span><span class="weatherli">NO<sub>2</sub> ' + weather_data.result.realtime.air_quality.no2 + '</span><span class="weatherli">SO<sub>2</sub> ' + weather_data.result.realtime.air_quality.so2 + '</span><span class="weatherli">CO ' + weather_data.result.realtime.air_quality.co + '</span>';

// precipitation
function precipitation() {
    // $.when(weather_get).done(function () {
    precipitation_data = '<span class="weatherli">最近降水距离 ' + weather_data.result.realtime.precipitation.nearest.distance + 'km</span><span class="weatherli">最近降水强度 ' + weather_data.result.realtime.precipitation.nearest.intensity + '%</span><span class="weatherli">本地降水强度 ' + weather_data.result.realtime.precipitation.local.intensity + '%</span>';
    // })
    return '<div id="precipitation">' + precipitation_data + '</div>'
}

// 湿度
function humidity() {
    // $.when(weather_get).done(function () {
    h = '<div id="humidity"><div id="humidityshort" style="width:' + weather_data.result.realtime.humidity * 100 + '%' + '"><p class="humidityp">湿度</p></div></div>'
    // })
    return h
}
//日出日落
function sun_rise_set() {
    // $.when(weather_get).done(function () {
    // risesetLong = document.getElementById('sunriseset').offsetWidth
    sunrise = weather_data.result.daily.astro[0].sunrise.time
    sunrise = Number(sunrise.split(':')[0]) * 60 + Number(sunrise.split(':')[1])
    sunset = weather_data.result.daily.astro[0].sunset.time
    sunset = Number(sunset.split(':')[0]) * 60 + Number(sunset.split(':')[1])
    var suntoday = new Date()
    now = Number(suntoday.getHours()) * 60 + Number(suntoday.getMinutes())

    if (sunrise < now && now < sunset) {
        // left = ((now - sunrise) / (sunset - sunrise) * risesetLong - 10) + 'px'
        left = (now - sunrise) / (sunset - sunrise) * 100 + '%'
        width = ''
    } else {
        left = ''
        width = 0
    }
    // })
    return '<div id="sunriseset"><div class="sunline"></div><div id="sun" style="width:' + width + ';left:' + left + '"></div><div><p id="sunrisep">' + weather_data.result.daily.astro[0].sunrise.time + '</p><p id="sunsetp">' + weather_data.result.daily.astro[0].sunset.time + '</p></div></div>'
}


//天气预报
//天气变化转换
function zhuan(f, s) {
    f = skyconcn(f)
    s = skyconcn(s)
    if (f == s) {
        return f
    } else {
        return f + '转' + s
    }
};

function hourly_weather() {
    // $.when(weather_get).done(function () {
    hourlyWeather = ''

    for (var i = 0; i < 20; i++) {
        var hTime = weather_data.result.hourly.temperature[i].datetime.substring(11, 16)
        var hSkycon = skyconIcon(weather_data.result.hourly.skycon[i].value, 20)[2]
        var hTemperature = Math.round(weather_data.result.hourly.temperature[i].value) + '°'

        hourlyWeather = hourlyWeather + '<div class="hweatherli">' + '<div class="weathertime">' + hTime + '</div><div class="hSkycon">' + hSkycon + '</div><div class="hTemperature">' + hTemperature + '</div></div>'
    }
    // })
    return '<div id="hweather">' + hourlyWeather + '</div>'
}

function daily_weather() {
    // $.when(weather_get).done(function () {
    dailyWeather = ''

    for (var i = 0; i < 5; i++) {
        var dTime = Number(weather_data.result.daily.temperature[i].date.substring(5, 7)) + '月' + Number(weather_data.result.daily.temperature[i].date.substring(8, 10)) + '日'
        var dSkycon1 = skyconIcon(weather_data.result.daily.skycon_08h_20h[i].value, 40)[2]
        var dSkycon2 = skyconIcon(weather_data.result.daily.skycon_20h_32h[i].value, 40)[2]
        var dTemperature1 = Math.round(weather_data.result.daily.temperature[i].max) + '°'
        var dTemperature2 = Math.round(weather_data.result.daily.temperature[i].min) + '°'

        dailyWeather += '<div class="dweatherli">' + '<div class="weathertime">' + dTime + '</div><div class="dSkycon1">' + dSkycon1 + '</div><div class="dTemperature1">' + dTemperature1 + '</div><div class="dSkycon2">' + dSkycon2 + '</div><div class="dTemperature2">' + dTemperature2 + '</div></div>'
    }
    // })

    return '<div id="dweather">' + dailyWeather + '</div>'
}

function weather_tips() {
    // $.when(weather_get).done(function () {
    //预警信号
    if (weather_data.result.alert.content[0] == undefined) {
        AABB = ''
    } else {
        AABB = ''
        for (coden in weather_data.result.alert.content) {
            code = weather_data.result.alert.content[coden]
            maincode = code.code
            AA = maincode.slice(0, 2) - 1
            BB = maincode.slice(3) - 1
            codelist = ['台风', '暴雨', '暴雪', '寒潮', '大风', '沙尘暴', '高温', '干旱', '雷电', '冰雹', '霜冻', '大雾', '霾', '道路结冰',
                '森林火灾', '雷雨大风'
            ]
            codelist2 = ['蓝色', '黄色', '橙色', '红色']
            AABB = AABB + codelist[AA] + codelist2[BB] + '预警,'
        }
    }

    description = weather_data.result.hourly.description + '，' + AABB + weather_data.result.forecast_keypoint.replace('加班', '赶作业')
    // })
    return '<div id="description">' + description + '</div>'
}

function clean(){
    weather_data=null
}