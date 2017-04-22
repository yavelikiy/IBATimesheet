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

package by.iba.gomel.avkhonia.MFReactNativeBind;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.worklight.wlclient.api.WLClient;
import com.ibatimesheet.RNJSONUtils;
import org.json.JSONException;
import org.json.JSONObject;
// MF 8.0
//import com.worklight.wlclient.api.challengehandler.SecurityCheckChallengeHandler;
// MF 7.1
import com.worklight.wlclient.api.challengehandler.WLChallengeHandler;

/**
 * Created by ishaib on 15/09/16.
 */
public class WLClientRN extends ReactContextBaseJavaModule {
    WLChallengeHandler challengeHandler;
    public WLClientRN(ReactApplicationContext reactContext) {
        super(reactContext);
        WLClient client = WLClient.createInstance(reactContext);
    }

    @Override
    public String getName() {
        return "WLClientRN";
    }


    @ReactMethod
    public WLChallengeHandler getChallengeHandler() {
        return challengeHandler;
    }

    @ReactMethod
    public void registerChallengeHandler(String securityCheck, ReactApplicationContext reactContext) {
        if(this.challengeHandler !=null)
            return;
        this.challengeHandler = new GenericSecurityCheckChallengeHandler(securityCheck , reactContext);
        WLClient.getInstance().registerChallengeHandler(this.challengeHandler);
    }

    @ReactMethod
    public void cancel(String securityCheck) {
        //if (challengeHandler != null)
        //    challengeHandler.cancel();
    }

    @ReactMethod
    public void submitChallengeAnswer(ReadableMap challengeAnswer) {

        JSONObject answer;
        try {
            if (challengeHandler != null) {
                answer = RNJSONUtils.convertMapToJson(challengeAnswer);
                challengeHandler.submitChallengeAnswer(answer);
            }
        } catch (JSONException e) {
            //Log.e(this.getClass().getCanonicalName(), e.getMessage(), e);
        }
    }
}