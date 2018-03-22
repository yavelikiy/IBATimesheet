//
//  WLClientRN.h
//  IBATimesheet
//
//  Created by NG on 2/16/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#ifndef WLClientRN_h
#define WLClientRN_h

#import <React/RCTBridgeModule.h>
#import <IBMMobileFirstPlatformFoundation/IBMMobileFirstPlatformFoundation.h>

@interface WLClientRN : NSObject<RCTBridgeModule>
-(void)registerChallengeHandler;
@end

#endif /* WLClientRN_h */
