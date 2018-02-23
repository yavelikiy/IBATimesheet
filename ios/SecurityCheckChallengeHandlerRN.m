//
//  SecurityCheckChallengeHandlerRN.m
//  IBATimesheet
//
//  Created by NG on 2/16/18.
//  Copyright © 2018 Facebook. All rights reserved.
//
#import "SecurityCheckChallengeHandlerRN.h"
#import "React/RCTEventDispatcher.h"
#import "SecurityCheckChallengeHandler.h"
#import <React/RCTLog.h>

static NSString *const securityCheck = @"securityCheck";

@implementation SecurityCheckChallengeHandlerRN

-(void) handleChallenge:(NSDictionary *)challenge {
  [challenge setValue:self.securityCheck forKey:@"securityCheck"];
  [[NSNotificationCenter defaultCenter] postNotificationName:@"handleChallenge" object:challenge];
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(cancel)
{
  RCTLogInfo(@"Pretending to cancel");
  BaseChallengeHandler *challenge = [[WLClient sharedInstance] getChallengeHandlerBySecurityCheck:securityCheck];
  if (challenge != nil) {
    [challenge cancel];
  }
}

RCT_EXPORT_METHOD(logout)
{
  RCTLogInfo(@"Pretending to logout");
}

RCT_EXPORT_METHOD(login:(NSDictionary *)credentials)
{
  RCTLogInfo(@"Pretending to login");
}


RCT_EXPORT_METHOD(obtainAccessToken)
{
  RCTLogInfo(@"Pretending to obtain token");
}
RCT_EXPORT_METHOD(submitChallangeAnswer:(NSDictionary *)answer)
{
  RCTLogInfo(@"Pretending to submit challange %@", answer);
  BaseChallengeHandler *challenge = [[WLClient sharedInstance] getChallengeHandlerBySecurityCheck:securityCheck];
  if (challenge != nil) {
    [(SecurityCheckChallengeHandler *)(challenge) submitChallengeAnswer:answer];
  }
}

@end
