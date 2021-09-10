ip = 'localhost'

function get(url) {
    xdata = ''
    $.ajax({
        url: url,
        type: "GET",
        async: false,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: (data) => {
            xdata = data;
        },
        error: () => {
            xdata = null
        }
    });
    return xdata;
};

function post(url, cookie) {
    x = ''
    $.ajax({
        url: url,
        type: "POST",
        headers: {
            "content-type": "application/x-www-form-urlencoded",
        },
        data: {
            "cookie": cookie
        },
        async: false,
        success: (data) => {
            x = data;
        },
        error: () => {
            x = null
        }
    });
    return x
};


cookie = ''

// 歌单
function user_music_list_load() {
    //cookie和用户信息
    user_login = get('http://localhost:3000/login?email=' + privacy['music_id'] + '&md5_password=' + privacy['music_passwd'])
    if (user_login != null) cookie = user_login.cookie
    if (user_login != null) {
        var list = get('http://' + ip + ':3000/user/playlist?uid=' + user_login.account.id)
        var MainList = ''
        for (listn in list.playlist) {
            MainList = MainList + '<a class="listWords" onclick="showMusicList(' + list.playlist[listn].id + ')">' +
                list.playlist[listn].name + '</a></br>'
        }
        document.getElementById("list").innerHTML = MainList;
        list = null
    }

}


// 具体歌单
function showMusicList(id) {
    var musicListId = get('http://' + ip + ':3000/playlist/detail?id=' + id + '&cookie=' + cookie).playlist.trackIds
    var Ids = ''
    for (Idsn in musicListId) {
        var Ids = Ids + ',' + musicListId[Idsn].id
    }
    var Ids = Ids.substring(1)
    nameList = get('http://' + ip + ':3000/song/detail?ids=' + Ids).songs
    MusicList = new Array()
    for (idn in nameList) {
        MusicList[idn] = nameList[idn].id
    }

    var nameListWord = ''
    for (var namen in nameList) {
        var name = nameList[namen].name;
        var alia = (nameList[namen].alia[0] != undefined) ? nameList[namen].alia[0] : ''
        var tns = (nameList[namen].tns != undefined) ? nameList[namen].tns[0] : ''

        if (alia == '' && tns == '') {
            var name = name;
        } else {
            if (alia == tns || tns == '') {
                var name = name + '<span class="musicFrom">(' + alia + ')</span>';
            } else if (alia == '') {
                var name = name + '<span class="musicFrom">(' + tns + ')</span>';
            } else {
                var name = name + '<span class="musicFrom">(' + tns + '(' + alia + '))</span>';
            }
        }

        var singer = ''
        for (singern in nameList[namen].ar) {
            var singer = singer + '/' + nameList[namen].ar[singern].name
        }
        var singer = '<div class="singer">' + singer.substring(1) + '-' + nameList[namen].al.name + '</div>'

        // 重点
        nameListWord = nameListWord + '<a onclick="play(' + nameList[namen].id + ')">' +
            '<div class="nameListWord" id="mid' + nameList[namen].id + '"><p class="nameListWordP">' + name + '</p>' + singer + '</div></a></br>'
    }
    document.getElementById("musicList").innerHTML = nameListWord
}


// 播放器
function player_load() {
    music_audio = document.getElementById("music")
    music_audio.volume = 100 / 600
    // 403处理
    music_audio.addEventListener('error', () => {
        play(playId)
    })
    // 进度条
    music_audio.addEventListener('timeupdate', playTime)
    // 播放键
    music_audio.addEventListener('pause', () => {
        document.getElementById("stopOrStart").innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="" height="" viewBox="0 0 52.917 52.917"><path d="M46.302 26.458L6.615 52.917V0z" fill="" stroke-width="0"/></svg>'
    })
    music_audio.addEventListener('play', () => {
        document.getElementById("stopOrStart").innerHTML = '<svg width="" height="" viewBox="0 0 52.917 52.917" xmlns="http://www.w3.org/2000/svg"><g fill=""><rect width="10.583" height="52.917" x="10.583" ry="5.292" stroke-width="0"/><rect width="10.583" height="52.917" x="31.75" ry="5.292" stroke-width="0"/></g></svg>'
    })

    // 结束后切歌(根据模式)
    model = "l" //l:loop,r:randomly,o:orderly
    document.getElementById("music").onended = () => {
        // 循环
        if (model == 'l') {
            // document.getElementById("music").loop = 'loop'
            play(playId)
            // music_audio.play()
        }
        // 顺序(上往下)
        if (model == 'o') {
            nextMusic()
        }
        // 随机
        if (model == 'r') {
            nextMusic()
        }
    }

}
playId = ''
lrc = ''
tlrc = ''
timeline = ''

function getUrl(id) {
    var url = post('http://' + ip + ':3000/song/url?id=' + id, cookie) //@@@@@#########################
    if (url.data[0].url == undefined) {
        var url = ''
    } else {
        var url = url.data[0].url
    }
    return url
}

function play(id) {
    music_tmp_src = getUrl(id)
    play_main(id, music_tmp_src)
    if (music_tmp_src == '') {
        nextMusic()
    }
    play_color()
    play_lyric()
}

function play_main(id, src) {
    music_audio.src = src
    music_audio.play()
    playId = id
    var anameList = post('http://' + ip + ':3000/song/detail?ids=' + playId, cookie).songs
    // 封面
    var img = anameList[0].al.picUrl + '?param=100y100'
    document.getElementById('fengmian').src = img
    // 歌名和歌手
    var name = anameList[0].name
    var singer = ''
    for (singern in anameList[0].ar) {
        var singer = singer + '/' + anameList[0].ar[singern].name
    }
    var singer = singer.substring(1)
    document.getElementById("playWords").innerHTML = name + '-' + singer
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: name,
            artist: singer,
            album: anameList[0].al.name,
            artwork: [{
                src: img,
                sizes: '100x100',
                type: 'image/png'
            }, ]
        });

        navigator.mediaSession.setActionHandler('previoustrack', lastMusic);
        navigator.mediaSession.setActionHandler('nexttrack', nextMusic);
    }
}
// 主题色
function play_color() {
    var img = document.querySelector('#fengmian')
    img.onload = () => {
        img.crossOrigin = '';
        var vibrant = new Vibrant(img),
            swatches = vibrant.swatches()
        var longColor = 'rgb(' + swatches.Muted.rgb[0] + ',' + swatches.Muted.rgb[1] + ',' + swatches.Muted.rgb[2] + ')'
        document.documentElement.style.setProperty('--main-color', longColor)
    }
}
// 歌词
function play_lyric() {
    var lyric = post('http://' + ip + ':3000/lyric?id=' + playId, cookie)
    if (lyric.lrc != undefined) {
        lrc = lyric.lrc.lyric
        timeline = cTimeline(lrc)
        lrc = lyric2list(lrc)
        if (lyric.tlyric.lyric != null) {
            tlrc = lyric.tlyric.lyric
            tlrc = lyric2list(tlrc)
            // showlyric(timeline)
        } else {
            tlrc = ''
        }
    } else {
        lrc = {
            t0: '',
            't0.01': '纯音乐,请欣赏',
            tInfinity: ''
        }
        timeline = [0, 0.01, Infinity]
        tlrc = {
            t0: '',
            't0.01': '',
            tInfinity: ''
        }
    }
    showlyric()
}


// 歌单顺序查id
function numToId(num) {
    var id = MusicList[num]
    return id
}

// '秒'转'分:秒'
function sToM(s) {
    var s = Math.round(s)
    if (s < 60) {
        if (s < 10) {
            return '00:0' + s
        } else {
            return '00:' + s
        }
    } else {
        var m = parseInt(s / 60)
        if (m < 10) {
            var m = '0' + m
        }
        var s = s % 60
        if (s < 10) {
            var s = '0' + s
        }
        return m + ':' + s
    }
}

// 播放器文字进度条
function playTime() {
    document.getElementById("range").max = music_audio.duration
    document.getElementById("range").value = music_audio.currentTime
    document.getElementById("range").style.backgroundSize = music_audio.currentTime * 100 / music_audio.duration + '% 100%'
    document.getElementById("playTime").innerHTML = sToM(music_audio.currentTime)
    document.getElementById("playAllTime").innerHTML = sToM(music_audio.duration)

    // setTimeout(playTime, 1000)
}
// playTime()


// 进度条控制
function playTimeLong() {
    music_audio.currentTime = document.getElementById("range").value
    music_audio.play()
}

// 音量
function volume() {
    music_audio.volume = document.getElementById("volume").value / 600
    document.getElementById("volume").style.backgroundSize = document.getElementById("volume").value * 100 / document.getElementById("volume").max + '% 100%'
}



// 播放器按钮

// 第一按钮,切歌模式
model = 'l' //l:loop,r:randomly,o:orderly

function playModel() {
    var l = '<svg width="" height="" viewBox="0 0 52.917 52.917" xmlns="http://www.w3.org/2000/svg"><g stroke=""><rect width="47.376" height="31.501" x="2.77" y="10.708" ry="15.75" rx="15.75" fill="none" stroke-width="5.541"/><rect width="5.182" height="18.411" x="23.867" y="17.253" ry="2.591" fill="" stroke-width="0"/><rect width="7.851" height="5.205" x="21.198" y="17.253" ry="2.603" fill="" stroke-width="0"/></g></svg>'
    var o = '<svg xmlns="http://www.w3.org/2000/svg" width="" height="" viewBox="0 0 52.917 52.917"><rect width="47.376" height="31.501" x="2.77" y="10.708" ry="15.75" rx="15.75" fill="none" stroke="" stroke-width="5.541"/></svg>'
    var r = '<svg width="" height="" viewBox="0 0 52.917 52.917" xmlns="http://www.w3.org/2000/svg"><g fill="" stroke="" stroke-width="7.938" stroke-linecap="round"><path d="M3.969 13.23c22.59 0 22.702 26.879 44.979 26.457M3.969 39.688c22.514 0 22.314-26.459 44.979-26.459"/></g></svg>'
    var modelList = {
        'l': 'o',
        'o': 'r',
        'r': 'l'
    }
    model = modelList[model]
    document.getElementById("playModel").innerHTML = eval(model)
}

// 第二按钮,上一首<
function lastMusic() {
    if (model == 'r') {
        var listn = Math.floor(Math.random() * (MusicList.length + 1))
        play(MusicList[listn])
    } else {
        for (var idn in MusicList) {
            if (playId == MusicList[idn]) {
                idnn = Number(idn) - 1
                if (idnn == -1) {
                    idnn = MusicList.length
                }
                play(MusicList[idnn])
                break;
            }
        }
    }

}

// 第三按钮,暂停播放 ||
function stopOrStart() {
    if (music_audio.paused != true) {
        music_audio.pause()
        // document.getElementById("stopOrStart").style.backgroundImage = 'url(assets/musicicon/p.svg)'
    } else {
        music_audio.play()
        // document.getElementById("stopOrStart").style.backgroundImage = 'url(assets/musicicon/s.svg)'
    }
}

// 第四按钮,下一首>
function nextMusic() {
    if (model == 'r') {
        var listn = Math.floor(Math.random() * (MusicList.length + 1))
        play(MusicList[listn])
    } else {
        for (var idn in MusicList) {
            if (playId == MusicList[idn]) {
                idnn = Number(idn) + 1
                if (idnn > MusicList.length) {
                    idnn = 0
                }
                play(MusicList[idnn])
                break;
            }
        }
    }

}

// 第五按钮，展示歌词
function playList() {
    if (document.getElementById("lyric").style.display == "none") {
        document.getElementById("lyric").style.display = ""
        document.getElementById("list").style.display = "none"
        document.getElementById("musicList").style.display = "none"
    } else {
        document.getElementById("lyric").style.display = "none"
        document.getElementById("list").style.display = ""
        document.getElementById("musicList").style.display = ""
    }
}

// 第六按钮，展示翻译
disOrAppearValue = 'true'

function disOrAppear() {
    var tStyle = $('.lyricT')
    if (disOrAppearValue == 'true') {
        disOrAppearValue = 'flase'
        for (var i = 0; i < tStyle.length; i++) {
            tStyle[i].style.color = '#fff0'
        }
    } else {
        disOrAppearValue = 'true'
        for (var i = 0; i < tStyle.length; i++) {
            tStyle[i].style.color = 'var(--main-color)'
        }
    }
}

// 第七按钮，定位歌曲
aMusicValue = true

function aMusic() {
    document.getElementById('musicList').scrollTop = aMusicValue == true ? document.getElementById('mid' + playId).offsetTop : 0
    aMusicValue = !aMusicValue
}

// 虚空按钮，远距离控制
function playMiniControl() {
    return '<span class="playMiniControl"><a onclick="lastMusic()">      &lt;      </a><a onclick="stopOrStart()">      &#124; &#124;      </a><a onclick="nextMusic()">      &gt;      </a></span>'
}

// 歌词
function lyric2list(lyric) {
    list = lyric.split('\n')
    object = {}
    for (i in list) {
        var re = /\[([0-9]+):([0-9]+).([0-9]+)\]/g

        var time = list[i]
        var time = time.match(re)
        for (t in time) { // 解决多个时间一起对应一个歌词
            var key = 't' + lt2t(time[t])
            object[key] = list[i].replace(re, '')
        }
    }

    // 前后补全
    if (object.t0 == undefined) {
        object.t0 = ''
        object['t0.01'] = ''
    } else {
        object['t0.01'] = object.t0
        object.t0 = ''
    }
    object['t' + Infinity] = ''
    return object
}

function lt2t(t) {
    t = t.match(/\[([0-9]+):([0-9]+).([0-9]+)\]/)
    var key = t[1] * 60 + Number(t[2] + '.' + t[3])
    return key
}

function cTimeline(l) {
    var timeline = []
    var list = l.match(/\[([0-9]+):([0-9]+).([0-9]+)\]/g)
    for (i in list) {
        timeline[i] = lt2t(list[i])
    }

    function sortNumber(a, b) {
        return a - b
    }
    timeline = timeline.sort(sortNumber) // 排序

    if (timeline[0] != 0) {
        timeline.unshift(0, 0.01)
    } else {
        timeline.splice(0, 1, 0, 0.01)
    }
    timeline.push(Infinity) // 前后补全
    return timeline
}

function showlyric() {
    lyricText = ''
    // if (timeline != '') {
    for (x in timeline) {
        var gotof = "goto('t" + timeline[x] + "')"
        lyricText += '<a onclick="' + gotof + '"><div id="t' + timeline[x] + '" class="lyricList">' + '<p class="lyricLrc">' + lrc['t' + timeline[x]].replace("'", "&#x27;") + '</p>' + '<p class="lyricT">' + ('' + tlrc['t' + timeline[x]]).replace(undefined, '') + '</p>' + '</div></a>'
    }
    document.getElementById('lyric').innerHTML = lyricText
    // } else {
    //     document.getElementById('lyric').innerHTML = '<div class="lyricList"><p class="lyricLrc">纯音乐</p><p class="lyricT"></p></div>'
    // }
    document.getElementById('lyric').scrollTop = 0
}

tx = ''

function changeLyric() {
    if (music_audio.paused != true) { // 减少压力
        var music_audiotime = music_audio.currentTime
        // if (timeline != '') {
        for (t in timeline) {
            if (music_audiotime < timeline[t]) {
                if (tx != t) { // 减少压力
                    document.getElementById('lyric').scrollTop = document.getElementById('t' + timeline[t - 1]).offsetTop - 240
                    document.getElementById('t' + timeline[t - 2]).style.backgroundColor = '#0000'
                    document.getElementById('t' + timeline[t - 1]).style.backgroundColor = 'rgba(255, 255, 255, 0.6)'
                    tx = t
                }
                break
            }
        }
        // }
    }
}

setInterval('changeLyric()', 100)

function goto(timeId) {
    document.getElementById('lyric').scrollTop = document.getElementById(timeId).offsetTop - 240
    music_audio.currentTime = timeId.substring(1)
}