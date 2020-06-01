/*
* Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
*/


#import "VICallModule.h"
#import "VoximplantCallManager.h"


@interface VICallModule()
@property (nonatomic, weak) id <CDVCommandDelegate> commandDelegate;
@property (nonatomic, strong) VoximplantCallManager *callManager;
@property (nonatomic, strong) VICall *call;
@end

@implementation VICallModule

- (instancetype)initWithCommandDelegate:(id <CDVCommandDelegate>)delegate call:(VICall *)call callManager:(VoximplantCallManager *)callManager{
    self = [super init];
    if (self) {
        self.commandDelegate = delegate;
        self.call = call;
        self.callManager = callManager;
        [self.call addDelegate:self];
    }
    return self;
}

- (void)startCall:(NSString *)callbackId {
    [self.call start];
    [self.callManager addNewCall:self callId:self.call.callId];
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:self.call.callId] callbackId:callbackId];
}

- (void)hangup:(NSArray *)arguments callbackId:(NSString *)callbackId {
    if (arguments && arguments.count > 1) {
        NSDictionary *headers = [arguments objectAtIndex:1];
        [self.call hangupWithHeaders:headers];
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:callbackId];
    }
}

- (void)answer:(NSArray *)arguments callbackId:(NSString *)callbackId {
    if (arguments && arguments.count > 1) {
        NSDictionary *args = [arguments objectAtIndex:1];
        NSString *customData = [args objectForKey:@"customData"] != [NSNull null] ? [args objectForKey:@"customData"] : nil;
        NSDictionary *videoParams = [args objectForKey:@"video"] != [NSNull null] ? [args objectForKey:@"video"] : nil;
        NSNumber *sendVideo = [videoParams objectForKey:@"sendVideo"];
        NSNumber *receiveVideo = [videoParams objectForKey:@"receiveVideo"];
        NSDictionary *extraHeaders = [args objectForKey:@"extraHeaders"] != [NSNull null] ? [args objectForKey:@"extraHeaders"] : nil;
        VICallSettings *callSettings = [[VICallSettings alloc] init];
        callSettings.videoFlags = [VIVideoFlags videoFlagsWithReceiveVideo:[receiveVideo boolValue] sendVideo:[sendVideo boolValue]];
        callSettings.customData = customData;
        callSettings.extraHeaders = extraHeaders;
        [self.call answerWithSettings:callSettings];
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:callbackId];
    }
}

- (void)decline:(NSArray *)arguments callbackId:(NSString *)callbackId {
    if (arguments && arguments.count > 1) {
        NSDictionary *headers = [arguments objectAtIndex:1] != [NSNull null] ? [arguments objectAtIndex:1] : nil;
        [self.call rejectWithMode:VIRejectModeDecline headers:headers];
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:callbackId];
    }
}

- (void)reject:(NSArray *)arguments callbackId:(NSString *)callbackId {
    if (arguments && arguments.count > 1) {
        NSDictionary *headers = [arguments objectAtIndex:1] != [NSNull null] ? [arguments objectAtIndex:1] : nil;
        [self.call rejectWithMode:VIRejectModeBusy headers:headers];
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:callbackId];
    }
}

- (void)sendAudio:(NSArray *)arguments callbackId:(NSString *)callbackId {
    if (arguments && arguments.count > 1) {
        NSNumber *enable = [arguments objectAtIndex:1];
        self.call.sendAudio = [enable boolValue];
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:callbackId];
    }
}

- (void)sendTone:(NSArray *)arguments callbackId:(NSString *)callbackId {
    if (arguments && arguments.count > 1) {
        NSString *dtmf = [arguments objectAtIndex:1];
        [self.call sendDTMF:dtmf];
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:callbackId];
    }
}

- (void)sendMessage:(NSArray *)arguments callbackId:(NSString *)callbackId {
    if (arguments && arguments.count > 1) {
        NSString *message = [arguments objectAtIndex:1];
        [self.call sendMessage:message];
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:callbackId];
    }
}

- (void)sendInfo:(NSArray *)arguments callbackId:(NSString *)callbackId {
    if (arguments && arguments.count > 1) {
        NSDictionary *args = [arguments objectAtIndex:1];
        NSString *mimeType = [args objectForKey:@"type"];
        NSString *body = [args objectForKey:@"body"];
        NSDictionary *headers = [args objectForKey:@"headers"] != [NSNull null] ? [args objectForKey:@"headers"] : nil;
        [self.call sendInfo:body mimeType:mimeType headers:headers];
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:callbackId];
    }
}

- (void)hold:(NSArray *)arguments callbackId:(NSString *)callbackId {
    if (arguments && arguments.count > 1) {
        NSNumber *enable = [arguments objectAtIndex:1];
        [self.call setHold:[enable boolValue] completion:^(NSError * _Nullable error) {
            if (error) {
                [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.localizedDescription] callbackId:callbackId];
            } else {
                [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:callbackId];
            }
        }];
    }
}


- (void)callDidStartAudio:(VICall *)call {
    NSMutableDictionary *params = [NSMutableDictionary new];
    [params setObject:self.call.callId forKey:@"callId"];
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:params options:(NSJSONWritingOptions)0 error:&error];
    if (!error) {
        NSString *string = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSString *event = [NSString stringWithFormat:@"javascript:window.Voximplant.Client.prototype._onEvent('CallProgressToneStop',%@)", string];
        [self.commandDelegate evalJs:event];
    }
}

- (void)call:(VICall *)call didAddEndpoint:(VIEndpoint *)endpoint {
    endpoint.delegate = self;
    NSMutableDictionary *params = [NSMutableDictionary new];
    [params setObject:self.call.callId forKey:@"callId"];
    [params setObject:endpoint.endpointId forKey:@"endpointId"];
    if (endpoint.userDisplayName) {
        [params setObject:endpoint.userDisplayName forKey:@"displayName"];
    }
    if (endpoint.sipURI) {
        [params setObject:endpoint.sipURI forKey:@"sipUri"];
    }
    if (endpoint.user) {
        [params setObject:endpoint.user forKey:@"userName"];
    }
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:params options:(NSJSONWritingOptions)0 error:&error];
    if (!error) {
        NSString *string = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSString *event = [NSString stringWithFormat:@"javascript:window.Voximplant.Client.prototype._onEvent('CallEndpointAdded',%@)", string];
        [self.commandDelegate evalJs:event];
    }
}

- (void)call:(VICall *)call didConnectWithHeaders:(NSDictionary *)headers {
    NSMutableDictionary *params = [NSMutableDictionary new];
    [params setObject:self.call.callId forKey:@"callId"];
    if (headers) {
        [params setObject:headers forKey:@"headers"];
    }
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:params options:(NSJSONWritingOptions)0 error:&error];
    if (!error) {
        NSString *string = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSString *event = [NSString stringWithFormat:@"javascript:window.Voximplant.Client.prototype._onEvent('CallConnected',%@)", string];
        [self.commandDelegate evalJs:event];
    }
}

- (void)call:(VICall *)call startRingingWithHeaders:(NSDictionary *)headers {
    NSMutableDictionary *params = [NSMutableDictionary new];
    [params setObject:self.call.callId forKey:@"callId"];
    if (headers) {
        [params setObject:headers forKey:@"headers"];
    }
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:params options:(NSJSONWritingOptions)0 error:&error];
    if (!error) {
        NSString *string = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSString *event = [NSString stringWithFormat:@"javascript:window.Voximplant.Client.prototype._onEvent('CallProgressToneStart',%@)", string];
        [self.commandDelegate evalJs:event];
    }
}

- (void)call:(VICall *)call didFailWithError:(NSError *)error headers:(NSDictionary *)headers {
    [self.call removeDelegate:self];
    [self.callManager callHasEnded:call.callId];
    NSMutableDictionary *params = [NSMutableDictionary new];
    [params setObject:self.call.callId forKey:@"callId"];
    [params setObject:@(error.code) forKey:@"code"];
    [params setObject:error.localizedDescription forKey:@"reason"];
    if (headers) {
        [params setObject:headers forKey:@"headers"];
    }
    NSError *jsonError;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:params options:(NSJSONWritingOptions)0 error:&jsonError];
    if (!jsonError) {
        NSString *string = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSString *event = [NSString stringWithFormat:@"javascript:window.Voximplant.Client.prototype._onEvent('CallFailed',%@)", string];
        [self.commandDelegate evalJs:event];
    }
}

- (void)call:(VICall *)call didReceiveMessage:(NSString *)message headers:(NSDictionary *)headers {
    NSMutableDictionary *params = [NSMutableDictionary new];
    [params setObject:self.call.callId forKey:@"callId"];
    [params setObject:message forKey:@"text"];
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:params options:(NSJSONWritingOptions)0 error:&error];
    if (!error) {
        NSString *string = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSString *event = [NSString stringWithFormat:@"javascript:window.Voximplant.Client.prototype._onEvent('CallMessageReceived',%@)", string];
        [self.commandDelegate evalJs:event];
    }
}

- (void)call:(VICall *)call didReceiveInfo:(NSString *)body type:(NSString *)type headers:(NSDictionary *)headers {
    NSMutableDictionary *params = [NSMutableDictionary new];
    [params setObject:self.call.callId forKey:@"callId"];
    [params setObject:type forKey:@"mimeType"];
    [params setObject:body forKey:@"body"];
    if (headers) {
        [params setObject:headers forKey:@"headers"];
    }
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:params options:(NSJSONWritingOptions)0 error:&error];
    if (!error) {
        NSString *string = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSString *event = [NSString stringWithFormat:@"javascript:window.Voximplant.Client.prototype._onEvent('CallInfoReceived',%@)", string];
        [self.commandDelegate evalJs:event];
    }
}

- (void)call:(VICall *)call didDisconnectWithHeaders:(NSDictionary *)headers answeredElsewhere:(NSNumber *)answeredElsewhere {
    [self.call removeDelegate:self];
    [self.callManager callHasEnded:call.callId];
    NSMutableDictionary *params = [NSMutableDictionary new];
    [params setObject:self.call.callId forKey:@"callId"];
    [params setObject:answeredElsewhere forKey:@"answeredElsewhere"];
    if (headers) {
        [params setObject:headers forKey:@"headers"];
    }
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:params options:(NSJSONWritingOptions)0 error:&error];
    if (!error) {
        NSString *string = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSString *event = [NSString stringWithFormat:@"javascript:window.Voximplant.Client.prototype._onEvent('CallDisconnected',%@)", string];
        [self.commandDelegate evalJs:event];
    }
}

- (void)endpointInfoDidUpdate:(VIEndpoint *)endpoint {
    NSMutableDictionary *params = [NSMutableDictionary new];
    [params setObject:self.call.callId forKey:@"callId"];
    [params setObject:endpoint.endpointId forKey:@"endpointId"];
    if (endpoint.userDisplayName) {
        [params setObject:endpoint.userDisplayName forKey:@"displayName"];
    }
    if (endpoint.sipURI) {
        [params setObject:endpoint.sipURI forKey:@"sipUri"];
    }
    if (endpoint.user) {
        [params setObject:endpoint.user forKey:@"userName"];
    }
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:params options:(NSJSONWritingOptions)0 error:&error];
    if (!error) {
        NSString *string = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSString *event = [NSString stringWithFormat:@"javascript:window.Voximplant.Client.prototype._onEvent('EndpointInfoUpdated',%@)", string];
        [self.commandDelegate evalJs:event];
    }
}

- (void)endpointDidRemove:(VIEndpoint *)endpoint {
    endpoint.delegate = nil;
    NSMutableDictionary *params = [NSMutableDictionary new];
    [params setObject:self.call.callId forKey:@"callId"];
    [params setObject:endpoint.endpointId forKey:@"endpointId"];
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:params options:(NSJSONWritingOptions)0 error:&error];
    if (!error) {
        NSString *string = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        NSString *event = [NSString stringWithFormat:@"javascript:window.Voximplant.Client.prototype._onEvent('EndpointRemoved',%@)", string];
        [self.commandDelegate evalJs:event];
    }
}

@end
