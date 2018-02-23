//
//  SecurityCheckChallengeHandlerRN.h
//  IBATimesheet
//
//  Created by NG on 2/16/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#ifndef SecurityCheckChallengeHandlerRN_h
#define SecurityCheckChallengeHandlerRN_h

#import <IBMMobileFirstPlatformFoundation/IBMMobileFirstPlatformFoundation.h>
#import "React/RCTBridge.h"
#import "React/RCTEventEmitter.h"

@interface SecurityCheckChallengeHandlerRN : SecurityCheckChallengeHandler <RCTBridgeModule>
@end

#endif /* SecurityCheckChallengeHandlerRN_h */
