/*
 * Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.cordova.sdk;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;

public class VoximplantPlugin extends CordovaPlugin {
    private ClientModule mClientModule;
    private CallManager mCallManager;

    @Override
    protected void pluginInitialize() {
        mCallManager = new CallManager(webView);
        mClientModule = new ClientModule(mCallManager, webView);
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
        switch (action) {
            case "initClient":
                return mClientModule.createClient(args, callbackContext, cordova.getContext());
            case "connect":
                return mClientModule.connect(args, callbackContext);
            case "login":
                return mClientModule.login(args, callbackContext);
            case "getClientState":
                return mClientModule.getClientState(callbackContext);
            case "loginWithToken":
                return mClientModule.loginWithToken(args, callbackContext);
            case "loginWithOneTimeKey":
                return mClientModule.loginWithOneTimeKey(args, callbackContext);
            case "requestOneTimeKey":
                return mClientModule.requestOneTimeKey(args, callbackContext);
            case "tokenRefresh":
                return mClientModule.refreshTokens(args, callbackContext);
            case "disconnect":
                return mClientModule.disconnect(callbackContext);
            case "call":
                return mClientModule.call(args, callbackContext);
            case "hangup": {
                CallModule callModule = mCallManager.checkCallEvent(args, callbackContext);
                if (callModule != null) {
                    callModule.hangup(args, callbackContext);
                }
                return true;
            }
            case "answer": {
                CallModule callModule = mCallManager.checkCallEvent(args, callbackContext);
                if (callModule != null) {
                    callModule.answer(args, callbackContext);
                }
                return true;
            }
            case "decline": {
                CallModule callModule = mCallManager.checkCallEvent(args, callbackContext);
                if (callModule != null) {
                    callModule.decline(args, callbackContext);
                }
                return true;
            }
            case "reject": {
                CallModule callModule = mCallManager.checkCallEvent(args, callbackContext);
                if (callModule != null) {
                    callModule.reject(args, callbackContext);
                }
                return true;
            }
            case "sendAudio": {
                CallModule callModule = mCallManager.checkCallEvent(args, callbackContext);
                if (callModule != null) {
                    callModule.sendAudio(args, callbackContext);
                }
                return true;
            }
            case "sendTone": {
                CallModule callModule = mCallManager.checkCallEvent(args, callbackContext);
                if (callModule != null) {
                    callModule.sendTone(args, callbackContext);
                }
                return true;
            }
            case "sendMessage": {
                CallModule callModule = mCallManager.checkCallEvent(args, callbackContext);
                if (callModule != null) {
                    callModule.sendMessage(args, callbackContext);
                }
                return true;
            }
            case "sendInfo": {
                CallModule callModule = mCallManager.checkCallEvent(args, callbackContext);
                if (callModule != null) {
                    callModule.sendInfo(args, callbackContext);
                }
                return true;
            }
            case "hold": {
                CallModule callModule = mCallManager.checkCallEvent(args, callbackContext);
                if (callModule != null) {
                    callModule.hold(args, callbackContext);
                }
                return true;
            }
        }
        return false;
    }
}
