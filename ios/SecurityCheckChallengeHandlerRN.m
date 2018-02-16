//
//  SecurityCheckChallengeHandlerRN.m
//  IBATimesheet
//
//  Created by NG on 2/16/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "SecurityCheckChallengeHandlerRN.h"
#import <React/RCTLog.h>

@implementation SecurityCheckChallengeHandlerRN

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(cancel)
{
  RCTLogInfo(@"Pretending to cancel");
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
}

@end
