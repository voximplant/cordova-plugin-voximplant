/*
* Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
*/

#import <VoxImplantSDK/VoxImplantSDK.h>
#import <Cordova/CDV.h>

@class VoximplantCallManager;

@interface VICallModule : NSObject<VICallDelegate, VIEndpointDelegate>
- (instancetype)initWithCommandDelegate:(id <CDVCommandDelegate>)delegate call:(VICall *)call callManager:(VoximplantCallManager *)callManager;
- (void)startCall:(NSString *)callbackId;
- (void)hangup:(NSArray *)arguments callbackId:(NSString *)callbackId;
- (void)answer:(NSArray *)arguments callbackId:(NSString *)callbackId;
- (void)decline:(NSArray *)arguments callbackId:(NSString *)callbackId;
- (void)reject:(NSArray *)arguments callbackId:(NSString *)callbackId;
- (void)sendAudio:(NSArray *)arguments callbackId:(NSString *)callbackId;
- (void)sendTone:(NSArray *)arguments callbackId:(NSString *)callbackId;
- (void)sendMessage:(NSArray *)arguments callbackId:(NSString *)callbackId;
- (void)sendInfo:(NSArray *)arguments callbackId:(NSString *)callbackId;
- (void)hold:(NSArray *)arguments callbackId:(NSString *)callbackId;

@end
