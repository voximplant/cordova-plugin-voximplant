/*
* Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
*/


/**
 * @ignore
 */
import {Call} from "./Call";

export class CallManager {
    private static _instance: CallManager;
    private _calls: Map<string, Call>;
    // private _endpoints: Map<string, Set<Endpoint>>;
    // private _videoStreams: Map<string, Set<VideoStream>>;

    private constructor() {
        this._calls = new Map();
        // this._endpoints = new Map();
        // this._videoStreams = new Map();
    }

    static getInstance(): CallManager {
        if (!CallManager._instance) {
            CallManager._instance = new CallManager();
        }
        return CallManager._instance;
    }

    addCall(call: Call) {
        this._calls.set(call.callId, call);
    }

    _handleCallEvent(event: string, params: any): void {
        let callId = params.callId;
        let call = this._calls.get(callId);
        call?._handleEvent(event, params);
    }

}
