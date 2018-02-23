//
//  SecurityCheckChallengeHandler.m
//  IBATimesheet
//
//  Created by NG on 2/23/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "SecurityCheckChallengeHandler.h"

@implementation SecurityCheckChallengeHandler
RCT_EXPORT_MODULE();

- (instancetype)init
{
  self = [super init];
  if (self) {
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(sendHandleChallenge:) name:@"handleChallenge" object:nil];
  }
  return self;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"handleChallenge"];
}

-(void) sendHandleChallenge:(NSNotification*)notification{
  [self sendEventWithName:@"handleChallenge" body:notification.object];
}

@end

