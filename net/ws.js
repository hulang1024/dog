import { parseSearchParams } from "../utils.js";

export default class SocketClient {
  constructor(onConnect) {
    // TODO: token
    const ws = new WebSocket('ws://localhost:8080?uid=' + parseSearchParams().uid);
    this.ws = ws;
    this.dataListeners = [];

    ws.onopen = (ev) => {
      console.log('open', ev);
      this.login();
    };
    ws.onclose = (ev) => {
      console.log('close', ev);
    };
    ws.onerror = (ev) => {
      console.log('error', ev);
    };
    ws.onmessage = (event) => {
      this.dataListeners.forEach((l) => l(event.data));
    };
  }

  onData(l) {
    this.dataListeners.push(l);
  }

  login() {
    this.send({type: 'login', data: { uid: 1 }});
  }

  sendBinary(data) {
    this.ws.send(data);
  }

  send(message) {
    this.ws.send(JSON.stringify(message));
  }
}