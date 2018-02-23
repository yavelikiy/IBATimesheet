//
//  SecurityCheckChallengeHandler.h
//  IBATimesheet
//
//  Created by NG on 2/23/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#ifndef SecurityCheckChallengeHandler_h
#define SecurityCheckChallengeHandler_h


#import "React/RCTEventEmitter.h"
#import "React/RCTBridgeModule.h"

@interface SecurityCheckChallengeHandler : RCTEventEmitter <RCTBridgeModule>
-(void) sendHandleChallenge:(NSNotification *) notification;
@end


#endif /* SecurityCheckChallengeHandler_h */
