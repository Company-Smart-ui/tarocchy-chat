import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { getCookie } from "./functions";

import globalThis from "./Global";

import Chat from "./Chat";
import Login from "./Login";
import Register from "./Register";
import Admin from "./Admin";
import Log from "./Log";
import Chatlog from "./Chatlog";
import ChatlogAdmin from "./ChatlogAdmin";
import AdminLogin from "./AdminLogin";
import AgentLogin from "./AgentLogin";
import UserPanel from "./UserPanel";
import AgentPanel from "./AgentPanel";
import Earnings from "./Earnings";
import EarningsAdmin from "./EarningsAdmin";
import PhonePanel from "./PhonePanel";
import { settings } from "./settings";

import { ToastContainer } from "react-toastify";

import { events } from "./ServerCommunication";

import { colors } from "./settings";
//ws://134.122.23.207:8020/chatapp_unsafe
const remote = "wss://do.tarocchy.com:8120";
const local = "ws://localhost:8110";
globalThis.url = remote;

if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    globalThis.isIOS = true;
}

for (const event in events) {
    globalThis.events.registerEvent(events[event]);
}

let url = window.location.href;
let paramaters = new URL(url).searchParams;
globalThis.agent = paramaters.get("pin");
if (!globalThis.agent) globalThis.agent = getCookie("agentPin");
document.cookie = `agentPin=${globalThis.agent}`;
globalThis.email = getCookie("email");
globalThis.password = getCookie("password");

//const url = "ws://localhost:8443"; //"ws://134.122.23.207:8443";

function App() {
    useEffect(() => {
        // console.log('SOCKET CREATED!');
        let socket = new WebSocket(globalThis.url);
        socket.onopen = socketOnOpen;
        socket.onerror = socketOnError;
        socket.onclose = socketOnClose;
        socket.onmessage = socketOnMessage;
        globalThis.socket = socket;
    }, []);

    function socketOnClose() {
        globalThis.online = false;
        globalThis.guests = [];
        globalThis.events.triggerEvent(events.disconnected);
        setTimeout(() => {
            reconnect();
        }, 3000);
        console.log("Connection closed");
    }

    function socketOnError() {
        globalThis.socket.close();
        globalThis.online = false;
        console.log("WebSocket error");
    }

    function reconnect() {
        //   console.log('Attempting to reconnect...');
        let socket = new WebSocket(globalThis.url);
        socket.onopen = socketOnOpen;
        socket.onerror = socketOnError;
        socket.onclose = socketOnClose;
        socket.onmessage = socketOnMessage;
        globalThis.socket = socket;
    }

    function socketOnMessage(e) {
        let data = JSON.parse(e.data);
        for (const event in events) {
            if (data.event === events[event]) {
                globalThis.events.triggerEvent(events[event], data);
            }
        }
    }

    function socketOnOpen() {
        // toast.success("Connected to the chat server");
        console.log("%csocket open", colors.success);
        globalThis.events.triggerEvent(events.login);
        globalThis.events.triggerEvent(events.agentDetailsRequest);
        globalThis.online = true;
        keepConnection();
    }

    function keepConnection() {
        if (globalThis.online) {
            globalThis.socket.send(JSON.stringify({ events: "ping" }));
            setTimeout(() => {
                keepConnection();
            }, 15000);
        }
    }

    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/chat" element={<Login />} />
                    <Route path="/chat/register" element={<Register />} />
                    <Route path="/chat/chat" element={<Chat />} />
                    <Route path="/chat/agent-panel" element={<AgentPanel />} />
                    <Route path="/chat/agent-panel/earnings" element={<Earnings />} />
                    <Route path="/chat/admin/earnings" element={<EarningsAdmin />} />
                    <Route path="/chat/admin" element={<Admin />} />
                    <Route path="/chat/agent-panel/earnings/chatlog" element={<Chatlog />} />
                    <Route path="/chat/admin/earnings/chatlog" element={<ChatlogAdmin />} />
                    <Route path="/chat/admin/log" element={<Log />} />
                    <Route path="/chat/admin-login" element={<AdminLogin />} />
                    <Route path="/chat/agent-login" element={<AgentLogin />} />
                    <Route path="/chat/user" element={<UserPanel />} />
                    <Route path="/chat/call" element={<PhonePanel />} />
                </Routes>
            </BrowserRouter>
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} draggable limit={3} />
            {settings.showVersion && <div className="version">{settings.version}</div>}
        </div>
    );
}

export default App;
