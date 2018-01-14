/**
 * Created by debayan on 7/25/16.
 */

var accessToken = '';
var password = '';
var salt = '';

var WebSocket = require('ws');
var ws = new WebSocket('wss://stream.pushbullet.com/websocket/' + accessToken);
var forge = require('node-forge');
var atob = require('atob');
var btoa = require('btoa');

var   PSEUDORANDOM_FUNCTION = forge.md.sha256.create();
const ITERATIONS = 30000;
const DERIVED_KEY_LENGTH_BYTES = 32; // 256-bit

var m = JSON.parse( '{ "type": "empty" }' );
console.log(m);

ws.on('message', function(data, flags) {

    console.log(data);
    var msg = JSON.parse(data);
    console.log(msg.type);
    if (msg.type == "push" && msg.push.encrypted == true)
    {
        console.log("Try do decrypt...");
        var key = forge.pkcs5.pbkdf2( password, salt, ITERATIONS, DERIVED_KEY_LENGTH_BYTES, PSEUDORANDOM_FUNCTION );
        console.log("Key: ", key);

        var encoded_message = atob(msg.push.ciphertext);
        var version = encoded_message.substr(0, 1);
        var tag = encoded_message.substr(1, 16); // 128 bits
        var initialization_vector = encoded_message.substr(17, 12); // 96 bits
        var encrypted_message = encoded_message.substr(29);

        if (version != '1') {
            throw "invalid version"
        }

        var decipher = forge.cipher.createDecipher('AES-GCM', key);
        decipher.start({
            'iv': initialization_vector,
            'tag': tag
        });
        decipher.update(forge.util.createBuffer(encrypted_message));
        decipher.finish();
        var message = decipher.output.toString('utf8')

        console.log(message);
    }
});
