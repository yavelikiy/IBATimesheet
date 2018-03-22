//
//  SecurityCheckChallengeHandlerEventEmitter.h
//  IBATimesheet
//
//  Created by NG on 3/21/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#ifndef SecurityCheckChallengeHandlerEventEmitter_h
#define SecurityCheckChallengeHandlerEventEmitter_h

#import "React/RCTEventEmitter.h"
#import "React/RCTBridgeModule.h"


@interface SecurityCheckChallengeHandlerEventEmitter : RCTEventEmitter <RCTBridgeModule>
+ (id)allocWithZone:(NSZone *)zone;
- (void)handleLoginNotification:(NSNotification *)notification;
@end

#endif /* SecurityCheckChallengeHandlerEventEmitter_h */
