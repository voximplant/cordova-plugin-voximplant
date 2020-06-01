/*
* Copyright (c) 2011-2020, Zingaya, Inc. All rights reserved.
*/

export enum ClientEventTypes {
    /**
     * @typedef EventHandlers.ConnectionEstablished
     */
    ConnectionEstablished = 'ConnectionEstablished',
    /**
     * @typedef EventHandlers.ConnectionFailed
     */
    ConnectionFailed      = 'ConnectionFailed',
    /**
     * @typedef EventHandlers.ConnectionClosed
     */
    ConnectionClosed      = 'ConnectionClosed',
    /**
     * @typedef EventHandlers.AuthResult
     */
    AuthResult            =  'AuthResult',
    /**
     * @typedef EventHandlers.AuthTokenResult
     */
    RefreshTokenResult    = 'RefreshTokenResult',
    /**
     * @typedef EventHandlers.IncomingCall
     */
    IncomingCall          = 'IncomingCall',
    /**
     * @typedef EventHandlers.SDKReady
     */
    SDKReady              = 'SDKReady',
}
