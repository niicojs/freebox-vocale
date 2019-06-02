// @ts-check
const got = require('got');

class Freebox {
  constructor(config) {
    const code = config.code;
    this.url = `http://hd1.freebox.fr/pub/remote_control?code=${code}&key=`;
  }

  async send(key) {
    got.get(this.url + key);
  }
}

module.exports = Freebox;
