/*
 * Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.cordova.sdk;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;

import java.util.HashMap;
import java.util.Map;

class CallManager {
    private final Map<String, CallModule> mCallModules;
    private final CordovaWebView mWebView;
    private Handler mHandler = new Handler(Looper.getMainLooper());

    CallManager(CordovaWebView webView) {
        mCallModules = new HashMap<>();
        mWebView = webView;
    }

    void addNewCall(String callId, CallModule callModule) {
        mCallModules.put(callId, callModule);
    }

    void callHasEnded(String callId) {
        mCallModules.remove(callId);
    }

    CallModule checkCallEvent(JSONArray args, CallbackContext callbackContext) {
        if (args == null || args.length() == 0) {
            callbackContext.error("Invalid arguments");
            return null;
        }
        String callId = null;
        try {
            callId = args.getString(0);
        } catch (JSONException e) {
            Log.e("VOXCRD", "Failed to get callId");
            callbackContext.error("Invalid arguments");
            return  null;
        }
        if (callId == null) {
            callbackContext.error("Invalid arguments");
            return null;
        }
        CallModule callModule = mCallModules.get(callId);
        if (callModule == null) {
            callbackContext.error("Failed to find call for callId: " + callId);
        }
        return callModule;
    }

    void sendEventToJS(String event) {
        mHandler.post(() -> {
            mWebView.loadUrl(event);
        });

    }
}
