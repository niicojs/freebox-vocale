// @ts-check
const fs = require('fs');
const got = require('got');
const WebSocket = require('ws');
const Freebox = require('./freebox');

let config = {
  pushbullet: {
    token: ''
  },
  freebox: {
    code: ''
  }
};

let configlocation = 'config.json';
if (fs.existsSync('/config/config.json')) {
  configlocation = '/config/config.json';
}
config = JSON.parse(fs.readFileSync(configlocation, 'utf8'));

const freebox = new Freebox(config.freebox);

const client = got.extend({
  baseUrl: 'https://api.pushbullet.com/v2',
  headers: {
    'Access-Token': config.pushbullet.token
  },
  json: true,
  form: true
});

const ws = new WebSocket(
  `wss://stream.pushbullet.com/websocket/${config.pushbullet.token}`
);

ws.on('open', () => {
  console.log('Connected.');
});

ws.on('message', async data => {
  if (data.type === 'tickle') {
    console.log('New push, getting it');
    await newMessage();
  }
});

const newMessage = async () => {
  const query = {
    active: true,
    limit: 1
  };
  const last = (await client.get('pushes', { query })).body;
  if (last.title === 'Homeflix' && last.body.startsWith('freebox')) {
    if (last.body === 'freebox_on') {
      await freebox.send('power');
    } else if (last.body === 'freebox_off') {
      await freebox.send('power');
    }
  }
};
