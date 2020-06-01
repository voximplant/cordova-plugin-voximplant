/*
* Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
*/

import {CallSettings} from "../Structures";
import {VideoCodec} from "../Enums";
import {CallEventTypes} from "./CallEventTypes";
import {CallEventTypesList} from "../EventTypesList";
import {Endpoint} from "./Endpoint";
import {EndpointEventTypes} from "./EndpointEventTypes";

export class Call {

    /**
     * The call id
     */
    public callId: string;

    /**
     * @ignore
     */
    private _listeners: Map<CallEventTypes, Set<Function>> = new Map();

    private _endpoints: Map<string, Endpoint> = new Map();

    /**
     * @ignore
     */
    constructor(callId: string, endpoint: Endpoint|null) {
        this.callId = callId;
        if (endpoint) {
            this._endpoints.set(endpoint.id, endpoint);
        }
    }

    public getEndpoints():Array<Endpoint> {
        return Array.from(this._endpoints.values());
    }

    /**
     * Register a handler for the specified call event.
     * One event can have more than one handler.
     * Use the [Call.off] method to delete a handler.
     * @param eventType
     * @param event Handler function. A single parameter is passed - object with event information
     */
    public on<T extends keyof CallEventTypesList>(eventType: T|CallEventTypes, event: (ev: CallEventTypesList[T]) => void): void {
        if (!event || typeof event !== 'function') {
            console.warn(`Call: on: handler is not a Function`);
            return;
        }
        if (Object.values(CallEventTypes).indexOf(eventType) === -1) {
            console.warn(`Call: on: CallEventTypes does not contain ${eventType} event`);
            return;
        }
        if (!this._listeners.has(eventType)) {
            this._listeners.set(eventType, new Set());
        }
        // @ts-ignore
        this._listeners.get(eventType).add(event);
    }

    /**
     * Remove a handler for the specified call event.
     * @param eventType
     * @param event Handler function. If not specified, all handlers for the event will be removed.
     */
    public off<T extends keyof CallEventTypesList>(eventType: T|CallEventTypes, event?: (ev: CallEventTypesList[T]) => void): void {
        if (!this._listeners.has(eventType)) {
            return;
        }
        if (Object.values(CallEventTypes).indexOf(eventType) === -1) {
            console.warn(`Call: off: CallEventTypes does not contain ${eventType} event`);
            return;
        }
        if (event && typeof event === 'function') {
            // @ts-ignore
            this._listeners.get(eventType).delete(event);
        } else {
            this._listeners.set(eventType, new Set());
        }
    }

    /**
     * Answer the incoming call.
     * @param callSettings Optional set of call settings.
     */
    public answer(callSettings?: CallSettings): void {
        const defaults = {
            preferredVideoCodec: VideoCodec.AUTO,
            customData: null,
            extraHeaders: null,
            setupCallKit: false,
            video: {
                sendVideo: false,
                receiveVideo: true
            }
        };
        let callSettings_ = {...defaults,...callSettings};
        cordova.exec(()=>{}, ()=>{}, 'VoximplantPlugin', 'answer', [this.callId, callSettings_]);
    }

    /**
     * Reject incoming call on all devices, where this user logged in.
     * @param headers Optional custom parameters (SIP headers) that should be sent after rejecting incoming call.
     *                Parameter names must start with "X-" to be processed by application
     */
    public decline(headers?: object): void {
        cordova.exec(()=>{}, ()=>{}, 'VoximplantPlugin', 'decline', [this.callId, headers]);
    }

    /**
     * Reject incoming call on the part of React Native SDK.
     *
     * If a call is initiated from the PSTN, the network will receive "reject" command.
     *
     * In case of a call from another React Native SDK client, it will receive the [CallEventTypes.Failed] event with the 603 code.
     *
     * @param headers Optional custom parameters (SIP headers) that should be sent after rejecting incoming call.
     *                Parameter names must start with "X-" to be processed by application
     */
    public reject(headers?: object): void {
        cordova.exec(()=>{}, ()=>{}, 'VoximplantPlugin', 'reject', [this.callId, headers]);
    }

    /**
     * Enables or disables audio transfer from microphone into the call.
     * @param enable True if audio should be sent, false otherwise
     */
    public sendAudio(enable: boolean): void {
        cordova.exec(()=>{}, ()=>{}, 'VoximplantPlugin', 'sendAudio', [this.callId, enable]);
    }

    /**
     * Send tone (DTMF). It triggers the [CallEventTypes.ToneReceived](/docs/references/appengine/CallEvents.html#CallEvents_ToneReceived) event in the Voximplant cloud.
     * @param key Send tone according to pressed key: 0-9 , * , #
     */
    public sendTone(key: string): void {
        cordova.exec(()=>{}, ()=>{}, 'VoximplantPlugin', 'sendTone', [this.callId, key]);
    }

    /**
     * Hangup the call
     * @param headers Optional custom parameters (SIP headers) that should be sent after disconnecting/cancelling call.
     *                Parameter names must start with "X-" to be processed by application
     */
    public hangup(headers?: object): void {
        cordova.exec(()=>{}, ()=>{}, 'VoximplantPlugin', 'hangup', [this.callId, headers]);
    }

    /**
     * Send text message.
     *
     * It is a special case of the [Call.sendInfo] method as it allows to send messages only of "text/plain" type.
     *
     * You can get this message via the Voxengine [CallEventTypes.MessageReceived](/docs/references/voxengine/callevents#messagereceived) event in our cloud.
     *
     * You can get this message in React Native SDK on other side via the [CallEventTypes.MessageReceived] event; see the similar
     * events for the [Web](/docs/references/websdk), [iOS](/docs/references/iossdk) and [Android](/docs/references/androidsdk) SDKs.
     *
     * @param message Message text
     */
    public sendMessage(message: string): void {
        cordova.exec(()=>{}, ()=>{}, 'VoximplantPlugin', 'sendMessage', [this.callId, message]);
    }

    /**
     * Send Info (SIP INFO) message inside the call.
     *
     * You can get this message via the Voxengine [CallEventTypes.InfoReceived](/docs/references/voxengine/callevents#inforeceived)
     * event in the Voximplant cloud.
     *
     * You can get this message in React Native SDK on other side via the [CallEventTypes.InfoReceived] event; see the similar
     * events for the [Web](/docs/references/websdk),
     * [iOS](/docs/references/iossdk) and [Android](/docs/references/androidsdk) SDKs.
     *
     * @param mimeType MIME type of the message, for example "text/plain", "multipart/mixed" etc.
     * @param body Message content
     * @param headers Optional custom parameters (SIP headers) that should be sent after rejecting incoming call.
     *                Parameter names must start with "X-" to be processed by application
     */
    public sendInfo(mimeType: string, body: string, headers?: object): void {
        let info = {
            type: mimeType,
            body: body,
            headers: headers,
        };
        cordova.exec(()=>{}, ()=>{}, 'VoximplantPlugin', 'sendInfo', [this.callId, info]);
    }
    //
    // public getEndpoints():Endpoint[] {
    //
    // }


    /**
     * Hold or unhold the call
     * @param enable True if the call should be put on hold, false for unhold
     * @throws EventHandlers.CallOperationFailed
     */
    public hold(enable: boolean): Promise<void | CallEventTypes.CallOperationFailed> {
        return new Promise((resolve, reject) => {
            let success = () => {
                resolve();
            };
            let fail = () => {
                reject();
            };
            cordova.exec(success, fail, 'VoximplantPlugin', 'hold', [this.callId, enable]);
        });
    }
    //
    // public receiveVideo()




    _handleEvent(event: string, params: any): void {
        this._replaceCallIdWithCallInEvent(params);
        let eventName = null;
        if (event.startsWith('Call')) {
            eventName = event.replace('Call', '');
        }
        if (event.startsWith('Endpoint')) {
            eventName = event.replace('Endpoint', '');
        }
        if (eventName != null && (Object.keys(CallEventTypes).indexOf(eventName) !== -1 || Object.keys(EndpointEventTypes).indexOf(eventName) !== -1)) {
            params.name = eventName;
        }
        if (eventName === 'EndpointAdded') {
            let endpoint = new Endpoint(params.endpointId, params.displayName, params.sipUri, params.userName);
            this._endpoints.set(params.endpointId, endpoint);
            delete params.endpointId;
            delete params.displayName;
            delete params.sipUri;
            delete params.userName;
            params.endpoint = endpoint;
            this._emit(CallEventTypes.EndpointAdded, params);
        }
        if (eventName === 'Disconnected') {
            this._emit(CallEventTypes.Disconnected, params);
        }
        if (eventName === 'Connected') {
            this._emit(CallEventTypes.Connected, params);
        }
        if (eventName === 'ProgressToneStart') {
            this._emit(CallEventTypes.ProgressToneStart, params);
        }
        if (eventName === 'ProgressToneStop') {
            this._emit(CallEventTypes.ProgressToneStop, params);
        }
        if (eventName === 'Failed') {
            this._emit(CallEventTypes.Failed, params);
        }
        if (eventName === 'ICECompleted') {
            this._emit(CallEventTypes.ICECompleted, params);
        }
        if (eventName === 'ICETimeout') {
            this._emit(CallEventTypes.ICETimeout, params);
        }
        if (eventName === 'InfoReceived') {
            this._emit(CallEventTypes.InfoReceived, params);
        }
        if (eventName === 'MessageReceived') {
            this._emit(CallEventTypes.MessageReceived, params);
        }
        if (eventName === 'InfoUpdated') {
            let endpointId = params.endpointId;
            let endpoint = this._endpoints.get(endpointId);
            if (endpoint) {
                endpoint._handleEvent(EndpointEventTypes.InfoUpdated, params);
            }
        }
    }

    /**
     * @ignore
     */
    private _replaceCallIdWithCallInEvent(data: any) {
        delete data.callId;
        data.call = this;
    }

    /**
     * @ignore
     */
    private _emit(eventType: CallEventTypes, event: object) {
        console.log(`VOXCRD: Call._emit: ready to emit event: ${eventType}`);
        const handlers = this._listeners.get(eventType);
        handlers!.forEach(handler => handler(event));
    }

}
