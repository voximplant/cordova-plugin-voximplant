# Voximplant Cordova SDK

BETA, NOT PUBLISHED YET

## Getting started
`cordova plugin add <path_to_this_repo>`

## SDK usage

### Initialization

```javascript
Voximplant = cordova.require('cordova-plugin-voximplant.Voximplant');
let client = Voximplant.getInstance();
client.init()
    .then(event => {
        
    });
```

### Connect and login
```javascript
client.connect()
    .then(event => client.login("user@app.account.voximplant.com", "p@ssw0rd");
```

### Make outgoing call
```javascript
let callSettings = {
    video: {
        sendVideo: false,
        receiveVideo: false
    }
}
client.call("user_to_call", callSettings)
    .then(call => {
        call.on(CallEventTypes.Connected, handleCallConnected());
    })
```

### Receive incoming call
```javascript
client.on(ClientEventTypes.IncomingCall, event => {
        event.call.answer({
            video: {
                sendVideo: false,
                receiveVideo: false
            }
        });
    });
```

### End call
```javascript
call.hangup();
```

## Limitations
1. Video is not supported yet
