# Phone Notification - Mirror
Displays and alerts mirror users on new phone notifications. 

![Phone Visualization](https://github.com/ronny3050/phone-notification-mirror/blob/master/.github/full_preview.png)

## Getting Started
Firstly, a [Pushbullet](https://www.pushbullet.com/) app is required on the phone. After downloading and installing the application on your phone, get a Pushbullet Access Token from your Account Settings. 

## Installing the module

To install the module, just clone this repository to your __modules__ folder: `git clone https://github.com/ronny3050/phone-notification-mirror.git phone_notification`. 
Then run `cd phone_notification` and `npm install` which will install the dependencies.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript

	{
		    module: 'phone_notification',
            position: 'bottom_right',
            header: 'Phone Notifications',
            config:{
                accessToken: 'YOUR_ACCESS_TOKEN',
                numberOfNotifications: 5,
                displayNotificationIcon: true,
                displayMessage: true,
                displayCount: false,
                alert: false,
                fade: true,
				maxCharacters: 50
				useEncryption: true,
				key: {
					password: 'YOUR_PASSWORD',
					ident: 'YOUR_USER_IDENT'
				}
            }
	},

````

## Configuration options

The following properties can be configured:

<table width="100%">
	<!-- why, markdown... -->
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	<thead>
	<tbody>
		<tr>
			<td><code>accessToken</code></td>
			<td>Your Pushbullet Access Token<br>
			</td>
		</tr>
		<tr>
			<td><code>numberOfNotifications</code></td>
			<td>Number of notifications to display at a time<br>
				<br><b>Default value:</b> <code>5</code>
				<br>If set to 0, no notification messages will be displayed.
			</td>
		</tr>
		<tr>
			<td><code>displayNoticiationIcon</code></td>
			<td>Display app icon that generated the notification<br>
				<br><b>Possible values:</b> <code>true</code> or <code>false</code>
				<br><b>Default value:</b> <code>true</code>
			</td>
		</tr>
		<tr>
			<td><code>displayMessage</code></td>
			<td>Display body of the notification<br>
				<br><b>Possible values:</b> <code>true</code> or <code>false</code>
				<br><b>Default value:</b> <code>true</code>
				<br><img src="https://github.com/ronny3050/phone-notification-mirror/blob/master/.github/message.png" width="50%" height="0.1%"></img>
			</td>
		</tr>
		<tr>
			<td><code>displayCount</code></td>
			<td>Display notification count<br>
				<br><b>Possible values:</b> <code>true</code> or <code>false</code>
				<br><b>Default value:</b> <code>true</code>
				<br><img src="https://github.com/ronny3050/phone-notification-mirror/blob/master/.github/count.png" width="50%" height="0.1%"></img>
			</td>
		</tr>
		<tr>
			<td><code>alert</code></td>
			<td>Show alerts on new notification<br>
				<br><b>Possible values:</b> <code>true</code> or <code>false</code>
				<br><b>Default value:</b> <code>true</code>
				<br>Please note that this requires the alert module to be present in the config file. For instance,
				<code>modules: [
							{
								widget: 'alert'
							}
						]</code>
		<br><img src="https://github.com/ronny3050/phone-notification-mirror/blob/master/.github/alert.png" width="50%" height="2%"></img>			</td>
		</tr>
		<tr>
			<td><code>fade</code></td>
			<td>Fade older notifications to black. (Gradient)<br>
				<br><b>Possible values:</b> <code>true</code> or <code>false</code>
				<br><b>Default value:</b> <code>true</code>
			</td>
		</tr>
		<tr>
			<td><code>maxCharacters</code></td>
			<td>Number of characters to display per notification body<br>
				<br><b>Default value:</b> <code>50</code>
			</td>
		</tr>
		<tr>
			<td><code>useEncryption</code></td>
			<td>Enable encrypted communication<br>
				<br><b>Default value:</b> <code>false</code>
			</td>
		</tr>
		<tr>
			<td><code>key</code></td>
			<td>An object with the password and the ident. Used for decryption.<br>
				<br><b>Default value:</b> <code>See key configuration below</code>
			</td>
		</tr>
	</tbody>
</table>

## key options

The following properties can be configured:

<table width="100%">
	<!-- why, markdown... -->
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	<thead>
	<tbody>
		<tr>
			<td><code>password</code></td>
			<td>Password supplied by the user for encryption, must be the same on all Pushbullet devices owned by the user<br>
				<br><b>Default value:</b> <code>none</code>
			</td>
		</tr>
		<tr>
			<td><code>ident</code></td>
			<td>The user iden for the current user<br>
				<br>Request iden with: 
				<br><code>curl --header &#39;Access-Token: &lt;your_access_token_here&gt;&#39; https://api.pushbullet.com/v2/users/me</code> 
				<br><b>Default value:</b> <code>none</code>
			</td>
		</tr>
	</tbody>
</table>