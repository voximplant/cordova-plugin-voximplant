/*
* Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
*/

#import "VoximplantPlugin.h"
#import "VIClientModule.h"

@interface VoximplantPlugin()
@property(nonatomic, strong) VIClientModule* clientModule;
@property(nonatomic, strong) VoximplantCallManager *callManager;
@end

@implementation VoximplantPlugin

- (void)coolMethod:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    NSString* echo = [command.arguments objectAtIndex:0];

    if (echo != nil && [echo length] > 0) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:echo];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}



- (void)initClient:(CDVInvokedUrlCommand *)command {
    if (!self.clientModule) {
        self.callManager = [[VoximplantCallManager alloc] initWithCommandDelegate:self.commandDelegate];
        self.clientModule = [[VIClientModule alloc] initWithCommandDelegate:self.commandDelegate callManager:self.callManager];
        [self.clientModule initClient:command.arguments callbackId:command.callbackId];
    } else {
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR]
                                    callbackId:command.callbackId];
    }
}

- (void)connect:(CDVInvokedUrlCommand *)command {
    if (![self clientModuleValid:command]) {
        return;
    }
    [self.clientModule connect:command.arguments callbackId:command.callbackId];
}

- (void)login:(CDVInvokedUrlCommand *)command {
    if (![self clientModuleValid:command]) {
        return;
    }
    [self.clientModule login:command.arguments callbackId:command.callbackId];
}

- (void)getClientState:(CDVInvokedUrlCommand *)command {
    if (![self clientModuleValid:command]) {
        return;
    }
    [self.clientModule getClientState:command.arguments callbackId:command.callbackId];
}

- (void)loginWithToken:(CDVInvokedUrlCommand *)command {
    if (![self clientModuleValid:command]) {
        return;
    }
    [self.clientModule loginWithToken:command.arguments callbackId:command.callbackId];
}

- (void)loginWithOneTimeKey:(CDVInvokedUrlCommand *)command {
    if (![self clientModuleValid:command]) {
        return;
    }
    [self.clientModule loginWithOneTimeKey:command.arguments callbackId:command.callbackId];
}

- (void)requestOneTimeKey:(CDVInvokedUrlCommand *)command {
    if (![self clientModuleValid:command]) {
        return;
    }
    [self.clientModule requestOneTimeKey:command.arguments callbackId:command.callbackId];
}

- (void)tokenRefresh:(CDVInvokedUrlCommand *)command {
    if (![self clientModuleValid:command]) {
        return;
    }
    [self.clientModule tokenRefresh:command.arguments callbackId:command.callbackId];
}

- (void)disconnect:(CDVInvokedUrlCommand *)command {
    if (![self clientModuleValid:command]) {
        return;
    }
    [self.clientModule disconnect:command.arguments callbackId:command.callbackId];
}

- (void)call:(CDVInvokedUrlCommand *)command {
    if (![self clientModuleValid:command]) {
        return;
    }
    [self.clientModule call:command.arguments callbackId:command.callbackId];
}

- (void)hangup:(CDVInvokedUrlCommand *)command {
    VICallModule *callModule = [self.callManager checkCallEvent:command.arguments callbackId:command.callbackId];
    if (!callModule) {
        return;
    }
    [callModule hangup:command.arguments callbackId:command.callbackId];
}

- (void)answer:(CDVInvokedUrlCommand *)command {
    VICallModule *callModule = [self.callManager checkCallEvent:command.arguments callbackId:command.callbackId];
    if (!callModule) {
        return;
    }
    [callModule answer:command.arguments callbackId:command.callbackId];
}

- (void)decline:(CDVInvokedUrlCommand *)command {
    VICallModule *callModule = [self.callManager checkCallEvent:command.arguments callbackId:command.callbackId];
    if (!callModule) {
        return;
    }
    [callModule decline:command.arguments callbackId:command.callbackId];
}

- (void)reject:(CDVInvokedUrlCommand *)command {
    VICallModule *callModule = [self.callManager checkCallEvent:command.arguments callbackId:command.callbackId];
    if (!callModule) {
        return;
    }
    [callModule reject:command.arguments callbackId:command.callbackId];
}

- (void)sendAudio:(CDVInvokedUrlCommand *)command {
    VICallModule *callModule = [self.callManager checkCallEvent:command.arguments callbackId:command.callbackId];
    if (!callModule) {
        return;
    }
    [callModule sendAudio:command.arguments callbackId:command.callbackId];
}

- (void)sendTone:(CDVInvokedUrlCommand *)command {
    VICallModule *callModule = [self.callManager checkCallEvent:command.arguments callbackId:command.callbackId];
    if (!callModule) {
        return;
    }
    [callModule sendTone:command.arguments callbackId:command.callbackId];
}

- (void)sendMessage:(CDVInvokedUrlCommand *)command {
    VICallModule *callModule = [self.callManager checkCallEvent:command.arguments callbackId:command.callbackId];
    if (!callModule) {
        return;
    }
    [callModule sendMessage:command.arguments callbackId:command.callbackId];
}

- (void)sendInfo:(CDVInvokedUrlCommand *)command {
    VICallModule *callModule = [self.callManager checkCallEvent:command.arguments callbackId:command.callbackId];
    if (!callModule) {
        return;
    }
    [callModule sendInfo:command.arguments callbackId:command.callbackId];
}

- (void)hold:(CDVInvokedUrlCommand *)command {
    VICallModule *callModule = [self.callManager checkCallEvent:command.arguments callbackId:command.callbackId];
    if (!callModule) {
        return;
    }
    [callModule hold:command.arguments callbackId:command.callbackId];
}

- (BOOL)clientModuleValid:(CDVInvokedUrlCommand *)command {
    if (!self.clientModule) {
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR]
        callbackId:command.callbackId];
        return NO;
    }
    return YES;
}

@end
