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
//import com.worklight.wlclient.api.challengehandler.SecurityCheckChallengeHandler;
// MF 7.1
import com.worklight.wlclient.api.challengehandler.WLChallengeHandler;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by ishaib on 21/09/16.
 */
public class GenericSecurityCheckChallengeHandler extends WLChallengeHandler{
    private ReactApplicationContext reactApplicationContext;
    private String securityCheck;

    public GenericSecurityCheckChallengeHandler(String securityCheck, ReactApplicationContext reactApplicationContext) {
        super(securityCheck);
        this.securityCheck = securityCheck;
        this.reactApplicationContext = reactApplicationContext;
    }

    @Override
    public void handleFailure(JSONObject jsonObject) {
        //Log.d("Failure", jsonObject.toString());
        // Intent intent = new Intent();
        // intent.setAction(Constants.ACTION_CHALLENGE_FAILURE);
        // try {
        //     if (!jsonObject.isNull("failure")) {
        //         intent.putExtra("errorMsg", jsonObject.getString("failure"));
        //     } else {
        //         intent.putExtra("errorMsg", "Unknown error");
        //     }
        // } catch (JSONException e) {
        //     e.printStackTrace();
        // }
    }

    @Override
    public void handleSuccess(JSONObject jsonObject) {
    }


    // @Override
    // public void handleChallenge(JSONObject jsonObject) {
    //     Log.d("Handle Challenge", jsonObject.toString());
    //     Log.d("Failure", jsonObject.toString());
    //     Intent intent = new Intent();
    //     intent.setAction(Constants.ACTION_CHALLENGE_RECEIVED);
    //     try{
    //         if (jsonObject.isNull("errorMsg")){
    //             intent.putExtra("msg", "This data requires a PIN code.\n Remaining attempts: " + jsonObject.getString("remainingAttempts"));
    //         } else {
    //             intent.putExtra("msg", jsonObject.getString("errorMsg") + "\nRemaining attempts: " + jsonObject.getString("remainingAttempts"));
    //         }
    //     } catch (JSONException e) {
    //         e.printStackTrace();
    //     }

    // }

    @Override
    public void handleChallenge(JSONObject jsonObject) {
        WritableMap params = null;
        try {
            params = RNJSONUtils.convertJsonToMap(jsonObject);
            params.putString("securityCheck", this.securityCheck);
            reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
            sendEvent(reactApplicationContext, "handleChallenge", params);
        } catch (JSONException e) {
            Log.e(this.getClass().getCanonicalName(), e.getMessage(), e);
        }
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    // public void login(JSONObject credentials){
    //     if(isChallenged){
    //         submitChallengeAnswer(credentials);
    //     }
    //     else{
    //         WLAuthorizationManager.getInstance().login(securityCheckName, credentials, new WLLoginResponseListener() {
    //             @Override
    //             public void onSuccess() {
    //                 Log.d(securityCheckName, "Login Preemptive Success");

    //             }

    //             @Override
    //             public void onFailure(WLFailResponse wlFailResponse) {
    //                 Log.d(securityCheckName, "Login Preemptive Failure");
    //             }
    //         });
    //     }
    // }

    // public void logout(){
    //     WLAuthorizationManager.getInstance().logout(securityCheckName, new WLLogoutResponseListener() {
    //         @Override
    //         public void onSuccess() {
    //             Log.d(securityCheckName, "Logout Success");

    //             // Remove current user
    //             SharedPreferences preferences = context.getSharedPreferences(Constants.PREFERENCES_FILE, Context.MODE_PRIVATE);
    //             SharedPreferences.Editor editor = preferences.edit();
    //             editor.remove(Constants.PREFERENCES_KEY_USER);
    //             editor.apply();
    //             Log.d(securityCheckName, "Current user removed...");

    //             Intent intent = new Intent();
    //             intent.setAction(Constants.ACTION_LOGOUT_SUCCESS);
    //             broadcastManager.sendBroadcast(intent);
    //         }

    //         @Override
    //         public void onFailure(WLFailResponse wlFailResponse) {
    //             Log.d(securityCheckName, "Logout Failure");
    //             Intent intent = new Intent();
    //             intent.setAction(Constants.ACTION_LOGOUT_FAILURE);
    //             broadcastManager.sendBroadcast(intent);

    //         }
    //     });
    // }

}