//
//  SecurityCheckChallengeHandlerRN.m
//  IBATimesheet
//
//  Created by NG on 2/16/18.
//  Copyright © 2018 Facebook. All rights reserved.
//
#import "SecurityCheckChallengeHandlerRN.h"

//#import "React/RCTEventDispatcher.h"

static NSString *const securityCheck = @"dominoSecurityCheck";

@implementation SecurityCheckChallengeHandlerRN{
  SecurityCheckChallengeHandlerEventEmitter* emitter;
  Boolean isChallenged;
}

- (instancetype)init
{
  emitter = [[SecurityCheckChallengeHandlerEventEmitter alloc] init];
  isChallenged = false;
  return self;
}

-(void) handleChallenge:(NSDictionary *)challenge {
  isChallenged = true;
  //[challenge setValue:self.securityCheck forKey:@"securityCheck"];
  //[[NSNotificationCenter defaultCenter] postNotificationName:@"handleChallenge" object:challenge];
  [emitter sendEvent:@"LOGIN_REQUIRED" params:NULL];
}

-(void) handleFailure:(NSDictionary *)failure {
  isChallenged = false;
  NSDictionary* p = [[NSDictionary alloc] init];
  NSString* error = @"Unknown error";
  if(failure[@"failure"] != NULL){
    error = failure[@"failure"];
  }
  [p setValue:self.securityCheck forKey:@"secutiryCheck"];
  [p setValue:error forKey:@"errorMsg"];
  [emitter sendEvent:@"LOGIN_FAILED" params:failure];
  
}

-(void) handleSuccess:(NSDictionary *)success {
  isChallenged = false;
  [emitter sendEvent:@"LOGIN_SUCCESS" params:NULL];
  
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
  BaseChallengeHandler *challenge = [[WLClient sharedInstance] getChallengeHandlerBySecurityCheck:securityCheck];
  WLAuthorizationManager *manager = [WLAuthorizationManager sharedInstance];
  if (challenge != nil) {
    [manager logout:securityCheck withCompletionHandler:^(NSError *error){
      if(error){
        RCTLogInfo(@"Logout failed");
        NSDictionary* p = [[NSDictionary alloc] init];
        [p setValue:self.securityCheck forKey:@"secutiryCheck"];
        [p setValue:[error description] forKey:@"errorMsg"];
        [emitter sendEvent:@"LOGOUT_FAILURE" params:NULL];
      }else{
        RCTLogInfo(@"Logout success");
        [emitter sendEvent:@"LOGOUT_SUCCESS" params:NULL];
      }
    }];
  }
}

RCT_EXPORT_METHOD(login:(NSDictionary *)credentials)
{
  RCTLogInfo(@"Pretending to login");
  if(isChallenged){
    [self submitChallangeAnswer:credentials];
  }
  BaseChallengeHandler *challenge = [[WLClient sharedInstance] getChallengeHandlerBySecurityCheck:securityCheck];
  WLAuthorizationManager *manager = [WLAuthorizationManager sharedInstance];
  if (challenge != nil) {
    [manager login:securityCheck withCredentials:credentials withCompletionHandler:^(NSError* error) {
        if (error) {
          NSString *text = [NSString stringWithFormat:@"Login failed. Error: %@", [error description]];
          RCTLogInfo(text);
          NSDictionary* p = [[NSDictionary alloc] init];
          [p setValue:self.securityCheck forKey:@"secutiryCheck"];
          [p setValue:[error description] forKey:@"errorMsg"];
          [emitter sendEvent:@"CONNECTION_ERROR" params:NULL];
        } else {
          RCTLogInfo(@"Login success");
          [emitter sendEvent:@"LOGIN_SUCCESS" params:NULL];
        }
      }
    ];
  }
}


RCT_EXPORT_METHOD(obtainAccessToken)
{
  RCTLogInfo(@"Pretending to obtain token");
  BaseChallengeHandler *challenge = [[WLClient sharedInstance] getChallengeHandlerBySecurityCheck:securityCheck];
  WLAuthorizationManager *manager = [WLAuthorizationManager sharedInstance];
  if (challenge != nil) {
    [manager obtainAccessTokenForScope:securityCheck withCompletionHandler:^(AccessToken *token, NSError *error){
      if(error){
        RCTLogInfo(@"Auto Login failed");
      }else{
        RCTLogInfo(@"Auto Login success");
      }
    }];
  }
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
