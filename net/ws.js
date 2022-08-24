import { parseSearchParams } from "../utils.js";

export default class SocketClient {
  constructor() {
    SocketClient.uid = parseSearchParams().uid
    // TODO: token
    const ws = new WebSocket('ws://localhost:8080?uid=' + SocketClient.uid);
    this.ws = ws;
    this.messageListeners = [];

    ws.onopen = (ev) => {
      console.log('open');
      //this.login();
    };
    ws.onclose = (ev) => {
      console.log('close', ev);
    };
    ws.onerror = (ev) => {
      console.log('error', ev);
    };
    ws.onmessage = (event) => {
      this.messageListeners.forEach((l) => l(event.data));
    };
  }

  onMessage(l) {
    this.messageListeners.push(l);
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