import React from "react";
import "./App.css";
import globalThis from "./Global";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { validPassword, validEmail } from "./functions";
import { events, responses } from "./ServerCommunication";
import PasswordPanel from "./Components/PasswordPanel";

export default function AgentPanel() {
    let navigate = useNavigate();

    useEffect(() => {
        globalThis.events.addEventListener(events.disconnected, disconnected);
        return function cleanup() {
            globalThis.events.removeEventListener(events.disconnected);
        };
    });

    function disconnected() {
        navigate("/chat/agent-login");
    }

    function logOut() {
        globalThis.socket.close();
        globalThis.guests = [];
        navigate("/chat/agent-login");
    }

    return (
        <div className="register_login_container">
            <div className="agent-panel-container">
                <p className="agent-panel-title">Agent Panel</p>
                <button
                    className="agent-panel-button"
                    onClick={function () {
                        navigate("/chat/agent-panel/earnings");
                    }}
                >
                    Earnings
                </button>
                <button
                    className="agent-panel-button"
                    onClick={function () {
                        navigate("/chat/chat");
                    }}
                >
                    Start Chatting
                </button>
                <button className="agent-panel-button" onClick={logOut}>
                    Log out
                </button>
            </div>
        </div>
    );
}
