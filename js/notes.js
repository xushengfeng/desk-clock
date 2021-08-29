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
};

function post(url, data) {
    $.ajax({
        url: url,
        data: data,
        type: "POST",
        async: false,
    });
};


document.getElementById('notes').value = get('http://localhost:9900')

function upInput() {
    var x = document.getElementById('notes').value
    post('http://localhost:9900', x)

    // 闹钟数据
    alarmData = document.getElementById('notes').value.split('------')[0]
    eval(alarmData)
}