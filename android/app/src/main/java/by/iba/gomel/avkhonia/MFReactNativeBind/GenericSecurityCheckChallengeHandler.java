package by.iba.gomel.avkhonia.MFReactNativeBind;

import android.support.annotation.Nullable;
import android.util.Log;
/**
 *    © Copyright 2016 IBM Corp.
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
//import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.ibatimesheet.RNJSONUtils;
// MF 8.0
import com.worklight.wlclient.api.challengehandler.SecurityCheckChallengeHandler;
import com.worklight.wlclient.api.WLAccessTokenListener;
import com.worklight.wlclient.api.WLAuthorizationManager;
import com.worklight.wlclient.api.WLFailResponse;
import com.worklight.wlclient.api.WLResourceRequest;
import com.worklight.wlclient.api.WLResponse;
import com.worklight.wlclient.api.WLResponseListener;
import com.worklight.wlclient.api.WLLoginResponseListener;
import com.worklight.wlclient.api.WLLogoutResponseListener;
import com.worklight.wlclient.auth.AccessToken;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by ishaib on 21/09/16.
 */
public class GenericSecurityCheckChallengeHandler extends SecurityCheckChallengeHandler{
    private ReactApplicationContext reactApplicationContext;
    private int remainingAttempts = -1;
    private String errorMsg = "";
    private boolean isChallenged = false;

    public GenericSecurityCheckChallengeHandler(ReactApplicationContext reactApplicationContext) {
        super(Constants.SECURITY_CHECK);
        this.reactApplicationContext = reactApplicationContext;
    }

    @Override
    public void handleChallenge(JSONObject jsonObject) {
        isChallenged = true;
        WritableMap params = null;
        try {
            params = RNJSONUtils.convertJsonToMap(jsonObject);
            params.putString("securityCheck", Constants.SECURITY_CHECK);
            reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
            Log.d("IBATimesheet", "Handle challenge - LOGIN_REQUIRED event");
            sendEvent(reactApplicationContext, "LOGIN_REQUIRED", null);
        } catch (JSONException e) {
            Log.e("IBATimesheet", e.getMessage(), e);
        }
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @Override
    public void cancel() {
        try {
            super.cancel();
        } catch (Exception e) {
            Log.d(this.getClass().getCanonicalName(), e.getMessage());
        }
    }

    @Override
    public void handleFailure(JSONObject jsonObject) {
        Log.d("IBATimesheet", "Handle failure");
        isChallenged = false;
        WritableMap params = null;
        try {
            params = RNJSONUtils.convertJsonToMap(jsonObject);
            params.putString("securityCheck", Constants.SECURITY_CHECK);
            if (!jsonObject.isNull("failure")) {
                params.putString("errorMsg", jsonObject.getString("failure"));
            } else {
                params.putString("errorMsg", "Unknown error");
            }
            reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
            sendEvent(reactApplicationContext, "LOGIN_FAILED", params);
        } catch (JSONException e) {
            Log.e(this.getClass().getCanonicalName(), e.getMessage(), e);
        }
    }


    @Override
    public void handleSuccess(JSONObject identity) {
        isChallenged = false;
        reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
        Log.d("IBATimesheet", "handleSuccess - LOGIN_SUCCESS event");
        sendEvent(reactApplicationContext, "LOGIN_SUCCESS", null);
    }


    public void login(JSONObject credentials){
        Log.d("IBATimesheet", "Try to login");
        if(isChallenged){
            submitChallengeAnswer(credentials);
        }
        else{
            WLAuthorizationManager.getInstance().
            login(Constants.SECURITY_CHECK, credentials, new WLLoginResponseListener() {
                @Override
                public void onSuccess() {
                    reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
                    Log.d("IBATimesheet", "login - LOGIN_SUCCESS event");
                    sendEvent(reactApplicationContext, "LOGIN_SUCCESS", null);
                }

                @Override
                public void onFailure(WLFailResponse wlFailResponse) {
                    Log.d("IBATimesheet", "Login failure "+wlFailResponse.getErrorCode().getDescription()+": "+wlFailResponse.getErrorMsg());
                }
            });
        }
    }

    public void logout(){
        Log.d("IBATimesheet", "Try to logout");
        WLAuthorizationManager.getInstance().logout(Constants.SECURITY_CHECK, new WLLogoutResponseListener() {
            @Override
            public void onSuccess() {
                reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
                sendEvent(reactApplicationContext, "LOGOUT_SUCCESS", null);
            }

            @Override
            public void onFailure(WLFailResponse wlFailResponse) {
                reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
                sendEvent(reactApplicationContext, "LOGOUT_FAILURE", null);
            }
        });
    }


}