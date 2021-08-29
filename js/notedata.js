const http = require("http");
const fs = require("fs");

const port = 9900;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method == 'GET') {
    const stream = fs.createReadStream('notedata.txt')
    stream.pipe(res)
  } else if(req.method == 'POST') {
    var post = '';

    req.on('data', function (chunk) {
      post += chunk;
    });

    req.on('end', function () {
      fs.writeFile('notedata.txt', post, err => {
        if (err) {
          console.error(err)
          return
        }
        //文件写入成功。
      })
      res.end()
    });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Server is running on http://127.0.0.1:${port}/`);
});