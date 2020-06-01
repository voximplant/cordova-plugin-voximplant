/*
* Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
*/

#import "VoximplantCallManager.h"

@interface VoximplantCallManager()
@property (nonatomic, weak) id <CDVCommandDelegate> commandDelegate;
@property(nonatomic, strong) NSMutableDictionary *callModules;

@end

@implementation VoximplantCallManager

- (instancetype)initWithCommandDelegate:(id <CDVCommandDelegate>)delegate {
    self = [super init];
    if (self) {
        self.callModules = [NSMutableDictionary new];
        self.commandDelegate = delegate;
    }
    return self;
}

- (VICallModule *)checkCallEvent:(NSArray *)arguments callbackId:(NSString *)callbackId {
    if (!arguments || arguments.count == 0) {
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Invalid arguments"] callbackId:callbackId];
        return nil;
    }
    NSString *callId = [arguments objectAtIndex:0];
    if (!callId) {
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Invalid arguments"] callbackId:callbackId];
        return nil;
    }
    return [self.callModules objectForKey:callId];
}

- (void)callHasEnded:(NSString *)callId {
    [self.callModules removeObjectForKey:callId];
}

- (void)addNewCall:(VICallModule *)callModule callId:(NSString *)callId {
    [self.callModules setObject:callModule forKey:callId];
}

@end

