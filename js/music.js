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
        var main_list = ''
        for (listn in list.playlist) {
            main_list = main_list + '<a class="list_words" onclick="show_music_list(' + list.playlist[listn].id + ')">' +
                list.playlist[listn].name + '</a></br>'
        }
        document.getElementById("list").innerHTML = main_list;
        list = null
    }

}


// 具体歌单
function show_music_list(id) {
    var music_list_id = get('http://' + ip + ':3000/playlist/detail?id=' + id + '&cookie=' + cookie).playlist.trackIds
    var Ids = ''
    for (Idsn in music_list_id) {
        var Ids = Ids + ',' + music_list_id[Idsn].id
    }
    var Ids = Ids.substring(1)
    name_list = get('http://' + ip + ':3000/song/detail?ids=' + Ids).songs
    MusicList = new Array()
    for (idn in name_list) {
        MusicList[idn] = name_list[idn].id
    }

    var name_list_word = ''
    for (var namen in name_list) {
        var name = name_list[namen].name;
        var alia = (name_list[namen].alia[0] != undefined) ? name_list[namen].alia[0] : ''
        var tns = (name_list[namen].tns != undefined) ? name_list[namen].tns[0] : ''

        if (alia == '' && tns == '') {
            var name = name;
        } else {
            if (alia == tns || tns == '') {
                var name = name + '<span class="music_from">(' + alia + ')</span>';
            } else if (alia == '') {
                var name = name + '<span class="music_from">(' + tns + ')</span>';
            } else {
                var name = name + '<span class="music_from">(' + tns + '(' + alia + '))</span>';
            }
        }

        var singer = ''
        for (singern in name_list[namen].ar) {
            var singer = singer + '/' + name_list[namen].ar[singern].name
        }
        var singer = '<div class="singer">' + singer.substring(1) + '-' + name_list[namen].al.name + '</div>'

        // 重点
        name_list_word = name_list_word + '<a onclick="play(' + name_list[namen].id + ')">' +
            '<div class="name_list_word" id="mid' + name_list[namen].id + '"><p class="name_list_word_p">' + name + '</p>' + singer + '</div></a></br>'
    }
    document.getElementById("music_list").innerHTML = name_list_word
}


// 播放器
function player_load() {
    music_audio = document.getElementById("music")
    music_audio.volume = 100 / 600
    // 403处理
    music_audio.addEventListener('error', () => {
        play(play_id)
    })
    // 进度条
    music_audio.addEventListener('timeupdate', play_time)
    // 播放键
    music_audio.addEventListener('pause', () => {
        document.getElementById("stop_or_start").innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="" height="" viewBox="0 0 52.917 52.917"><path d="M46.302 26.458L6.615 52.917V0z" fill="" stroke-width="0"/></svg>'
    })
    music_audio.addEventListener('play', () => {
        document.getElementById("stop_or_start").innerHTML = '<svg width="" height="" viewBox="0 0 52.917 52.917" xmlns="http://www.w3.org/2000/svg"><g fill=""><rect width="10.583" height="52.917" x="10.583" ry="5.292" stroke-width="0"/><rect width="10.583" height="52.917" x="31.75" ry="5.292" stroke-width="0"/></g></svg>'
    })

    // 结束后切歌(根据模式)
    model = "l" //l:loop,r:randomly,o:orderly
    document.getElementById("music").onended = () => {
        // 循环
        if (model == 'l') {
            // document.getElementById("music").loop = 'loop'
            play(play_id)
            // music_audio.play()
        }
        // 顺序(上往下)
        if (model == 'o') {
            next_music()
        }
        // 随机
        if (model == 'r') {
            next_music()
        }
    }

}
play_id = ''
lrc = ''
tlrc = ''
timeline = ''

function get_url(id) {
    var url = post('http://' + ip + ':3000/song/url?id=' + id, cookie) //@@@@@#########################
    if (url.data[0].url == undefined) {
        var url = ''
    } else {
        var url = url.data[0].url
    }
    return url
}

function play(id) {
    music_tmp_src = get_url(id)
    play_main(id, music_tmp_src)
    if (music_tmp_src == '') {
        next_music()
    }
    play_color()
    play_lyric()
}

function play_main(id, src) {
    music_audio.src = src
    music_audio.play()
    play_id = id
    var anameList = post('http://' + ip + ':3000/song/detail?ids=' + play_id, cookie).songs
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
    document.getElementById("play_words").innerHTML = name + '-' + singer
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

        navigator.mediaSession.setActionHandler('previoustrack', last_music);
        navigator.mediaSession.setActionHandler('nexttrack', next_music);
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
    var lyric = post('http://' + ip + ':3000/lyric?id=' + play_id, cookie)
    if (lyric.lrc != undefined) {
        lrc = lyric.lrc.lyric
        timeline = c_time_line(lrc)
        lrc = lyric_to_list(lrc)
        if (lyric.tlyric.lyric != null) {
            tlrc = lyric.tlyric.lyric
            tlrc = lyric_to_list(tlrc)
            // show_lyric(timeline)
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
    show_lyric()
}


// '秒'转'分:秒'
function s_to_m(s) {
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
function play_time() {
    document.getElementById("range").max = music_audio.duration
    document.getElementById("range").value = music_audio.currentTime
    document.getElementById("range").style.backgroundSize = music_audio.currentTime * 100 / music_audio.duration + '% 100%'
    document.getElementById("play_time").innerHTML = s_to_m(music_audio.currentTime)
    document.getElementById("play_all_time").innerHTML = s_to_m(music_audio.duration)

    // setTimeout(play_time, 1000)
}
// play_time()


// 进度条控制
function play_time_range() {
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

function play_model() {
    var l = '<svg width="" height="" viewBox="0 0 52.917 52.917" xmlns="http://www.w3.org/2000/svg"><g stroke=""><rect width="47.376" height="31.501" x="2.77" y="10.708" ry="15.75" rx="15.75" fill="none" stroke-width="5.541"/><rect width="5.182" height="18.411" x="23.867" y="17.253" ry="2.591" fill="" stroke-width="0"/><rect width="7.851" height="5.205" x="21.198" y="17.253" ry="2.603" fill="" stroke-width="0"/></g></svg>'
    var o = '<svg xmlns="http://www.w3.org/2000/svg" width="" height="" viewBox="0 0 52.917 52.917"><rect width="47.376" height="31.501" x="2.77" y="10.708" ry="15.75" rx="15.75" fill="none" stroke="" stroke-width="5.541"/></svg>'
    var r = '<svg width="" height="" viewBox="0 0 52.917 52.917" xmlns="http://www.w3.org/2000/svg"><g fill="" stroke="" stroke-width="7.938" stroke-linecap="round"><path d="M3.969 13.23c22.59 0 22.702 26.879 44.979 26.457M3.969 39.688c22.514 0 22.314-26.459 44.979-26.459"/></g></svg>'
    var model_list = {
        'l': 'o',
        'o': 'r',
        'r': 'l'
    }
    model = model_list[model]
    document.getElementById("play_model").innerHTML = eval(model)
}

// 第二按钮,上一首<
function last_music() {
    if (model == 'r') {
        var listn = Math.floor(Math.random() * (MusicList.length + 1))
        play(MusicList[listn])
    } else {
        for (var idn in MusicList) {
            if (play_id == MusicList[idn]) {
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
function stop_or_start() {
    if (music_audio.paused != true) {
        music_audio.pause()
        // document.getElementById("stop_or_start").style.backgroundImage = 'url(assets/musicicon/p.svg)'
    } else {
        music_audio.play()
        // document.getElementById("stop_or_start").style.backgroundImage = 'url(assets/musicicon/s.svg)'
    }
}

// 第四按钮,下一首>
function next_music() {
    if (model == 'r') {
        var listn = Math.floor(Math.random() * (MusicList.length + 1))
        play(MusicList[listn])
    } else {
        for (var idn in MusicList) {
            if (play_id == MusicList[idn]) {
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
function play_list() {
    if (document.getElementById("lyric").style.display == "none") {
        document.getElementById("lyric").style.display = ""
        document.getElementById("list").style.display = "none"
        document.getElementById("music_list").style.display = "none"
    } else {
        document.getElementById("lyric").style.display = "none"
        document.getElementById("list").style.display = ""
        document.getElementById("music_list").style.display = ""
    }
}

// 第六按钮，展示翻译
dis_or_appear_value = 'true'

function dis_or_appear() {
    var t_style = $('.lyric_t')
    if (dis_or_appear_value == 'true') {
        dis_or_appear_value = 'flase'
        for (var i = 0; i < t_style.length; i++) {
            t_style[i].style.color = '#fff0'
        }
    } else {
        dis_or_appear_value = 'true'
        for (var i = 0; i < t_style.length; i++) {
            t_style[i].style.color = 'var(--main-color)'
        }
    }
}

// 第七按钮，定位歌曲
a_music_value = true

function a_music() {
    document.getElementById('music_list').scrollTop = a_music_value == true ? document.getElementById('mid' + play_id).offsetTop : 0
    a_music_value = !a_music_value
}

// 虚空按钮，远距离控制
function play_mini_control() {
    return '<span class="play_mini_control"><a onclick="last_music()">      &lt;      </a><a onclick="stop_or_start()">      &#124; &#124;      </a><a onclick="next_music()">      &gt;      </a></span>'
}

// 歌词
function lyric_to_list(lyric) {
    list = lyric.split('\n')
    object = {}
    for (i in list) {
        var re = /\[([0-9]+):([0-9]+).([0-9]+)\]/g

        var time = list[i]
        var time = time.match(re)
        for (t in time) { // 解决多个时间一起对应一个歌词
            var key = 't' + lt_to_t(time[t])
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

function lt_to_t(t) {
    t = t.match(/\[([0-9]+):([0-9]+).([0-9]+)\]/)
    var key = t[1] * 60 + Number(t[2] + '.' + t[3])
    return key
}

function c_time_line(l) {
    var timeline = []
    var list = l.match(/\[([0-9]+):([0-9]+).([0-9]+)\]/g)
    for (i in list) {
        timeline[i] = lt_to_t(list[i])
    }

    timeline = timeline.sort((a,b)=>{return a-b}) // 排序

    if (timeline[0] != 0) {
        timeline.unshift(0, 0.01)
    } else {
        timeline.splice(0, 1, 0, 0.01)
    }
    timeline.push(Infinity) // 前后补全
    return timeline
}

function show_lyric() {
    lyricText = ''
    // if (timeline != '') {
    for (x in timeline) {
        var gotof = "go_to('t" + timeline[x] + "')"
        lyricText += '<a onclick="' + gotof + '"><div id="t' + timeline[x] + '" class="lyric_list">' + '<p class="lyric_lrc">' + lrc['t' + timeline[x]].replace("'", "&#x27;") + '</p>' + '<p class="lyric_t">' + ('' + tlrc['t' + timeline[x]]).replace(undefined, '') + '</p>' + '</div></a>'
    }
    document.getElementById('lyric').innerHTML = lyricText
    // } else {
    //     document.getElementById('lyric').innerHTML = '<div class="lyricList"><p class="lyricLrc">纯音乐</p><p class="lyricT"></p></div>'
    // }
    document.getElementById('lyric').scrollTop = 0
}

tx = ''

function change_lyric() {
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

setInterval('change_lyric()', 100)

function go_to(time_id) {
    document.getElementById('lyric').scrollTop = document.getElementById(time_id).offsetTop - 240
    music_audio.currentTime = time_id.substring(1)
}