/*
* Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
*/

#import "VIClientModule.h"
#import "VICallModule.h"

@interface VIClientModule()
@property (nonatomic, weak) id <CDVCommandDelegate> commandDelegate;
@property (nonatomic, strong) VIClient *client;
@property (nonatomic, strong) NSString *connectCallbackId;
@property (nonatomic, strong) VoximplantCallManager *callManager;
@end


@implementation VIClientModule

- (instancetype)initWithCommandDelegate:(id <CDVCommandDelegate>)delegate callManager:(VoximplantCallManager *)callManager {
    self = [super init];
    if (self) {
        self.commandDelegate = delegate;
        self.callManager = callManager;
    }

    return self;
}

- (NSDictionary *)convertAuthParamsToDictionary:(VIAuthParams *)authParams {
    NSMutableDictionary *dictionary = [NSMutableDictionary new];
    [dictionary setValue:@((NSInteger)authParams.accessExpire) forKey:@"accessExpire"];
    [dictionary setValue:authParams.accessToken forKey:@"accessToken"];
    [dictionary setValue:@((NSInteger)authParams.refreshExpire) forKey:@"refreshExpire"];
    [dictionary setValue:authParams.refreshToken forKey:@"refreshToken"];
    return dictionary;
}

- (NSString *)convertClientStateToString:(VIClientState)state {
    switch (state) {
        case VIClientStateConnecting:
            return @"connecting";
        case VIClientStateConnected:
            return @"connected";
        case VIClientStateLoggingIn:
            return @"logging_in";
        case VIClientStateLoggedIn:
            return @"logged_in";
        case VIClientStateDisconnected:
        default:
            return @"disconnected";
    }
}


- (void)initClient:(NSArray *)arguments callbackId:(NSString *)callbackId {
    self.client = [[VIClient alloc] initWithDelegateQueue:dispatch_get_main_queue()];
    self.client.sessionDelegate = self;
    self.client.callManagerDelegate = self;
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:callbackId];
}

- (void)connect:(NSArray *)arguments callbackId:(NSString *)callbackId {
    if (arguments && arguments.count > 0) {
        NSDictionary *args = [arguments objectAtIndex:0];
        NSNumber* connectivityCheck = (NSNumber *)[args objectForKey:@"connectivityCheck"];
        NSArray *servers = [args objectForKey:@"servers"];
        self.connectCallbackId = callbackId;
        [self.client connectWithConnectivityCheck:[connectivityCheck boolValue] gateways:servers];
    }
}

- (void)login:(NSArray *)arguments callbackId:(NSString *)callbackId {
    if (arguments && arguments.count > 0) {
        NSDictionary *args = [arguments objectAtIndex:0];
        NSString *username = [args objectForKey:@"username"];
        NSString *passwrod = [args objectForKey:@"password"];
        [self.client loginWithUser:username password:passwrod success:^(NSString * _Nonnull displayName, VIAuthParams * _Nonnull authParams) {
            NSMutableDictionary *params = [NSMutableDictionary new];
            [params setObject:displayName forKey:@"displayName"];
            [params setObject:[self convertAuthParamsToDictionary:authParams] forKey:@"tokens"];
            CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:params];
            [self.commandDelegate sendPluginResult:result callbackId:callbackId];
        } failure:^(NSError * _Nonnull error) {
            NSMutableDictionary *params = [NSMutableDictionary new];
            [params setObject:@(error.code) forKey:@"code"];
            CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:params];
            [self.commandDelegate sendPluginResult:result callbackId:callbackId];
        }];
    }
}

- (void)getClientState:(NSArray *)arguments callbackId:(NSString *)callbackId {
    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[self convertClientStateToString:self.client.clientState]];
    [self.commandDelegate sendPluginResult:result callbackId:callbackId];
}

- (void)loginWithToken:(NSArray *)arguments callbackId:(NSString *)callbackId {
    if (arguments && arguments.count > 0) {
        NSDictionary *args = [arguments objectAtIndex:0];
        NSString *username = [args objectForKey:@"username"];
        NSString *token = [args objectForKey:@"token"];
        [self.client loginWithUser:username token:token success:^(NSString * _Nonnull displayName, VIAuthParams * _Nonnull authParams) {
            NSMutableDictionary *params = [NSMutableDictionary new];
            [params setObject:displayName forKey:@"displayName"];
            [params setObject:[self convertAuthParamsToDictionary:authParams] forKey:@"tokens"];
            CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:params];
            [self.commandDelegate sendPluginResult:result callbackId:callbackId];
        } failure:^(NSError * _Nonnull error) {
            NSMutableDictionary *params = [NSMutableDictionary new];
            [params setObject:@(error.code) forKey:@"code"];
            CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:params];
            [self.commandDelegate sendPluginResult:result callbackId:callbackId];
        }];
    }
}

- (void)loginWithOneTimeKey:(NSArray *)arguments callbackId:(NSString *)callbackId {
    if (arguments && arguments.count > 0) {
        NSDictionary *args = [arguments objectAtIndex:0];
        NSString *username = [args objectForKey:@"username"];
        NSString *hash = [args objectForKey:@"hash"];
        [self.client loginWithUser:username oneTimeKey:hash success:^(NSString * _Nonnull displayName, VIAuthParams * _Nonnull authParams) {
            NSMutableDictionary *params = [NSMutableDictionary new];
            [params setObject:displayName forKey:@"displayName"];
            [params setObject:[self convertAuthParamsToDictionary:authParams] forKey:@"tokens"];
            CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:params];
            [self.commandDelegate sendPluginResult:result callbackId:callbackId];
        } failure:^(NSError * _Nonnull error) {
            NSMutableDictionary *params = [NSMutableDictionary new];
            [params setObject:@(error.code) forKey:@"code"];
            CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:params];
            [self.commandDelegate sendPluginResult:result callbackId:callbackId];
        }];
    }
}

- (void)requestOneTimeKey:(NSArray *)arguments callbackId:(NSString *)callbackId {
    if (arguments && arguments.count > 0) {
        NSString *username = [arguments objectAtIndex:0];
        [self.client requestOneTimeKeyWithUser:username result:^(NSString * _Nullable oneTimeKey, NSError * _Nullable error) {
            if (error) {
                NSMutableDictionary *params = [NSMutableDictionary new];
                [params setObject:@(error.code) forKey:@"code"];
                CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:params];
                [self.commandDelegate sendPluginResult:result callbackId:callbackId];
            } else {
                NSMutableDictionary *params = [NSMutableDictionary new];
                [params setObject:@(NO) forKey:@"result"];
                [params setObject:@(302) forKey:@"code"];
                [params setObject:oneTimeKey forKey:@"key"];
                CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:params];
                [self.commandDelegate sendPluginResult:result callbackId:callbackId];
            }
        }];
    }
}

- (void)tokenRefresh:(NSArray *)arguments callbackId:(NSString *)callbackId {
    if (arguments && arguments.count > 0) {
        NSDictionary *args = [arguments objectAtIndex:0];
        NSString *username = [args objectForKey:@"username"];
        NSString *refreshToken = [args objectForKey:@"token"];
        [self.client refreshTokenWithUser:username token:refreshToken result:^(VIAuthParams * _Nullable authParams, NSError * _Nullable error) {
            if (error) {
                NSMutableDictionary *params = [NSMutableDictionary new];
                [params setObject:@(error.code) forKey:@"code"];
                CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:params];
                [self.commandDelegate sendPluginResult:result callbackId:callbackId];
            } else {
                NSMutableDictionary *params = [NSMutableDictionary new];
                [params setObject:[self convertAuthParamsToDictionary:authParams] forKey:@"tokens"];
                CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:params];
                [self.commandDelegate sendPluginResult:result callbackId:callbackId];
            }
        }];
    }
}

- (void)disconnect:(NSArray *)arguments callbackId:(NSString *)callbackId {
    [self.client disconnect];
    self.connectCallbackId = callbackId;
}

- (void)call:(NSArray *)arguments callbackId:(NSString *)callbackId {
    if (arguments && arguments.count > 1) {
        NSString *number = [arguments objectAtIndex:0];
        NSDictionary *args = [arguments objectAtIndex:1];
        NSString *customData = [args objectForKey:@"customData"];
        NSDictionary *videoParams = [args objectForKey:@"video"] != [NSNull null] ? [args objectForKey:@"video"] : nil;
        NSNumber *sendVideo = [videoParams objectForKey:@"sendVideo"];
        NSNumber *receiveVideo = [videoParams objectForKey:@"receiveVideo"];
        NSDictionary *extraHeaders = [args objectForKey:@"extraHeaders"] != [NSNull null] ? [args objectForKey:@"extraHeaders"] : nil;
        VICallSettings *callSettings = [[VICallSettings alloc] init];
        callSettings.videoFlags = [VIVideoFlags videoFlagsWithReceiveVideo:[receiveVideo boolValue] sendVideo:[sendVideo boolValue]];
        callSettings.customData = customData;
        callSettings.extraHeaders = extraHeaders;
        VICall *call = [self.client call:number settings:callSettings];
        VICallModule *callModule = [[VICallModule alloc] initWithCommandDelegate:self.commandDelegate call:call callManager:self.callManager];
        [callModule startCall:callbackId];
    }
}


- (void)client:(nonnull VIClient *)client sessionDidFailConnectWithError:(nonnull NSError *)error {
    if (self.connectCallbackId) {
        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.localizedDescription];
        [self.commandDelegate sendPluginResult:result callbackId:self.connectCallbackId];
        self.connectCallbackId = nil;
    }
}

- (void)clientSessionDidConnect:(nonnull VIClient *)client {
    if (self.connectCallbackId) {
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:self.connectCallbackId];
        self.connectCallbackId = nil;
    }
}

- (void)clientSessionDidDisconnect:(nonnull VIClient *)client {
    if (self.connectCallbackId) {
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:self.connectCallbackId];
        self.connectCallbackId = nil;
    }
}

- (void)client:(nonnull VIClient *)client didReceiveIncomingCall:(nonnull VICall *)call withIncomingVideo:(BOOL)video headers:(nullable NSDictionary *)headers {
    VICallModule *callModule = [[VICallModule alloc] initWithCommandDelegate:self.commandDelegate call:call callManager:self.callManager];
    [self.callManager addNewCall:callModule callId:call.callId];
    NSMutableDictionary *params = [NSMutableDictionary new];
    [params setObject:call.callId forKey:@"callId"];
    VIEndpoint *endpoint = call.endpoints.firstObject;
    if (endpoint) {
        [params setObject:endpoint.endpointId forKey:@"endpointId"];
        [params setObject:endpoint.userDisplayName forKey:@"displayName"];
        [params setObject:endpoint.sipURI forKey:@"sipUri"];
        [params setObject:endpoint.user forKey:@"userName"];
    }
    [params setObject:@(video) forKey:@"video"];
    [params setObject:headers forKey:@"headers"];
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:params options:(NSJSONWritingOptions)0 error:&error];
    if (!error) {
        NSString *string = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSString *event = [NSString stringWithFormat:@"javascript:window.Voximplant.Client.prototype._onEvent('IncomingCall',%@)", string];
        [self.commandDelegate evalJs:event];
    }
}

@end
