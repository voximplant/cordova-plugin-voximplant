/*
 * Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.cordova.sdk;

import android.content.Context;
import android.util.Log;

import com.voximplant.sdk.Voximplant;
import com.voximplant.sdk.call.CallException;
import com.voximplant.sdk.call.CallSettings;
import com.voximplant.sdk.call.ICall;
import com.voximplant.sdk.call.IEndpoint;
import com.voximplant.sdk.call.VideoCodec;
import com.voximplant.sdk.call.VideoFlags;
import com.voximplant.sdk.client.AuthParams;
import com.voximplant.sdk.client.ClientConfig;
import com.voximplant.sdk.client.IClient;
import com.voximplant.sdk.client.IClientIncomingCallListener;
import com.voximplant.sdk.client.IClientLoginListener;
import com.voximplant.sdk.client.IClientSessionListener;
import com.voximplant.sdk.client.LoginError;
import com.voximplant.sdk.client.RequestAudioFocusMode;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;

import okhttp3.internal.Util;

class ClientModule implements IClientSessionListener, IClientLoginListener, IClientIncomingCallListener {
    private final CallManager mCallManager;
    private final CordovaWebView mWebView;

    private IClient mClient;
    private CallbackContext mConnectCallbackContext;
    private CallbackContext mLoginCallbackContext;
    private CallbackContext mRefreshTokenCallback;
    private CallbackContext mDisconnectCallback;

    ClientModule(CallManager callManager, CordovaWebView webView) {
        mCallManager = callManager;
        mWebView = webView;
    }

    boolean createClient(JSONArray args, CallbackContext callbackContext, Context context) {
        String bundleId = null;
        boolean enableDebugLogging = false;
        boolean enableLogcatLogging = true;
        RequestAudioFocusMode requestAudioFocusMode = RequestAudioFocusMode.REQUEST_ON_CALL_START;

        if (args.length() > 0) {
            try {
                JSONObject config = args.getJSONObject(0);
                enableDebugLogging = config.getBoolean("enableDebugLogging");
                enableLogcatLogging = config.getBoolean("enableLogcatLogging");
                requestAudioFocusMode = VoximplantUtils.convertStringToRequestAudioFocusMode(config.getString("requestAudioFocusMode"));
                bundleId = config.getString("bundleId");
            } catch (JSONException e) {
                Log.e("VOXCRD", "Client.init: failed to parse json, " + e.getMessage());
            }
        }

        ClientConfig clientConfig = new ClientConfig();
        clientConfig.enableDebugLogging = enableDebugLogging;
        clientConfig.enableLogcatLogging = enableLogcatLogging;
        clientConfig.requestAudioFocusMode = requestAudioFocusMode;
        if (bundleId != null && !bundleId.isEmpty()) {
            clientConfig.packageName = bundleId;
        }
        mClient = Voximplant.getClientInstance(Executors.newSingleThreadExecutor(), context, clientConfig);
        mClient.setClientSessionListener(this);
        mClient.setClientLoginListener(this);
        mClient.setClientIncomingCallListener(this);
        callbackContext.success();
        return true;
    }

    boolean getClientState(CallbackContext callbackContext) {
        callbackContext.success(VoximplantUtils.convertClientStateToString(mClient.getClientState()));
        return true;
    }

    boolean connect(JSONArray args, CallbackContext callbackContext) {
        boolean connectivityCheck = false;
        ArrayList<String> servers = new ArrayList<>();
        if (args.length() > 0) {
            try {
                JSONObject options = args.getJSONObject(0);
                connectivityCheck = options.getBoolean("connectivityCheck");
                JSONArray serversJson = options.getJSONArray("servers");
                for (int i = 0; i < serversJson.length(); i++) {
                    servers.add(serversJson.getString(i));
                }
            } catch (JSONException e) {
                Log.e("VOXCRD", "Client.connect: failed to parse json");
            }
        }

        try {
            mClient.connect(connectivityCheck, servers);
            mConnectCallbackContext = callbackContext;
        } catch (IllegalStateException e) {
            callbackContext.error("Invalid state");
        }
        return true;
    }

    boolean login(JSONArray args, CallbackContext callbackContext) {
        String username = null;
        String password = null;
        if (args.length() > 0) {
            try {
                JSONObject params = args.getJSONObject(0);
                username = params.getString("username");
                password = params.getString("password");
            } catch (JSONException e) {
                Log.e("VOXCRD", "Client.login: failed to parse json");
            }
        }
        mClient.login(username, password);
        mLoginCallbackContext = callbackContext;
        return true;
    }

    boolean loginWithToken(JSONArray args, CallbackContext callbackContext) {
        String username = null;
        String token = null;
        if (args.length() > 0) {
            try {
                JSONObject params = args.getJSONObject(0);
                username = params.getString("username");
                token = params.getString("token");
            } catch (JSONException e) {
                Log.e("VOXCRD", "Client.loginWithToken: failed to parse json");
            }
        }
        mClient.loginWithAccessToken(username, token);
        mLoginCallbackContext = callbackContext;
        return true;
    }

    boolean loginWithOneTimeKey(JSONArray args, CallbackContext callbackContext) {
        String username = null;
        String hash = null;
        if (args.length() > 0) {
            try {
                JSONObject params = args.getJSONObject(0);
                username = params.getString("username");
                hash = params.getString("hash");
            } catch (JSONException e) {
                Log.e("VOXCRD", "Client.loginWithOneTimeKey: failed to parse json");
            }
        }
        mClient.loginWithOneTimeKey(username, hash);
        mLoginCallbackContext = callbackContext;
        return true;
    }

    boolean requestOneTimeKey(JSONArray args, CallbackContext callbackContext) {
        String username = null;
        if (args.length() > 0) {
            try {
                JSONObject params = args.getJSONObject(0);
                username = params.getString("username");
            } catch (JSONException e) {
                Log.e("VOXCRD", "Client.requestOneTimeKey: failed to parse json");
            }
        }
        mClient.requestOneTimeKey(username);
        mLoginCallbackContext = callbackContext;
        return true;
    }

    boolean refreshTokens(JSONArray args, CallbackContext callbackContext) {
        String username = null;
        String refreshToken = null;
        if (args.length() > 0) {
            try {
                JSONObject params = args.getJSONObject(0);
                username = params.getString("username");
                refreshToken = params.getString("token");
            } catch (JSONException e) {
                Log.e("VOXCRD", "Client.tokenRefresh: failed to parse json");
            }
        }
        mClient.refreshToken(username, refreshToken);
        mRefreshTokenCallback = callbackContext;
        return true;
    }

    boolean disconnect(CallbackContext callbackContext) {
        mDisconnectCallback = callbackContext;
        mClient.disconnect();
        return true;
    }

    boolean call(JSONArray args, CallbackContext callbackContext) {
        String number = null;
        if (args.length() > 0) {
            try {
                number = args.getString(0);
            } catch (JSONException e) {
                Log.e("VOXCRD", "Client.call: failed to parse json - number parameter");
            }
        }
        String customData = null;
        Map<String, String> headers = null;
        boolean sendVideo = false;
        boolean receiveVideo = false;
        String videoCodec = "AUTO";
        if (args.length() > 1) {
            try {
                JSONObject params = args.getJSONObject(1);
                customData = params.getString("customData");
                sendVideo = params.getJSONObject("video").getBoolean("sendVideo");
                receiveVideo = params.getJSONObject("video").getBoolean("receiveVideo");
                JSONObject object = params.getJSONObject("extraHeaders");
                headers = VoximplantUtils.convertJSONObjectToMap(object);
                videoCodec = params.getString("preferredVideoCodec");
            } catch (JSONException e) {
                Log.e("VOXCRD", "Client.call: failed to parse json - call settings");
            }
        }

        CallSettings callSettings = new CallSettings();
        callSettings.customData = customData;
        callSettings.extraHeaders = headers;
        callSettings.videoFlags = new VideoFlags(receiveVideo, sendVideo);
        callSettings.preferredVideoCodec = VoximplantUtils.convertStringToVideoCodec(videoCodec);
        ICall call = mClient.call(number, callSettings);
        CallModule callModule = new CallModule(call, mCallManager);
        return callModule.startCall(callbackContext);
    }

    @Override
    public void onConnectionEstablished() {
        if (mConnectCallbackContext != null) {
            mConnectCallbackContext.success();
            mConnectCallbackContext = null;
        }
    }

    @Override
    public void onConnectionFailed(String error) {
        if (mConnectCallbackContext != null) {
            mConnectCallbackContext.error(error);
            mConnectCallbackContext = null;
        }
    }

    @Override
    public void onConnectionClosed() {
        if (mDisconnectCallback != null) {
            mDisconnectCallback.success();
            mDisconnectCallback = null;
        }
    }

    @Override
    public void onLoginSuccessful(String displayName, AuthParams authParams) {
        if (mLoginCallbackContext != null) {
            JSONObject params = new JSONObject();
            try {
                params.put("displayName", displayName);
                JSONObject tokens = new JSONObject();
                tokens.put("accessToken", authParams.getAccessToken());
                tokens.put("accessExpire", authParams.getAccessTokenTimeExpired());
                tokens.put("refreshToken", authParams.getRefreshToken());
                tokens.put("refreshExpire", authParams.getRefreshTokenTimeExpired());
                params.put("tokens", tokens);
            } catch (JSONException e) {
                Log.e("VOXCRD", "Client.onLoginSuccessful: failed to create json");
            }
            mLoginCallbackContext.success(params);
            mLoginCallbackContext = null;
        }
    }

    @Override
    public void onLoginFailed(LoginError loginError) {
        if (mLoginCallbackContext != null) {
            JSONObject params = new JSONObject();
            try {
                params.put("code", VoximplantUtils.convertLoginErrorToInt(loginError));
            } catch (JSONException e) {
                Log.e("VOXCRD", "Client.onLoginSuccessful: failed to create json");
            }
            mLoginCallbackContext.error(params);
            mLoginCallbackContext = null;
        }
    }

    @Override
    public void onRefreshTokenFailed(LoginError loginError) {
        if (mRefreshTokenCallback != null) {
            JSONObject params = new JSONObject();
            try {
                params.put("code", VoximplantUtils.convertLoginErrorToInt(loginError));
            } catch (JSONException e) {
                Log.e("VXOCRD", "Client.onRefreshTokenFailed: failed to create json");
            }
            mRefreshTokenCallback.error(params);
            mRefreshTokenCallback = null;
        }
    }

    @Override
    public void onRefreshTokenSuccess(AuthParams authParams) {
        if (mRefreshTokenCallback != null) {
            JSONObject params = new JSONObject();
            try {
                JSONObject tokens = new JSONObject();
                tokens.put("accessToken", authParams.getAccessToken());
                tokens.put("accessExpire", authParams.getAccessTokenTimeExpired());
                tokens.put("refreshToken", authParams.getRefreshToken());
                tokens.put("refreshExpire", authParams.getRefreshTokenTimeExpired());
                params.put("tokens", tokens);
            } catch (JSONException e) {
                Log.e("VOXCRD", "Client.onRefreshTokenSuccess: failed to create json");
            }
            mRefreshTokenCallback.success(params);
            mRefreshTokenCallback = null;
        }
    }

    @Override
    public void onOneTimeKeyGenerated(String key) {
        if (mLoginCallbackContext != null) {
            JSONObject params = new JSONObject();
            try {
                params.put("result", false);
                params.put("code", 302);
                params.put("key", key);
            } catch (JSONException e) {
                Log.e("VOXCRD", "Client.onOneTimeKeyGenerated: failed to create json");
            }
            mLoginCallbackContext.success(params);
            mLoginCallbackContext = null;
        }
    }

    @Override
    public void onIncomingCall(ICall call, boolean hasIncomingVideo, Map<String, String> headers) {
        CallModule callModule = new CallModule(call, mCallManager);
        mCallManager.addNewCall(call.getCallId(), callModule);
        JSONObject params = new JSONObject();
        try {
            params.put("callId", call.getCallId());
            IEndpoint endpoint = call.getEndpoints().get(0);
            if (endpoint != null) {
                params.put("endpointId", endpoint.getEndpointId());
                params.put("displayName", endpoint.getUserDisplayName());
                params.put("sipUri", endpoint.getSipUri());
                params.put("userName", endpoint.getUserName());
            }
            params.put("video", hasIncomingVideo);
            params.put("headers", VoximplantUtils.convertMapToJSONObject(headers));
        } catch (JSONException e) {
            Log.e("VOXCRD", "Client.onIncomingCall: failed to create json");
        }
        String event = "javascript:window.Voximplant.Client.prototype._onEvent('IncomingCall'," + params + ")";
        mCallManager.sendEventToJS(event);
    }
}
