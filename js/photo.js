function showPhoto() {
    list = document.getElementById('photoUrl').value
    list = list.split(' ')
    document.getElementById('photo').style.backgroundImage = 'url(photo/' + list[0] + ')'
    document.getElementById('photo').style.width = list[1] + 'px'
    document.getElementById('photo').style.height = list[2] + 'px'
}