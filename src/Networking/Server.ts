import {WebSocket, WebSocketServer} from 'ws';
import * as http from "http";
import ByteBuffer from "bytebuffer";
import * as keySender from "node-key-sender"

export class Server {

    private _server?: WebSocketServer;
    private _ip: string;
    private _port: number;

    constructor(ip: string, port: number) {
        this._ip = ip;
        this._port = port;
        this.init();
    }

    private init(): void {
        this._server = new WebSocketServer({ host: this._ip, port: this._port });

        this._server.on("connection", Server.handleConnection)
    }

    private static handleConnection(websocketConnection: WebSocket, request: http.IncomingMessage): void {
        console.log(`\x1b[32m[+] \x1b[0mNew user logged : ${request.socket.remoteAddress}:${request.socket.remotePort}`)


        websocketConnection.onmessage = function (msg) {
            Server.handleMessage(websocketConnection, msg);
        }

        websocketConnection.onclose = function() {
            Server.handleDisconnect(websocketConnection);
        }
    }

    private static handleMessage(connection: WebSocket, msg: MessageEvent): void {
        const buffer = new ByteBuffer();
        buffer.buffer = msg.data;
        const instruction_length = buffer.readInt8();
        const instr = buffer.readString(instruction_length);
        const code = buffer.readInt8();
        switch(instr) {
            case "PLAY_SOUND":
                keySender.sendCombination(['shift', `f${code}`])
                break;
            case "DISCORD":
                keySender.sendCombination(['alt', `f${code}`])
                break;
        }
    }

    private static handleDisconnect(connection: WebSocket): void {
        //
    }
}
