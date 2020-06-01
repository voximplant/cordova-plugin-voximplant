/*
* Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
*/

#import <Foundation/Foundation.h>
#import "VICallModule.h"

NS_ASSUME_NONNULL_BEGIN

@interface VoximplantCallManager : NSObject
- (instancetype)initWithCommandDelegate:(id <CDVCommandDelegate>)delegate;
- (VICallModule *)checkCallEvent:(NSArray *)arguments callbackId:(NSString *)callbackId;

- (void)callHasEnded:(NSString *)callId;

- (void)addNewCall:(VICallModule *)callModule callId:(NSString *)callId;

@end

NS_ASSUME_NONNULL_END
