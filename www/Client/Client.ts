/*
* Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
*/


import {CallSettings, ClientConfig, ConnectOptions} from "../Structures";
import {ClientState, LogLevel, RequestAudioFocusMode, VideoCodec} from "../Enums";
import {ClientEventTypesList} from "../EventTypesList";
import {AuthResult, AuthTokenResult, ConnectionClosed, ConnectionEstablished, SDKReady} from "./ClientEventHandlers";
import {ClientEventTypes} from "./ClientEventTypes";
import {Call} from "../Call/Call";
import {CallManager} from "../Call/CallManager";
import {Endpoint} from "../Call/Endpoint";

export class Client {

    /**
     * @ignore
     */
    static _instance: Client;
    /**
     * @ignore
     */
    private _listeners: Map<ClientEventTypes, Set<Function>> = new Map();

    static getInstance(): Client {
        if (!Client._instance) {
            Client._instance = new Client();
        }
        return Client._instance;
    }

    public init(clientConfig?: ClientConfig): Promise<SDKReady> {
        console.log('VOXCRD: Client.init');
        return new Promise((resolve) => {
            let success = () => {
                console.log('VOXCRD: SDKReady');
                let event = {
                    name: 'SDKReady'
                };
                this._emit(ClientEventTypes.SDKReady, event);
                resolve(event);
            };
            if (!clientConfig) clientConfig = {};
            if (typeof clientConfig.bundleId === 'undefined') clientConfig.bundleId = "";
            if (typeof clientConfig.enableDebugLogging === 'undefined') clientConfig.enableDebugLogging = false;
            if (typeof clientConfig.enableLogcatLogging === 'undefined') clientConfig.enableLogcatLogging = true;
            if (typeof clientConfig.logLevel === 'undefined') clientConfig.logLevel = LogLevel.INFO;
            if (typeof clientConfig.requestAudioFocusMode === 'undefined') clientConfig.requestAudioFocusMode = RequestAudioFocusMode.REQUEST_ON_CALL_START;
            cordova.exec(success, ()=>{}, "VoximplantPlugin", "initClient", [clientConfig]);
        });
    }

    /**
     * Get current client state
     */
    public getClientState(): Promise<ClientState> {
        console.log('VOXCRD: Client.getClientState');
        return new Promise(resolve => {
            let success = (data: ClientState) => {
                console.log(`VOXCRD: Client.getClientState: ${data}`);
                resolve(data);
            };
            cordova.exec(success, ()=>{}, 'VoximplantPlugin', 'getClientState', []);
        });
    }

    /**
     * Connect to the Voximplant Cloud
     * @param options Connection options
     * @throws ConnectionFailed
     */
    public connect(options?: ConnectOptions): Promise<ConnectionEstablished> {
        console.log('VOXCRD: Client.connect');
        return new Promise((resolve, reject) => {
            let success = () => {
                console.log('VOXCRD: connection established');
                let event = {
                    name: 'ConnectionEstablished',
                };
                this._emit(ClientEventTypes.ConnectionEstablished, event);
                resolve(event);
            };
            let fail = (data: any) => {
                console.log(`VOXCRD: connection failed: ${data}`);
                let event = {
                    name: 'ConnectionFailed',
                    message: data,
                };
                this._emit(ClientEventTypes.ConnectionFailed, event);
                reject(event);
            };
            if (!options) options = {};
            if (typeof options.connectivityCheck === 'undefined') options.connectivityCheck = false;
            if (typeof options.servers === 'undefined') options.servers = [];
            cordova.exec(success, fail, 'VoximplantPlugin', 'connect', [options]);
        });
    }

    /**
     * Login to specified Voximplant application with password.
     * @param username Fully-qualified username that includes Voximplant user, application and account names. The format is: "username@appname.accname.voximplant.com".
     * @param password User password
     */
    public login(username: string, password: string): Promise<AuthResult> {
        console.log('VOXCRD: Client.login');
        return new Promise((resolve, reject) => {
            let success = (data: AuthResult) => {
                console.log('VOXCRD: Client.login successfully');
                data.result = true;
                data.name = 'AuthResult';
                this._emit(ClientEventTypes.AuthResult, data);
                resolve(data);
            };
            let fail = (data: AuthResult) => {
                console.log('VOXCRD: Client.login failed');
                data.result = false;
                data.name = 'AuthResult';
                this._emit(ClientEventTypes.AuthResult, data);
                reject(data);
            };
            let params = {
                username: username,
                password: password,
            };
            cordova.exec(success, fail, 'VoximplantPlugin', 'login', [params]);
        });
    }

    /**
     * Login to specified Voximplant application using accessToken
     * @param username Fully-qualified username that includes Voximplant user, application and account names. The format is: "username@appname.accname.voximplant.com".
     * @param token Access token that was obtained in AuthResult event
     */
    public loginWithToken(username: string, token: string): Promise<AuthResult> {
        console.log('VOXCRD: Client.loginWithToken');
        return new Promise((resolve, reject) => {
            let success = (data: AuthResult) => {
                console.log('VOXCRD: Client.loginWithToken successfully');
                data.result = true;
                data.name = 'AuthResult';
                this._emit(ClientEventTypes.AuthResult, data);
                resolve(data);
            };
            let fail = (data: AuthResult) => {
                console.log('VOXCRD: Client.loginWithToken failed');
                data.result = false;
                data.name = 'AuthResult';
                this._emit(ClientEventTypes.AuthResult, data);
                reject(data);
            };
            let params = {
                username: username,
                token: token,
            };
            cordova.exec(success, fail, 'VoximplantPlugin', 'loginWithToken', [params]);
        });
    }

    /**
     * Login to specified Voximplant application using 'onetimekey' auth method. Hash should be calculated with the key received in AuthResult event.
     * Please, read [howto page](http://voximplant.com/docs/quickstart/24/automated-login/)
     * @param username Fully-qualified username that includes Voximplant user, application and account names. The format is: "username@appname.accname.voximplant.com".
     * @param hash Hash that was generated using following formula: MD5(oneTimeKey+"|"+MD5(user+":voximplant.com:"+password)).
     * Please note that here user is just a user name, without app name, account name or anything else after "@".
     * So if you pass myuser@myapp.myacc.voximplant.com as a username, you should only use myuser while computing this hash.
     */

    public loginWithOneTimeKey(username: string, hash: string): Promise<AuthResult> {
        console.log('VOXCRD: Client.loginWithOneTimeKey');
        return new Promise((resolve, reject) => {
           let success = (data: AuthResult) => {
               console.log('VOXCRD: Client.loginWithOneTimeKey: successfully');
               data.result = true;
               data.name = 'AuthResult';
               this._emit(ClientEventTypes.AuthResult, data);
               resolve(data);
           };
           let fail = (data: AuthResult) => {
               console.log('VOXCRD: Client.loginWithOneTimeKey failed');
               data.result = false;
               data.name = 'AuthResult';
               this._emit(ClientEventTypes.AuthResult, data);
               reject(data);
           };
           let params = {
               username: username,
               hash: hash,
           };
           cordova.exec(success, fail, 'VoximplantPlugin', 'loginWithOneTimeKey', [params]);
        });
    }

    /**
     * Request a key for 'onetimekey' auth method. Server will send the key in AuthResult event with code 302
     * @param username Fully-qualified username that includes Voximplant user, application and account names. The format is: "username@appname.accname.voximplant.com".
     */
    public requestOneTimeLoginKey(username: string): Promise<AuthResult> {
        console.log('VOXCRD: Client.requestOneTimeLoginKey');
        return new Promise((resolve, reject) => {
            let success = (data: AuthResult) => {
                console.log('VOXCRD: Client.requestOneTimeLoginKey: successfully');
                data.name = 'AuthResult';
                this._emit(ClientEventTypes.AuthResult, data);
                if (data.result) {
                    resolve(data);
                } else {
                    reject(data);
                }
            };
            let fail = (data: AuthResult) => {
                console.log('VOXCRD: Client.requestOneTimeLoginKey: failed');
                data.result = false;
                data.name = 'AuthResult';
                this._emit(ClientEventTypes.AuthResult, data);
                reject(data);
            };
            let params = {
                username: username,
            };
            cordova.exec(success, fail, 'VoximplantPlugin', 'requestOneTimeLoginKey', [params]);
        });
    }

    /**
     * Refresh expired access token
     * @param username Fully-qualified username that includes Voximplant user, application and account names. The format is: "username@appname.accname.voximplant.com".
     * @param refreshToken Refresh token that was obtained in AuthResult event
     */
    public tokenRefresh(username: string, refreshToken: string): Promise<AuthTokenResult> {
        console.log('VOXCRD: Client.tokenRefresh');
        return new Promise((resolve, reject) => {
            let success = (data: AuthTokenResult) => {
                console.log('VOXCRD: Client.tokenRefresh: successfully');
                data.name = 'AuthTokenResult';
                data.result = true;
                this._emit(ClientEventTypes.RefreshTokenResult, data);
                resolve(data);
            };
            let fail = (data: AuthTokenResult) => {
                console.log('VOXCRD: Client.tokenRefresh failed');
                data.result = false;
                data.name = 'AuthTokenResult';
                this._emit(ClientEventTypes.RefreshTokenResult, data);
                reject(data);
            };
            let params = {
                username: username,
                token: refreshToken,
            };
            cordova.exec(success, fail, 'VoximplantPlugin', 'tokenRefresh', [params]);
        });
    }

    /**
     * Disconnect from the Voximplant Cloud
     */
    public disconnect(): Promise<ConnectionClosed> {
        console.log('VOXCRD: Client.disconnect');
        return new Promise(resolve => {
            let success = () => {
                console.log('VOXCRD: Client.disconnected');
                let data = {
                    name: 'ConnectionClosed',
                };
                this._emit(ClientEventTypes.ConnectionClosed, data);
                resolve(data);
            };
            cordova.exec(success, ()=>{}, 'VoximplantPlugin', 'disconnect', []);
        });
    }

    /**
     * Create outgoing call.
     *
     * Important: There is a difference between resolving the [Client.call] promise and handling [CallEventTypes].
     *
     * If the promise is resolved, the SDK sends a call to the cloud. However, it doesn't mean that a call is connected;
     * to catch this call state, subscribe to the [CallEventTypes.Connected] event.
     *
     * If the promise is rejected, that indicates the issues in the application's code (e.g., a try to make a call without login to the Voximplant cloud);
     * in case of the CallFailed event is triggered, that means a telecom-related issue (e.g., another participant rejects a call).
     *
     * @param number The number to call. For SIP compatibility reasons it should be a non-empty string even if the number itself is not used by a Voximplant cloud scenario.
     * @param callSettings Optional call settings
     */
    public call(number: string, callSettings: CallSettings): Promise<Call> {
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
        return new Promise((resolve, reject) => {
            let success = (callId: string) => {
                console.log('VOXCRD: Client.call: successfully started');
                let call = new Call(callId, null);
                CallManager.getInstance().addCall(call);
                resolve(call);
            };
            let fail = (error: string) => {
                console.log('VOXCRD: Client.call: failed');
                reject(error);
            };
            cordova.exec(success, fail, 'VoximplantPlugin', 'call', [number, callSettings_]);
        });
    }

    /**
     * Register handler for specified client event.
     * Use [Client.off] method to delete a handler.
     * @param eventType
     * @param event Handler function
     */
    public on<T extends keyof ClientEventTypesList>(eventType: T|ClientEventTypes, event: (ev: ClientEventTypesList[T]) => void): void {
        if (!event || !(typeof event === 'function')) {
            console.warn('VOXCRD: Client: on: handler is not a Function');
            return;
        }
        if (!ClientEventTypes[eventType]) {
            console.warn(`VOXCRD: Client: on: ClientEventTypes does not contain ${eventType} event`);
            return;
        }
        if(!this._listeners.has(eventType)) {
            this._listeners.set(eventType, new Set());
        }
        // @ts-ignore
        this._listeners.get(eventType).add(event);
    }

    /**
     * Remove handler for specified event
     * @param eventType
     * @param event Handler function. If not specified, all handlers for the event will be removed.
     */
    public off<T extends keyof ClientEventTypesList>(eventType: T|ClientEventTypes, event?: (ev: ClientEventTypesList[T]) => void): void {
        if (!this._listeners.has(eventType)) {
            return;
        }
        if (!ClientEventTypes[eventType]) {
            console.warn(`VOXCRD: Client: off: ClientEventTypes does not contain ${eventType} event`);
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
     * @ignore
     */
    private _emit(eventType: ClientEventTypes, event: object): void {
        const handlers = this._listeners.get(eventType);
        if (handlers) {
            handlers.forEach(handler => handler(event));
        }
    }


    // @ts-ignore
    private _onEvent(event: string, params: any): void {
        if (event.startsWith('Call') || (event.startsWith('Endpoint'))) {
            CallManager.getInstance()._handleCallEvent(event, params);
        }
        if (event === 'IncomingCall') {
            let client = Client.getInstance();
            let endpoint = new Endpoint(params.endpointId, params.displayName, params.sipUri, params.userName);
            let call = new Call(params.callId, endpoint);
            CallManager.getInstance().addCall(call);
            params.name = event;
            delete params.callId;
            delete params.endpointId;
            delete params.displayName;
            delete params.sipUri;
            delete params.userName;
            params.call = call;
            client._emit(ClientEventTypes.IncomingCall, params);
        }
    }

}
