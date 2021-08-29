function get(url) {
    $.ajax({
        url: url,
        type: "GET",
        async: false,
        success: function (data) {
            window.data = data;
        }
    });
    return data;
}

alarmData = document.getElementById('notes').value.split('------')[0]
eval(alarmData)

function alarm() {
    var date = new Date();
    var time = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
    var day = date.getDay();
    var audio = document.getElementById("alarmM");

    for (alarmn in alarmlist) {
        delta = time - (alarmlist[alarmn][1] * 3600 + alarmlist[alarmn][2] * 60)
        if (alarmlist[alarmn][0] && delta > 0 && delta < 10 && alarmlist[alarmn][3].indexOf(day) != -1 && audio.paused) {
            audio.currentTime = 0
            audio.play()
            document.getElementById('alarmbg').style.display = ''
            setTimeout(stopAlarm, 1800000) //30分钟自动关
        }
    }

    setTimeout(alarm, 100);
}
alarm()

function stopAlarm() {
    var audio = document.getElementById("alarmM");
    audio.pause()
    audio.currentTime = 0
    document.getElementById('alarmbg').style.display = 'none'
}