//
//  SecurityCheckChallengeHandlerEventEmitter.m
//  IBATimesheet
//
//  Created by NG on 3/21/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "SecurityCheckChallengeHandlerEventEmitter.h"


static NSString *const kLoginNotification = @"RCTLoginNotification";

@implementation SecurityCheckChallengeHandlerEventEmitter
RCT_EXPORT_MODULE();

-(instancetype)init{
  self = [super init];
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(handleLoginNotification:)
                                               name:kLoginNotification
                                             object:nil];
  return self;
}

+ (id)allocWithZone:(NSZone *)zone {
  static SecurityCheckChallengeHandlerEventEmitter *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [super allocWithZone:zone];
  });
  return sharedInstance;
}

//+ (BOOL)requiresMainQueueSetup{
//  return [super requiresMainQueueSetup];
//}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"LOGIN_REQUIRED",@"LOGIN_SUCCESS",@"LOGIN_FAILED",@"LOGOUT_SUCCESS",@"LOGOUT_FAILURE",@"CONNECTION_ERROR"];
}

- (void)handleLoginNotification:(NSNotification *)notification
{
  [self sendEventWithName:notification.userInfo[@"name"] body:notification.userInfo];
}

@end
