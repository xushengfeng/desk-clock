function tzg() {
    t = '好好学习'
    var widget = ''
    for (i in t.split('')) {
        widget += '<div class="tzg2">' + t.split('')[i] + '</div>'
    }
    return '<div class="tzg"><div class="tzg1">' + widget + '</div></div>'
}