import sirv from 'sirv';
import nanoexpress from 'nanoexpress';
//import staticServe from '@nanoexpress/middleware-static-serve';
//import compression from 'compression';
import * as sapper from '@sapper/server';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

nanoexpress()
  .ws('/ws', async (req, res) => {
    console.log('Connecting...');

    await new Promise((resolve) => setTimeout(resolve, 1000));

    res.on('connection', (ws) => {
      console.log('Connected');

      ws.on('message', (msg) => {
        // eslint-disable-next-line security-node/detect-crlf
        console.log('Message received', msg);
        ws.send(msg);
      });
      ws.on('close', (code, message) => {
        // eslint-disable-next-line security-node/detect-crlf
        console.log('Connection closed', { code, message });
      });
    });
    res.on('upgrade', () => {
      console.log('Connection upgrade');
    });
  })
  .use(async (req) => {
    req.headers = {};
    req.forEach((key, value) => {
      req.headers[key] = value;
    });
  })
  //.use(compression({ threshold: 0 }))
  .use(sirv('static', { dev }))
  .use(sapper.middleware())
  .any('/*', () => {})

	.listen(3000);
