/*
* Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
*/


/**
 * Enum of log levels.
 * @ios
 */
export enum LogLevel {
    /**
     * Log verbosity level, to include only error messages
     * @ios
     */
    ERROR = 'error',
    /**
     * Log verbosity level to include warning messages
     * @ios
     */
    WARNING = 'warning',
    /**
     * Default log verbosity level, to include informational messages
     * @ios
     */
    INFO = 'info',
    /**
     * Log verbosity level to include debug messages
     * @ios
     */
    DEBUG = 'debug',
    /**
     * Log verbosity level to include verbose messages
     * @ios
     */
    VERBOSE = 'verbose'
}

/**
 * The client states
 */
export enum ClientState {
    /**
     * The client is currently disconnected
     */
    DISCONNECTED = 'disconnected',
    /**
     * The client is currently connecting
     */
    CONNECTING = 'connecting',
    /**
     * The client is currently connected
     */
    CONNECTED = 'connected',
    /**
     * The client is currently logging in
     */
    LOGGING_IN = 'logging_in',
    /**
     * The client is currently logged in
     */
    LOGGED_IN = 'logged_in'
}


/**
 * Call related errors
 */
export enum CallError {
    /**
     * The call is already in requested state
     */
    ALREADY_IN_THIS_STATE = 'ALREADY_IN_THIS_STATE',
    /**
     * Requested functionality is disabled
     */
    FUNCTIONALITY_IS_DISABLED = 'FUNCTIONALITY_IS_DISABLED',
    /**
     * Operation is incorrect, for example reject outgoing call
     */
    INCORRECT_OPERATION = 'INCORRECT_OPERATION',
    /**
     * Internal error occurred
     */
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    /**
     * Operation can't be performed due to the call is on hold. Unhold the call and repeat the operation
     */
    MEDIA_IS_ON_HOLD = 'MEDIA_IS_ON_HOLD',
    /**
     * Operation can't be performed due to missing permission
     */
    MISSING_PERMISSION = 'MISSING_PERMISSION',
    /**
     * Operation can't be performed due to the client is not logged in
     */
    NOT_LOGGED_IN = 'NOT_LOGGED_IN',
    /**
     * Operation is rejected
     */
    REJECTED = 'REJECTED',
    /**
     * Operation is not completed in time
     */
    TIMEOUT = 'TIMEOUT'
}

/**
 * Request audio focus modes.
 */
export enum RequestAudioFocusMode {
    /**
     * Request of audio focus is performed when a call is started.
     */
    REQUEST_ON_CALL_START = 'REQUEST_ON_CALL_START',
    /**
     * Request of audio focus is performed when a call is established.
     */
    REQUEST_ON_CALL_CONNECTED = 'REQUEST_ON_CALL_CONNECTED'
}

/**
 * Enum representing supported video codecs
 */
export enum VideoCodec {
    /**
     * VP8 video codec
     */
    VP8 = 'VP8',
    /**
     * H264 video codec
     */
    H264 = 'H264',
    /**
     * Video codec for call will be chosen automatically
     */
    AUTO = 'AUTO'
}




