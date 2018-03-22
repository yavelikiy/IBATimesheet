//
//  SecurityCheckChallengeHandlerRN.m
//  IBATimesheet
//
//  Created by NG on 2/16/18.
//  Copyright © 2018 Facebook. All rights reserved.
//
#import "SecurityCheckChallengeHandlerRN.h"

//#import "React/RCTEventDispatcher.h"

static NSString *const kLoginNotification = @"RCTLoginNotification";

static void postNotification(NSString* name, NSString* error, id sender)
{
  NSDictionary<NSString *, id> *payload = @{@"errMsg": error, @"name": name};
  [[NSNotificationCenter defaultCenter] postNotificationName:kLoginNotification
                                                      object:sender
                                                    userInfo:payload];
}

@implementation SecurityCheckChallengeHandlerRN{
  SecurityCheckChallengeHandlerEventEmitter* emitter;
  Boolean isChallenged;
}
static NSString* const securityCheck = @"dominoSecurityCheck";

- (instancetype)init
{
  emitter = [[SecurityCheckChallengeHandlerEventEmitter allocWithZone:nil] init];
  isChallenged = false;
  return self;
}

-(void) handleChallenge:(NSDictionary *)challenge {
  isChallenged = true;
  //[challenge setValue:self.securityCheck forKey:@"securityCheck"];
  postNotification(@"LOGIN_REQUIRED",nil, self);
}

-(void) handleFailure:(NSDictionary *)failure {
  isChallenged = false;
  NSString* error = @"Unknown error";
  if(failure[@"failure"] != NULL){
    error = failure[@"failure"];
  }
  NSDictionary *p = [NSDictionary dictionaryWithObjectsAndKeys:
                        securityCheck, @"securityCheck",
                        error, @"errorMsg", nil];
  postNotification(@"LOGIN_FAILED",nil, self);
  
}

-(void) handleSuccess:(NSDictionary *)success {
  isChallenged = false;
  postNotification(@"LOGIN_SUCCESS",nil, self);
  
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
        postNotification(@"LOGOUT_FAILURE",[error description], self);
      }else{
        RCTLogInfo(@"Logout success");
        postNotification(@"LOGOUT_SUCCESS",nil, self);
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
          RCTLogInfo(@"Login failed. Error: %@", [error description]);
          postNotification(@"LOGIN_FAILED",[error description], self);
        } else {
          RCTLogInfo(@"Login success");
          postNotification(@"LOGIN_SUCCESS",nil, self);
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
