//
//  SecurityCheckChallengeHandlerEventEmitter.m
//  IBATimesheet
//
//  Created by NG on 3/21/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "SecurityCheckChallengeHandlerEventEmitter.h"




@implementation SecurityCheckChallengeHandlerEventEmitter
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
  return @[@"handleChallenge",@""];
}

-(void) sendEvent:(NSString *)name params:(NSDictionary *)params{
  [self sendEventWithName:name body:params];
}

@end
