/**
 * Created by debayan on 7/25/16.
 */

Module.register("phone_notification",{
    defaults : {
        accessToken: '',
        numberOfNotifications: 5,
        displayNotificationIcon: true,
        displayMessage: true,
        displayCount: false,
        alert: false,
        fade: true,
        maxCharacters: 50,
    },

    payload: [],

    start : function(){
        console.log("Phone notifications module started!");
        this.sendSocketNotification('LISTEN_PHONE',this.config);
        this.loaded = false;
        this.originalHeader = this.data.header;
       /* if(this.config.displayCount)
        {
            console.log('OLD_HEADER', this.data.header);
            this.data.header = this.payload.length + '' + this.originalHeader;
            console.log('HEADER', this.data.header);

        }*/
    },

    cleanPayload: function(newPayload){
        var application_name = newPayload.application_name;
        var that = this;
        if(this.payload.length > 0)
        {
            this.payload.forEach(function (m) {
                // If application_name already exists, increment notification count
                if(m.application_name === application_name)
                {
                    m.count++;
                }

                // Else new notification_id - append to payload
                else{
                    that.payload.push(newPayload);
                }
            });
        }
        else{
            this.payload.push(newPayload);
        }


    },

    socketNotificationReceived: function(notification, payload){

        if (notification === 'PHONE_RESPONSE'){
            if(payload){
                this.loaded = true;
                console.log('new notification: ', payload);
                console.log(payload);
                this.cleanPayload(payload);
                console.log('cleaned payload: ' , this.payload);
                console.log('payload length: ', this.payload.length);
                if(this.config.alert)
                    this.sendNotification("SHOW_ALERT", {type: "notification", title: "New phone notification"});
                this.sendSocketNotification('LISTEN_PHONE',this.config);

                this.updateDom();
            }
        }
    },

    // Define required scripts.
    getStyles: function() {
        return ["phone_notification.css", "font-awesome.css"];
    },

    getDom: function(){
        //console.log(this.data.header);
        var wrapper = document.createElement("table");
        wrapper.className = "small";
        var that = this;

        if(this.config.displayCount)
        {
            console.log('OLD_HEADER', this.data.header);
            console.log('LENGTH', this.payload.length);
            var headerRow = document.createElement("tr");
            var headerData = document.createElement("td");
            var headerDiv = document.createElement("div");
            headerDiv.className = "count";

            headerDiv.innerHTML = this.payload.length;
            console.log('HEADER', this.data.header);
            headerData.appendChild(headerDiv);
            var headerRest = document.createElement("td");
            headerRest.innerHTML = this.originalHeader;
            headerRow.appendChild(headerData);
            headerRow.appendChild(headerRest);
            wrapper.appendChild(headerRow);

        }


        if(this.payload.length > 0)
        {
            var count = 0;

            this.payload.slice(0,this.config.numberOfNotifications).forEach(function (o) {

                var name = o.application_name;
                //var subject = mailObj.subject.replace(/[\['"\]]+/g,"");

                var notificationWrapper = document.createElement("tr");
                notificationWrapper.className = "normal";

                if(that.config.displayNotificationIcon)
                {
                    console.log("display icon: ");
                    var iconWrapper = document.createElement("td");
                    iconWrapper.className = "icon";
                    var icon = document.createElement("span");
                    var iconPath = '/modules/phone_notification/icons/' + o.application_name + '.jpg';
		    icon.innerHTML = '<img src="' + iconPath +  '" width="25" >';
                    iconWrapper.appendChild(icon);
                    notificationWrapper.appendChild(iconWrapper);
                }

                var nameWrapper = document.createElement("td");
                nameWrapper.className = "bright";
                nameWrapper.innerHTML = name;
                notificationWrapper.appendChild(nameWrapper);

                var titleWrapper = document.createElement("td");
                titleWrapper.className = "bright";
                titleWrapper.innerHTML = o.title;
                notificationWrapper.appendChild(titleWrapper);
                wrapper.appendChild(notificationWrapper);

                if(that.config.displayMessage)
                {
                    var bodyWrapper = document.createElement("tr");
                    var bodyContentWrapper = document.createElement("td");
                    bodyContentWrapper.colSpan = '3';
                    bodyContentWrapper.className = "dimmed xsmall address";
                    bodyContentWrapper.innerHTML = o.body.substring(0,that.config.maxCharacters);
                    bodyWrapper.appendChild(bodyContentWrapper);
                    wrapper.appendChild(bodyWrapper);
                }


                // Create fade effect.
                if (that.config.fade) {
                    var startingPoint = that.payload.slice(0,that.config.numberOfNotifications).length * 0.25;
                    var steps = that.payload.slice(0,that.config.numberOfNotifications).length - startingPoint;
                    if (count >= startingPoint) {
                        var currentStep = count - startingPoint;
                        notificationWrapper.style.opacity = 1 - (1 / steps * currentStep);
                    }
                }
                count++;
            });
        }
        else{
            wrapper.innerHTML = this.translate("No new notifications");
            wrapper.className = "small dimmed";
            return wrapper;
        }

        return wrapper;
    }


});
