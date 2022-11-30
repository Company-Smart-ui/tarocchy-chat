import React from "react";
import "./App.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import globalThis from "./Global";
import { accountType, events } from "./ServerCommunication";

export default function Chatlog() {
    const data = useLocation();
    let navigate = useNavigate();
    var chatlog = data.state.chatlog;

    useEffect(() => {
        globalThis.events.addEventListener(events.disconnected, disconnected);
        return function cleanup() {
            globalThis.events.removeEventListener(events.disconnected);
        };
    });

    function disconnected() {
        navigate("/chat/agent-login");
    }

    function convertTimestamp(timestamp) {
        const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        var date = new Date(timestamp);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        return (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    return (
        <div className="App">
            <div className="log-container">
                <button
                    onClick={function () {
                        navigate("/chat/agent-panel/earnings");
                    }}
                >
                    Go back
                </button>
                {chatlog.map((item, i) => {
                    console.log("asd");
                    return (
                        <ul key={i}>
                            <li className="log-style" key={i}>
                                {convertTimestamp(item.timestamp)} {item.senderUsername} : {item.message}
                            </li>
                        </ul>
                    );
                })}
            </div>
        </div>
    );
}
