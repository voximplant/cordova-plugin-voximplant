/*
* Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
*/

import {LoginTokens} from "../Structures";
import {Call} from "..";

/**
 * @private
 */
export interface AuthResult {
    /**
     * Name of the event
     */
    name: string;
    /**
     * True in case of success, false - otherwise
     */
    result: boolean;
    /**
     * Auth result error code
     */
    code: number;
    /**
     * Authorized user's display name
     */
    displayName: string;
    /**
     * This parameter is used to calculate hash parameter for [Client.loginWithOneTimeKey method.
     * AuthResult with the key dispatched after [Client.requestOneTimeLoginKey] method was called.
     */
    key: string;
    /**
     * New tokens structure
     */
    tokens: LoginTokens;
}

/**
 * @private
 */
export interface AuthTokenResult {
    /**
     * Name of the event
     */
    name: string;
    /**
     * True in case of success, false - otherwise
     */
    result: boolean;
    /**
     * Auth result error code
     */
    code: number;
    /**
     * New tokens structure
     */
    tokens: LoginTokens;
}

/**
 * @private
 */
export interface ConnectionFailed {
    /**
     * Name of the event
     */
    name: string;
    /**
     * Failure reason description
     */
    message: string;
}

/**
 * @private
 */
export interface ConnectionEstablished {
    /**
     * Name of the event
     */
    name: string;
}

/**
 * @private
 */
export interface ConnectionClosed {
    /**
     * Name of the event
     */
    name: string;
}

/**
 * @private
 */
export interface IncomingCall {
    /**
     * Name of the event
     */
    name: string;
    /**
     * Incoming call instance. See [Call] methods for details
     */
    call: Call;
    /**
     * Optional SIP headers received with the event
     */
    headers: object;
    /**
     * True if the caller initiated video call
     */
    video: boolean;
}

/**
 * @private
 */
export interface SDKReady {
    /**
     * Name of the event
     */
    name: string;
}
