package by.iba.gomel.avkhonia.MFReactNativeBind;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.ibatimesheet.RNJSONUtils;

import com.worklight.wlclient.api.WLClient;
import com.worklight.wlclient.api.challengehandler.SecurityCheckChallengeHandler;
import com.worklight.wlclient.api.WLAccessTokenListener;
import com.worklight.wlclient.api.WLAuthorizationManager;
import com.worklight.wlclient.api.WLFailResponse;
import com.worklight.wlclient.auth.AccessToken;

import org.json.JSONException;
import org.json.JSONObject;

public class SecurityCheckChallengeHandlerRN extends ReactContextBaseJavaModule {

    public SecurityCheckChallengeHandlerRN(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void cancel() {
        SecurityCheckChallengeHandler securityCheckChallengeHandler = WLClient.getInstance().getSecurityCheckChallengeHandler(Constants.SECURITY_CHECK);
        if (securityCheckChallengeHandler != null)
            ((GenericSecurityCheckChallengeHandler)securityCheckChallengeHandler).cancel();
    }

    @ReactMethod
    public void submitChallengeAnswer(ReadableMap challengeAnswer) {

        SecurityCheckChallengeHandler securityCheckChallengeHandler = WLClient.getInstance().getSecurityCheckChallengeHandler(Constants.SECURITY_CHECK);
        JSONObject answer;
        try {
            if (securityCheckChallengeHandler != null) {
                answer = RNJSONUtils.convertMapToJson(challengeAnswer);
                securityCheckChallengeHandler.submitChallengeAnswer(answer);
            }
        } catch (JSONException e) {
            Log.e(this.getClass().getCanonicalName(), e.getMessage(), e);
        }
    }    

    @ReactMethod
    public void login(ReadableMap credentials) {

        SecurityCheckChallengeHandler securityCheckChallengeHandler = WLClient.getInstance().getSecurityCheckChallengeHandler(Constants.SECURITY_CHECK);
        JSONObject credentialsJson;
        try {
            if (securityCheckChallengeHandler != null) {
                credentialsJson = RNJSONUtils.convertMapToJson( credentials);
                ((GenericSecurityCheckChallengeHandler)securityCheckChallengeHandler).login(credentialsJson);
            }
        } catch (Exception e) {
            Log.e("IBATimesheet", e.getMessage(), e);
        }
    }

    @ReactMethod
    public void logout() {
        SecurityCheckChallengeHandler securityCheckChallengeHandler = WLClient.getInstance().getSecurityCheckChallengeHandler(Constants.SECURITY_CHECK);
        try{
            ((GenericSecurityCheckChallengeHandler)securityCheckChallengeHandler).logout();

        }catch(Exception e){
            Log.e("IBATimesheet", e.getMessage(), e);

        }
    }

    @ReactMethod
    public void obtainAccessToken(){
        // Obtain Access Token
        WLAuthorizationManager.getInstance().obtainAccessToken(null, new WLAccessTokenListener() {
            @Override
            public void onSuccess(AccessToken accessToken) {
                Log.d(Constants.SECURITY_CHECK, "auto login success");
            }

            @Override
            public void onFailure(WLFailResponse wlFailResponse) {
                String server =  WLClient.getInstance().getServerUrl().toString(); 
                    Log.d("IBATimesheet", "Auto Login failure at server:"+server+" - "+wlFailResponse.getErrorCode().getDescription()+": "+wlFailResponse.getErrorMsg());
            }
        });
    }

    @Override
    public String getName() {
        return "SecurityCheckChallengeHandlerRN";
    }
}