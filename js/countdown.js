function countdown_n() {
    Option = ''
    for (i = 0; i < 10; i++) {
        Option = Option + '<option value="' + i + '">' + i + '</option>'
    }
    document.getElementById('cdM').innerHTML = document.getElementById('cdM1').innerHTML = Option
}

slButtonValue = 'stop'

function slStart(value) {
    slButtonValue = 'start'
    //按钮样式
    document.getElementById('StOrSt').style.borderColor = '#FE4A49'
    //掉落的沙子
    document.getElementById('slLine').style.background = "url('assets/ldBg.png') no-repeat"
    //数字
    document.getElementById('cdM').style.display = 'none'
    document.getElementById('cdM1').style.display = 'none'
    document.getElementById('cdNum').style.color = '#fff'
    // document.getElementById('cdNum').style.width = '80px'
    // document.getElementById('cdControl').style.width = '140px'
    //沙子
    document.getElementById('slTop').style.transition = value + 's cubic-bezier(0, 0, 0.9, 0.2)'
    document.getElementById('slLow').style.transition = value + 's cubic-bezier(0, 0, 0.9, 0.2)'
    document.getElementById('slTop').style.backgroundPositionY = '250px'
    document.getElementById('slLow').style.backgroundPositionY = '50px'
}

function slStop() {
    slButtonValue = 'stop'
    //按钮样式
    document.getElementById('StOrSt').style.borderColor = '#2283F6'
    //掉落的沙子
    document.getElementById('slLine').style.background = ''
    //数字
    document.getElementById('cdM').style.display = ''
    document.getElementById('cdM1').style.display = ''
    document.getElementById('cdNum').style.color = '#fff0'
    document.getElementById('cdNum').style.width = '0px'
    // document.getElementById('cdControl').style.width = '160px'
    //沙子
    document.getElementById('slTop').style.transition = '1s linear'
    document.getElementById('slLow').style.transition = '1s linear'
    document.getElementById('slTop').style.backgroundPositionY = '50px'
    document.getElementById('slLow').style.backgroundPositionY = '250px'
    // document.getElementById('slLine').style.background = ''
    // 停止响铃计时
    clearTimeout(ring)
    clearTimeout(cdmSTO)
    clearTimeout(STO2cdmSTO)
}


function Ring() {
    countmusic = new Audio("assets/Ring.ogg")
    countmusic.volume = 0.3
    countmusic.play()
}

Mvalue = ''

function cdStart() {
    if (slButtonValue == 'stop') {
        cdMvalue = Number(document.getElementById('cdM').value + document.getElementById('cdM1').value) //分钟
        var cdSvalue = cdMvalue * 60 //秒(动画)
        var cdMSvalue = cdSvalue * 1000 //毫秒(倒计时)
        slStart(cdSvalue) //动画
        //数字
        document.getElementById('cdNum').innerHTML = cdMvalue
        STO2cdmSTO = setTimeout(('cdMvalueDown()'), 60000)
        //结束时响铃,沙线无
        ring = setTimeout('Ring()', cdMSvalue)
        slSTO = setTimeout("document.getElementById('slLine').style.background = ''", cdMSvalue)
    } else {
        slStop()
    }
}

function cdMvalueDown() { //数字跳动
    if (cdMvalue > 0) {
        cdMvalue = cdMvalue - 1
        document.getElementById('cdNum').innerHTML = cdMvalue
        cdmSTO = setTimeout('cdMvalueDown()', 60000)
    }
}

function countdown() {
    return '<div id="countdown"><div id="cdControl"><select id="cdM"></select><select id="cdM1"></select><p id="cdNum"></p><a onclick="cdStart()"><div id="StOrSt"></div></a></div><div id="slTop"></div><div id="slLow"></div><div id="slLine"></div></div>'
}