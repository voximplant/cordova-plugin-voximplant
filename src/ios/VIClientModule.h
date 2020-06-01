/*
* Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
*/

#import <VoxImplantSDK/VoxImplantSDK.h>
#import <Cordova/CDV.h>
#import "VoximplantCallManager.h"

@interface VIClientModule : NSObject<VIClientSessionDelegate, VIClientCallManagerDelegate>
- (instancetype)initWithCommandDelegate:(id <CDVCommandDelegate>)delegate callManager:(VoximplantCallManager *)callManager;

- (void)initClient:(NSArray *)arguments callbackId:(NSString *)callbackId;
- (void)connect:(NSArray *)arguments callbackId:(NSString *)callbackId;
- (void)login:(NSArray *)arguments callbackId:(NSString *)callbackId;
- (void)getClientState:(NSArray *)arguments callbackId:(NSString *)callbackId;
- (void)loginWithToken:(NSArray *)arguments callbackId:(NSString *)callbackId;
- (void)loginWithOneTimeKey:(NSArray *)arguments callbackId:(NSString *)callbackId;
- (void)requestOneTimeKey:(NSArray *)arguments callbackId:(NSString *)callbackId;
- (void)tokenRefresh:(NSArray *)arguments callbackId:(NSString *)callbackId;
- (void)disconnect:(NSArray *)arguments callbackId:(NSString *)callbackId;
- (void)call:(NSArray *)arguments callbackId:(NSString *)callbackId;
@end
