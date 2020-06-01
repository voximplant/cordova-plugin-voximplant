/*
 * Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.cordova.sdk;

import android.util.Log;

import com.voximplant.sdk.call.CallException;
import com.voximplant.sdk.call.CallSettings;
import com.voximplant.sdk.call.ICall;
import com.voximplant.sdk.call.ICallCompletionHandler;
import com.voximplant.sdk.call.ICallListener;
import com.voximplant.sdk.call.IEndpoint;
import com.voximplant.sdk.call.IEndpointListener;
import com.voximplant.sdk.call.IVideoStream;
import com.voximplant.sdk.call.RejectMode;
import com.voximplant.sdk.call.VideoFlags;

import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

class CallModule implements ICallListener, IEndpointListener {
    private final ICall mCall;
    private final CallManager mCallManager;

    CallModule(ICall call, CallManager callManager) {
        mCall = call;
        mCallManager = callManager;
        mCall.addCallListener(this);
    }

    boolean startCall(CallbackContext callbackContext) {
        try {
            mCall.start();
        } catch (CallException e) {
            Log.e("VOXCRD", "Client.call: failed to start call: " + e.getErrorCode());
            callbackContext.error(e.getErrorCode().toString());
            return true;
        }
        mCallManager.addNewCall(mCall.getCallId(), this);
        callbackContext.success(mCall.getCallId());
        return true;
    }

    void hangup(JSONArray args, CallbackContext callbackContext) {
        Map<String, String> headers = null;
        if (args.length() > 1) {
            try {
                JSONObject params = args.getJSONObject(1);
                headers = VoximplantUtils.convertJSONObjectToMap(params);
            } catch (JSONException e) {
                Log.e("VOXCRD", "Call.hangup: failed to parse json - extra headers");
            }
        }
        mCall.hangup(headers);
        callbackContext.success();
    }

    void answer(JSONArray args, CallbackContext callbackContext) {
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
                Log.e("VOXCRD", "Call.answer: failed to parse json - call settings");
            }
        }

        CallSettings callSettings = new CallSettings();
        callSettings.customData = customData;
        callSettings.extraHeaders = headers;
        callSettings.videoFlags = new VideoFlags(receiveVideo, sendVideo);
        callSettings.preferredVideoCodec = VoximplantUtils.convertStringToVideoCodec(videoCodec);
        try {
            mCall.answer(callSettings);
        } catch (CallException e) {
            Log.e("VOXCRD", "Call.answer: failed to answer call " + e.getErrorCode());
        }
        callbackContext.success();
    }


    void decline(JSONArray args, CallbackContext callbackContext) {
        Map<String, String> headers = null;
        if (args.length() > 1) {
            try {
                JSONObject params = args.getJSONObject(1);
                headers = VoximplantUtils.convertJSONObjectToMap(params);
            } catch (JSONException e) {
                Log.e("VOXCRD", "Call.decline: failed to parse json - headers");
            }
        }
        try {
            mCall.reject(RejectMode.DECLINE, headers);
        } catch (CallException e) {
            Log.e("VOXCRD", "Call.decline: failed to decline call " + e.getErrorCode());
        }
        callbackContext.success();
    }

    void reject(JSONArray args, CallbackContext callbackContext) {
        Map<String, String> headers = null;
        if (args.length() > 1) {
            try {
                JSONObject params = args.getJSONObject(1);
                headers = VoximplantUtils.convertJSONObjectToMap(params);
            } catch (JSONException e) {
                Log.e("VOXCRD", "Call.reject: failed to parse json - headers");
            }
        }
        try {
            mCall.reject(RejectMode.BUSY, headers);
        } catch (CallException e) {
            Log.e("VOXCRD", "Call.reject: failed to decline call " + e.getErrorCode());
        }
        callbackContext.success();
    }

    void sendAudio(JSONArray args, CallbackContext callbackContext) {
        boolean enable = true;
        if (args.length() > 1) {
            try {
                enable = args.getBoolean(1);
            } catch (JSONException e) {
                Log.e("VOXCRD", "Call.sendAudio: failed to parse json - enable");
            }
        }
        mCall.sendAudio(enable);
        callbackContext.success();
    }

    void sendTone(JSONArray args, CallbackContext callbackContext) {
        String dtmf = null;
        if (args.length() > 1) {
            try {
                dtmf = args.getString(1);
            } catch (JSONException e) {
                Log.e("VOXCRD", "Call.sendTone: failed to parse json - key");
            }
        }
        mCall.sendDTMF(dtmf);
        callbackContext.success();
    }

    void sendMessage(JSONArray args, CallbackContext callbackContext) {
        String message = null;
        if (args.length() > 1) {
            try {
                message = args.getString(1);
            } catch (JSONException e) {
                Log.e("VOXCRD", "Call.sendMessage: failed to parse json - message");
            }
        }
        mCall.sendMessage(message);
        callbackContext.success();
    }

    void sendInfo(JSONArray args, CallbackContext callbackContext) {
        String mimeType = null;
        String body = null;
        Map<String, String> headers = null;
        if (args.length() > 1) {
            try {
                JSONObject params = args.getJSONObject(1);
                mimeType = params.getString("type");
                body = params.getString("body");
                JSONObject object = params.getJSONObject("headers");
                headers = VoximplantUtils.convertJSONObjectToMap(object);
            } catch (JSONException e) {
                Log.e("VOXCRD", "Call.sendInfo: failed to parse json");
            }
        }
        mCall.sendInfo(mimeType, body, headers);
        callbackContext.success();
    }

    void hold(JSONArray args, CallbackContext callbackContext) {
        boolean enable = false;
        if (args.length() > 1) {
            try {
                enable = args.getBoolean(1);
            } catch (JSONException e) {
                Log.e("VOXCRD", "Call.hold: failed to parse json");
            }
        }
        mCall.hold(enable, new ICallCompletionHandler() {
            @Override
            public void onComplete() {
                callbackContext.success();
            }

            @Override
            public void onFailure(CallException e) {
                callbackContext.error(e.getErrorCode().toString());
            }
        });
    }

    @Override
    public void onCallConnected(ICall call, Map<String, String> headers) {
        JSONObject params = new JSONObject();
        try {
            params.put("callId", call.getCallId());
            JSONObject object = VoximplantUtils.convertMapToJSONObject(headers);
            if (object != null) {
                params.put("headers", object);
            }
        } catch (JSONException e) {
            Log.e("VOXCRD", "onCallConnected: Failed to add params to json");
        }
        String event = "javascript:window.Voximplant.Client.prototype._onEvent('CallConnected'," + params + ")";
        mCallManager.sendEventToJS(event);
    }

    @Override
    public void onCallDisconnected(ICall call, Map<String, String> headers, boolean answeredElsewhere) {
        mCall.removeCallListener(this);
        JSONObject params = new JSONObject();
        try {
            params.put("callId", call.getCallId());
            params.put("answeredElsewhere", answeredElsewhere);
            JSONObject object = VoximplantUtils.convertMapToJSONObject(headers);
            if (object != null) {
                params.put("headers", object);
            }
        } catch (JSONException e) {
            Log.e("VOXCRD", "onCallDisconnected: Failed to add params to json");
        }

        String event = "javascript:window.Voximplant.Client.prototype._onEvent('CallDisconnected'," + params + ")";
        mCallManager.sendEventToJS(event);
    }

    @Override
    public void onCallRinging(ICall call, Map<String, String> headers) {
        JSONObject params = new JSONObject();
        try {
            params.put("callId", call.getCallId());
            JSONObject object = VoximplantUtils.convertMapToJSONObject(headers);
            if (object != null) {
                params.put("headers", object);
            }
        } catch (JSONException e) {
            Log.e("VOXCRD", "onCallRinging: Failed to add params to json");
        }
        String event = "javascript:window.Voximplant.Client.prototype._onEvent('CallProgressToneStart'," + params + ")";
        mCallManager.sendEventToJS(event);
    }

    @Override
    public void onCallFailed(ICall call, int code, String description, Map<String, String> headers) {
        mCall.removeCallListener(this);
        JSONObject params = new JSONObject();
        try {
            params.put("callId", call.getCallId());
            params.put("code", code);
            params.put("reason", description);
            JSONObject object = VoximplantUtils.convertMapToJSONObject(headers);
            if (object != null) {
                params.put("headers", object);
            }
        } catch (JSONException e) {
            Log.e("VOXCRD", "onCallFailed: Failed to add params to json");
        }
        String event = "javascript:window.Voximplant.Client.prototype._onEvent('CallFailed'," + params + ")";
        mCallManager.sendEventToJS(event);
    }

    @Override
    public void onCallAudioStarted(ICall call) {
        JSONObject params = new JSONObject();
        try {
            params.put("callId", call.getCallId());
        } catch (JSONException e ) {
            Log.e("VOXCRD", "onCallAudioStarted: Failed to add params to json");
        }
        String event = "javascript:window.Voximplant.Client.prototype._onEvent('CallProgressToneStop'," + params + ")";
        mCallManager.sendEventToJS(event);
    }

    @Override
    public void onSIPInfoReceived(ICall call, String type, String content, Map<String, String> headers) {
        JSONObject params = new JSONObject();
        try {
            params.put("callId", call.getCallId());
            params.put("mimeType", type);
            params.put("body", content);
            JSONObject object = VoximplantUtils.convertMapToJSONObject(headers);
            if (object != null) {
                params.put("headers", object);
            }
        } catch (JSONException e ) {
            Log.e("VOXCRD", "onSIPInfoReceived: Failed to add params to json");
        }
        String event = "javascript:window.Voximplant.Client.prototype._onEvent('CallInfoReceived'," + params + ")";
        mCallManager.sendEventToJS(event);
    }

    @Override
    public void onMessageReceived(ICall call, String text) {
        JSONObject params = new JSONObject();
        try {
            params.put("callId", call.getCallId());
            params.put("text", text);
        } catch (JSONException e ) {
            Log.e("VOXCRD", "onMessageReceived: Failed to add params to json");
        }
        String event = "javascript:window.Voximplant.Client.prototype._onEvent('CallMessageReceived'," + params + ")";
        mCallManager.sendEventToJS(event);
    }

    @Override
    public void onLocalVideoStreamAdded(ICall call, IVideoStream videoStream) {

    }

    @Override
    public void onLocalVideoStreamRemoved(ICall call, IVideoStream videoStream) {

    }

    @Override
    public void onICETimeout(ICall call) {
        JSONObject params = new JSONObject();
        try {
            params.put("callId", call.getCallId());
        } catch (JSONException e ) {
            Log.e("VOXCRD", "onICETimeout: Failed to add params to json");
        }
        String event = "javascript:window.Voximplant.Client.prototype._onEvent('CallICETimeout'," + params + ")";
        mCallManager.sendEventToJS(event);
    }

    @Override
    public void onICECompleted(ICall call) {
        JSONObject params = new JSONObject();
        try {
            params.put("callId", call.getCallId());
        } catch (JSONException e ) {
            Log.e("VOXCRD", "onICECompleted: Failed to add params to json");
        }
        String event = "javascript:window.Voximplant.Client.prototype._onEvent('CallICECompleted'," + params + ")";
        mCallManager.sendEventToJS(event);
    }

    @Override
    public void onEndpointAdded(ICall call, IEndpoint endpoint) {
        endpoint.setEndpointListener(this);
        JSONObject params = new JSONObject();
        try {
            params.put("callId", call.getCallId());
            params.put("endpointId", endpoint.getEndpointId());
            params.put("displayName", endpoint.getUserDisplayName() == null ? "" : endpoint.getUserDisplayName());
            params.put("sipUri", endpoint.getSipUri() == null ? "" : endpoint.getSipUri());
            params.put("userName", endpoint.getUserName() == null ? "" : endpoint.getUserName());
        } catch (JSONException e) {
            Log.e("VOXCRD", "onEndpointAdded: Failed to add params to json");
        }
        String event = "javascript:window.Voximplant.Client.prototype._onEvent('CallEndpointAdded'," + params + ")";
        mCallManager.sendEventToJS(event);
    }

    @Override
    public void onRemoteVideoStreamAdded(IEndpoint endpoint, IVideoStream videoStream) {

    }

    @Override
    public void onRemoteVideoStreamRemoved(IEndpoint endpoint, IVideoStream videoStream) {

    }

    @Override
    public void onEndpointRemoved(IEndpoint endpoint) {
        endpoint.setEndpointListener(null);
        JSONObject params = new JSONObject();
        try {
            params.put("callId", mCall.getCallId());
            params.put("endpointId", endpoint.getEndpointId());
        } catch (JSONException e) {
            Log.e("VOXCRD", "onEndpointRemoved: Failed to add params to json");
        }
        String event = "javascript:window.Voximplant.Client.prototype._onEvent('EndpointRemoved'," + params + ")";
        mCallManager.sendEventToJS(event);
    }

    @Override
    public void onEndpointInfoUpdated(IEndpoint endpoint) {
        JSONObject params = new JSONObject();
        try {
            params.put("callId", mCall.getCallId());
            params.put("endpointId", endpoint.getEndpointId());
            params.put("displayName", endpoint.getUserDisplayName() == null ? "" : endpoint.getUserDisplayName());
            params.put("sipUri", endpoint.getSipUri() == null ? "" : endpoint.getSipUri());
            params.put("userName", endpoint.getUserName() == null ? "" : endpoint.getUserName());
        } catch (JSONException e) {
            Log.e("VOXCRD", "onEndpointInfoUpdated: Failed to add params to json");
        }
        String event = "javascript:window.Voximplant.Client.prototype._onEvent('EndpointInfoUpdated'," + params + ")";
        mCallManager.sendEventToJS(event);
    }
}
