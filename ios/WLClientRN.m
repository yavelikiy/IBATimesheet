//
//  WLClentRN.m
//  IBATimesheet
//
//  Created by NG on 2/16/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "WLClientRN.h"
#import <React/RCTLog.h>
#import "SecurityCheckChallengeHandlerRN.h"

@implementation WLClientRN

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(registerChallengeHandler:(NSString *)securityCheck)
{
  BaseChallengeHandler *existingChallenge = [[WLClient sharedInstance] getChallengeHandlerBySecurityCheck:securityCheck];
  
  if (existingChallenge == nil) {
    SecurityCheckChallengeHandlerRN *challenge = [[SecurityCheckChallengeHandlerRN alloc] initWithSecurityCheck:securityCheck];
    [[WLClient sharedInstance] registerChallengeHandler:challenge];
  }
}

@end
