/*
* Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
*/

#import <Cordova/CDV.h>

@interface VoximplantPlugin : CDVPlugin


- (void)initClient:(CDVInvokedUrlCommand *)command;
- (void)connect:(CDVInvokedUrlCommand *)command;
- (void)login:(CDVInvokedUrlCommand *)command;
- (void)getClientState:(CDVInvokedUrlCommand *)command;
- (void)loginWithToken:(CDVInvokedUrlCommand *)command;
- (void)loginWithOneTimeKey:(CDVInvokedUrlCommand *)command;
- (void)requestOneTimeKey:(CDVInvokedUrlCommand *)command;
- (void)tokenRefresh:(CDVInvokedUrlCommand *)command;
- (void)disconnect:(CDVInvokedUrlCommand *)command;
- (void)call:(CDVInvokedUrlCommand *)command;
- (void)hangup:(CDVInvokedUrlCommand *)command;
- (void)answer:(CDVInvokedUrlCommand *)command;
- (void)decline:(CDVInvokedUrlCommand *)command;
- (void)reject:(CDVInvokedUrlCommand *)command;
- (void)sendAudio:(CDVInvokedUrlCommand *)command;
- (void)sendTone:(CDVInvokedUrlCommand *)command;
- (void)sendMessage:(CDVInvokedUrlCommand *)command;
- (void)sendInfo:(CDVInvokedUrlCommand *)command;
- (void)hold:(CDVInvokedUrlCommand *)command;

@end
