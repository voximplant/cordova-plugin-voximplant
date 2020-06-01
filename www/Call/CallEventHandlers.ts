/*
* Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
*/

import {Call} from "./Call";
import {CallError} from "../Enums";
import {Endpoint} from "./Endpoint";


/**
 * @private
 */
export interface CallEvent {
    /**
     * Name of the event
     */
    name: string;
    /**
     * Call that triggered the event
     */
    call: Call;
}

/**
 * @private
 */
export interface CallEventWithHeaders {
    /**
     * Name of the event
     */
    name: string;
    /**
     * Call that triggered the event
     */
    call: Call;
    /**
     * Optional SIP headers are received with the event
     */
    headers: object;
}

/**
 * @private
 */
export interface ICECompleted extends CallEvent {
}

/**
 * @private
 */
export interface ICETimeout extends CallEvent {
}

/**
 * @private
 */
export interface ProgressToneStart extends CallEventWithHeaders {
}

/**
 * @private
 */
export interface ProgressToneStop extends CallEvent {
}

/**
 * @private
 */
export interface Disconnected {
    /**
     * Name of the event
     */
    name: string;
    /**
     * Call that triggered the event
     */
    call: Call;
    /**
     * Optional SIP headers are received with the event
     */
    headers: object;
    /**
     * True if the call was answered on another device via SIP forking, false otherwise
     */
    answeredElsewhere: boolean;
}

/**
 * @private
 */
export interface Failed {
    /**
     * Name of the event
     */
    name: string;
    /**
     * Call that triggered the event
     */
    call: Call;
    /**
     * Optional SIP headers are received with the event
     */
    headers: object;
    /**
     * Call status code
     */
    code: number;
    /**
     * Status message of a call failure (i.e. Busy Here)
     */
    reason: string;
}

/**
 * @private
 * @ignore
 */
export interface InfoReceived {
    /**
     * Name of the event
     */
    name: string;
    /**
     * Call that triggered the event
     */
    call: Call;
    /**
     * Optional SIP headers are received with the event
     */
    headers: object;
    /**
     * MIME type of INFO message
     */
    mimeType: string;
    /**
     * Content of the message
     */
    body: string;
}

/**
 * @private
 */
export interface MessageReceived {
    /**
     * Name of the event
     */
    name: string;
    /**
     * Call that triggered the event
     */
    call: Call;
    /**
     * Content of the message
     */
    text: string;
}

/**
 * @private
 */
export interface CallOperationFailed {
    /**
     * Name of the event
     */
    name: string;
    /**
     * Error code
     */
    code: CallError;
    /**
     * Error description
     */
    message: string;
}

/**
 * @private
 */
export interface EndpointAdded {
    /**
     * Name of the event
     */
    name: string;
    /**
     * Call that triggered the event
     */
    call: Call;
    /**
     * New endpoint
     */
    endpoint: Endpoint;
}
