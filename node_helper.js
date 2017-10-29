/**
 * Created by debayan on 7/25/16.
 */
 
var WebSocket = require('ws');
var NodeHelper = require('node_helper');

module.exports = NodeHelper.create({
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
      var accessToken = this.config.accessToken;
      var ws = new WebSocket('wss://stream.pushbullet.com/websocket/' + accessToken);
      var that = this;

      ws.on('message', function(data, flags) {
        var msg = JSON.parse(data);
        //console.log(msg.type);
        if (msg.type == "push" && msg.push.type == "mirror") {
          var iconPath = that.saveIcon(msg.push.application_name, msg.push.icon);
          tmp = {
            application_name: msg.push.application_name,
            id: msg.push.notification_id,
            package_name: msg.push.package_name,
            count: 1,
            icon: iconPath,
            title: msg.push.title,
            body: msg.push.body
          };
          //console.log('sending push');
          that.sendSocketNotification('PHONE_RESPONSE', tmp);
        }
        if (msg.type == "push" && msg.push.type == "dismissal") {
          //console.log('Dismissed');
          tmp = {
            package_name: msg.push.package_name
          };
          that.sendSocketNotification('DISMISSAL', tmp);
        }
      });
    }
  }
});
