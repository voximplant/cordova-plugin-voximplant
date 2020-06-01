/*
* Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
*/


import {LogLevel, RequestAudioFocusMode} from "./Enums";


export interface ClientConfig {
    /**
     * Application bundle id/package name for iOS/Android respectively.
     *
     * You need to set this only if you are going to send push notifications across several mobile apps on a specific platform (Android or iOS)
     * using a single Voximplant application.
     */
    bundleId?: string | null;
    /**
     * Enable debug logging. Set to false by default.
     * @android
     */
    enableDebugLogging?: boolean;
    /**
     * Enable log output to logcat. True by default.
     * @android
     */
    enableLogcatLogging?: boolean;
    /**
     * Log levels.
     * @ios
     */
    logLevel?: LogLevel;
    /**
     * Specifies when the audio focus request is performed: when a call is started or established.
     * [RequestAudioFocusMode.REQUEST_ON_CALL_START] by default.
     *
     * In case of [RequestAudioFocusMode.REQUEST_ON_CALL_CONNECTED], SDK requests audio focus and sets audio mode to
     * [MODE_IN_COMMUNICATION](https://developer.android.com/reference/android/media/AudioManager#MODE_IN_COMMUNICATION),
     * when a call is established, i.e. [CallEventTypes.Connected] is invoked.
     *
     * In case of [RequestAudioFocusMode.REQUEST_ON_CALL_START], SDK requests audio focus when the call is started,
     * i.e. [Client.call] or [Call.answer] are called.
     *
     * If the application plays some audio, it may result in audio interruptions. To avoid this behaviour,
     * this option should be set to [RequestAudioFocusMode.REQUEST_ON_CALL_CONNECTED]
     * and application's audio should be stopped/paused on [CallEventTypes.ProgressToneStop].
     *
     * @android
     */
    requestAudioFocusMode?: RequestAudioFocusMode;
}

export interface ConnectOptions {
    /**
     * Checks whether UDP traffic will flow correctly between device and the Voximplant cloud. This check reduces connection speed
     */
    connectivityCheck?: boolean;
    /**
     * Server name of particular media gateway for connection
     */
    servers?: string[];
}

export interface LoginTokens {
    /**
     *  Seconds to access token expire
     */
    accessExpire: number;
    /**
     * Access token that can be used to login before accessExpire
     */
    accessToken: string;
    /**
     * Seconds to refresh token expire
     */
    refreshExpire: number;
    /**
     * Refresh token that can be used one time before refresh token expired
     */
    refreshToken: string;
}

export interface CallSettings {
    /**
     * Custom string associated with the call session.
     * It can be passed to the cloud to be obtained from the [CallAlerting](/docs/references/voxengine/appevents#callalerting) event
     * or [Call History](/docs/references/httpapi/managing_history#getcallhistory) using HTTP API.
     * Maximum size is 200 bytes. Use the [Call.sendMessage] method to pass a string over the limit;
     * in order to pass a large data use [media_session_access_url](/docs/references/httpapi/managing_scenarios#startscenarios) on your backend.
     */
    customData?: string | null;
    /**
     * Optional custom parameter (SIP headers) that should be passes with call (INVITE) message. Parameter names must start with "X-" to be processed. Headers size limit is 200  bytes
     */
    extraHeaders?: {[key:string]:string} | null;
    /**
     * Specify if the outgoing call on iOS will be made with CallKit. Applicable only for outgoing calls.
     * @ios
     */
    setupCallKit?: boolean;
}
