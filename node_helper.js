/**
 * Created by debayan on 7/25/16.
 */
var WebSocket = require('ws');
var NodeHelper = require('node_helper');
var forge = require('node-forge');
var atob = require('atob');
var btoa = require('btoa');

var   PSEUDORANDOM_FUNCTION = forge.md.sha256.create();
const ITERATIONS = 30000;
const DERIVED_KEY_LENGTH_BYTES = 32; // 256-bit

module.exports = NodeHelper.create({
  ws: null,
  reconnect_timer: null,

  start: function() {
    console.log(this.name + ' helper started ...');
  },

  saveIcon: function(filename, base64string) {
    filename = __dirname + '/icons/' + filename + '.jpg';
    require('fs').exists(filename, function(exists) {
      require('fs').writeFile(filename, new Buffer(base64string, 'base64'), function(err) {
        console.log(err);
      });
    });
    return filename;
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "LISTEN_PHONE") {
      this.config = payload;
      this.connectWs(this.config);
    }
  },

  connectWsWrapper: function(payload) {
    return this.connectWs(payload);
  },

  connectWs: function(payload) {
    var accessToken = this.config.accessToken;
    var password = this.config.key.password; // password
    var ident = this.config.key.ident; // salt
    var useEncryption = this.config.useEncryption;
    var key = forge.pkcs5.pbkdf2( password, ident, ITERATIONS, DERIVED_KEY_LENGTH_BYTES, PSEUDORANDOM_FUNCTION ); // key for decryption

    this.ws = new WebSocket('wss://stream.pushbullet.com/websocket/' + accessToken);
    var that = this;

    /*
     * JSON decrypt( JSON message )
     *
     * Decrypts an encrypted ciphgertext and returns.
     *
     * message: Encrypted PushBullet message. See here for more information: https://docs.pushbullet.com/#encrypted-ephemeral-format
     * return:  Returns the decrypted PushBullet message: See here for more information: https://docs.pushbullet.com/#notification-ephemeral
     *          On error it returns an JSON with the tuple "type:empty".
     */
    var decrypt = function( message ) {

      if(message.hasOwnProperty('encrypted') && message.encrypted == true)
      {
        var encoded_message = atob(message.ciphertext);
        var version = encoded_message.substr(0, 1);
        var tag = encoded_message.substr(1, 16); // 128 bits
        var initialization_vector = encoded_message.substr(17, 12); // 96 bits
        var encrypted_message = encoded_message.substr(29);

        if (version != '1') {
          console.error( "Encrypted phone notification has an invalid version." )
          return JSON.parse('{ "type": "empty" }');
        }

        var decipher = forge.cipher.createDecipher('AES-GCM', key);
        decipher.start({
          'iv': initialization_vector,
          'tag': tag
        });
        decipher.update(forge.util.createBuffer(encrypted_message));
        decipher.finish();

        try {
          // catch URI Error: URI malformed. This happens when the decryption key is wrong.
          return JSON.parse(decipher.output.toString('utf8'));
        } catch(e) {
          console.error("Cannot decrypt phone notification. Please check your key.password and key.ident in the phone-notification configuration");
          return JSON.parse('{ "type": "empty" }');
        }
      }
      else {
        console.error("The phone notification is not encrypted. Please fix the phone-notification configuration.")
        return JSON.parse('{ "type": "empty" }');
      }
    }

    this.ws.on('message', function(data, flags) {
      var msg = JSON.parse(data);
      if (msg.hasOwnProperty('type')) {
        if (msg.type == "push") {
          var push = msg.push;
          if(useEncryption == true)
          {
              push = decrypt(msg.push);
          }

          if(!push.hasOwnProperty('type'))
          {
            console.error("Wrong phone-notification. Please check the phone notification configuration for encrypted notifications.");
            return;
          }

          if(push.type == "mirror")
          {
            var iconPath = that.saveIcon(push.application_name, push.icon);
            tmp = {
              application_name: push.application_name,
              id: push.notification_id,
              package_name: push.package_name,
              count: 1,
              icon: iconPath,
              title: push.title,
              body: push.body
            };
            that.sendSocketNotification('PHONE_RESPONSE', tmp);
          }

          if (push.type == "dismissal") {
            tmp = {
              package_name: push.package_name
            };
            that.sendSocketNotification('DISMISSAL', tmp);
          }
        }
        else if (msg.type == "nop") {
          if (that.reconnect_timer) {
            clearTimeout(that.reconnect_timer);
            that.reconnect_timer = null;
          }
          that.reconnect_timer = setTimeout(function() {
            console.log(that.name + 'timer is up in onMessage');
            that.connectWs(that.config);
          }, 40000);
        }
      }
    });

    if (that.reconnect_timer) {
      clearTimeout(that.reconnect_timer);
      that.reconnect_timer = null;
    }
    that.reconnect_timer = setTimeout(function() {
      console.log(that.name + 'timer is up out of onMessage');
      that.connectWs(that.config);
    }, 40000);
  }
});
