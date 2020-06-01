/*
 * Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
 */

package com.voximplant.cordova.sdk;

import android.util.Log;

import com.voximplant.sdk.call.VideoCodec;
import com.voximplant.sdk.client.ClientState;
import com.voximplant.sdk.client.LoginError;
import com.voximplant.sdk.client.RequestAudioFocusMode;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

class VoximplantUtils {
    static RequestAudioFocusMode convertStringToRequestAudioFocusMode(String mode) {
        switch (mode) {
            case "REQUEST_ON_CALL_CONNECTED":
                return RequestAudioFocusMode.REQUEST_ON_CALL_CONNECTED;
            case "REQUEST_ON_CALL_START":
            default:
                return RequestAudioFocusMode.REQUEST_ON_CALL_START;

        }
    }

    static int convertLoginErrorToInt(LoginError error) {
        switch (error) {
            case INVALID_PASSWORD:
                return 401;
            case ACCOUNT_FROZEN:
                return 403;
            case INVALID_USERNAME:
                return 404;
            case TIMEOUT:
                return 408;
            case INVALID_STATE:
                return 491;
            case NETWORK_ISSUES:
                return 503;
            case TOKEN_EXPIRED:
                return 701;
            case INTERNAL_ERROR:
            default:
                return 500;
        }
    }

    static String convertClientStateToString(ClientState state) {
        switch (state) {
            case CONNECTING:
                return "connecting";
            case CONNECTED:
                return "connected";
            case LOGGING_IN:
                return "logging_in";
            case LOGGED_IN:
                return "logged_in";
            case DISCONNECTED:
            default:
                return "disconnected";
        }
    }

    static Map<String, String> convertJSONObjectToMap(JSONObject object) {
        Map<String, String> result = new HashMap<>();
        Iterator<String> keyIterator = object.keys();
        while (keyIterator.hasNext()) {
            String key = keyIterator.next();
            String value = "";
            try {
                value = object.getString(key);
            } catch (JSONException e) {
                Log.e("VOXCRD", "convertJSONObjectToMap: failed to get value for key: " + key);
            }
            result.put(key, value);
        }
        return result;
    }

    static VideoCodec convertStringToVideoCodec(String videoCodec) {
        switch (videoCodec) {
            case "VP8":
                return VideoCodec.VP8;
            case "H264":
                return VideoCodec.H264;
            case "AUTO":
            default:
                return VideoCodec.AUTO;
        }
    }

    static JSONObject convertMapToJSONObject(Map<String, String> map) {
        if (map == null || map.isEmpty()) {
            return null;
        }
        JSONObject object = new JSONObject();
        for (Map.Entry<String, String> entry : map.entrySet()) {
            try {
                object.put(entry.getKey(), entry.getValue());
            } catch (JSONException e) {
                return null;
            }
        }

        return object;
    }
}
