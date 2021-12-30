import * as http from 'http';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as zlib from 'zlib';
import {createReadStream} from 'fs';

const server = http.createServer();
const publicDir = path.resolve(__dirname, 'public');
const cacheAge = 31536000; // 缓存一年

server.on('request', async (request, response) => {
  if (request.method !== 'GET') {
    response.statusCode = 405;
    response.end('Not Allowed.');
    return;
  }
  const url = new URL(request.url, `http://${request.headers.host}`);
  let {pathname} = url;
  try {
    if (pathname === '/') {
      pathname = '/index.html';
    }
    if (!pathname.endsWith('.html')) {
      // 给非 HTML 文件加缓存
      response.setHeader('Cache-Control', `public,max-age=${cacheAge}`);
    }
    if (pathname.endsWith('.html') || pathname.endsWith('.css') || pathname.endsWith('.js')) {
      const filePath = path.join(publicDir, pathname);
      // 给 .html .css .js 结尾的文件进行压缩响应
      const stream = createReadStream(filePath);
      const compress = zlib.createGzip();
      const compressType = 'gzip';
      response.setHeader('Content-Encoding', compressType);
      stream.pipe(compress).pipe(response);
    } else {
      // 不符合压缩条件的文件进行直接响应
      const data = await fs.readFile(path.join(publicDir, pathname));
      response.end(data);
    }
  } catch (error) {
    // 无法打开文件
    if (error.errno === -2) {
      response.statusCode = 404;
      if (pathname.endsWith('.html')) {
        const data = await fs.readFile(path.join(publicDir, '/404.html'));
        response.end(data);
      } else {
        response.end('No Permission See.');
      }
    } else {
      // 其他错误
      response.statusCode = 500;
      response.end('The server is busy.');
    }
  }
});

server.listen(8888);