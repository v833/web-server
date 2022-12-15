const http = require('node:http')
const url = require('node:url')
const qs = require('node:querystring')
const path = require('node:path')
const fs = require('node:fs')

const notFound = (req, res) => {
  fs.readFile(path.join(__dirname, '404.html'), (err, data) => {
    if (err) {
      // 404
      console.log('404')
    } else {
      res.writeHead(404, {
        'Content-Type': 'text/html;charset="utf-8"'
      })
      res.write(data)
      res.end()
    }
  })
}

const writeDb = (chunk) => {
  fs.appendFile(path.join(__dirname, 'db'), chunk, (err) => {
    if (err) throw err
  })
}

const server = http.createServer((req, res) => {
  // 路由处理
  let pathName = url.parse(req.url).pathname

  // /api =>
  if (pathName.startsWith('/api')) {
    const method = req.method
    if (method === 'GET') {
      const query = qs.parse(url.parse(req.url).query)
      const resData = {
        code: 200,
        message: 'success',
        data: query
      }
      res.end(JSON.stringify(resData))
    } else if (method === 'POST') {
      const contentType = req.headers['content-type']
      if (contentType === 'application/json') {
        let postData = ''
        req.on('data', (chunk) => {
          postData += chunk
          writeDb(chunk)
        })
        req.on('end', () => {
          res.end(postData)
        })
      }
    }
  }

  if (pathName === '/') {
    pathName = path.resolve(__dirname, 'index.html')
  }
  const extName = path.extname(pathName)
  if (extName === '.html') {
    // index.html
    fs.readFile(pathName, (err, data) => {
      if (err) {
        // 404
        notFound(req, res)
      } else {
        res.writeHead(200, {
          'Content-Type': 'text/html;charset="utf-8"'
        })
        res.write(data)
        res.end()
      }
    })
  }

  // 静态资源托管

  // 处理HTTP

  // store
})

server.listen(8080)
