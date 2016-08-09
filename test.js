/**
 * Created by debayan on 7/25/16.
 */
var WebSocket = require('ws');
var ws = new WebSocket('wss://stream.pushbullet.com/websocket/o.OkrDxi5FltSy7BhggzlCgUU6nQpCSvUn');

ws.on('message', function(data, flags) {
    console.log(data);
});
