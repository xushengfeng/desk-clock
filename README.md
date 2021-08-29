# desk-clock

运行`git clone https://github.com/zzyss86/LunarCalendar.git `下载LunarCalendar到lib文件夹下

若想使用音乐,则运行

```
git clone https://github.com/Binaryify/NeteaseCloudMusicApi.git
cd NeteaseCloudMusicApi
npm install
node app.js
```

来启动音乐服务,记得在js/privacy.js里面加入自己账号以保证可以听vip

在`js/privacy.js`加入

```
privacy = {
    music_id : "网易云邮箱",
    music_passwd : "网易云md5密码",
    weather_id : "彩云天气秘钥/116.00,39.00"
}
```

天气服务则需要在彩云天气上申请一个秘钥

