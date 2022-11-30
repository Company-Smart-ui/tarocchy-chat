import React from "react";
import "../App.css";
import { userStatus, events } from "../ServerCommunication";
import { useState, useEffect } from "react";
import globalThis from "../Global";

export default function Dropdown() {
    const [agentStatus, setAgentStatus] = useState(userStatus.online);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        globalThis.events.addEventListener(events.statusChange, statusChange);
        return function cleanup() {
            globalThis.events.removeEventListener(events.statusChange);
        };
    });
    const style = {};

    style[userStatus.online] = {
        color: "#00ff00",
        backgroundColor: "#2980b9",
        textColor: "black",
        text: "ONLINE",
    };
    style[userStatus.away] = {
        color: "red",
        backgroundColor: "#2980b9",
        textColor: "black",
        text: "AWAY",
    };
    style[userStatus.busy] = {
        color: "orange",
        backgroundColor: "#2980b9",
        textColor: "black",
        text: "BUSY",
    };
    style[userStatus.offline] = {
        color: "gray",
        backgroundColor: "#2980b9",
        textColor: "black",
        text: "OFFLINE",
    };

    function statusChange(data) {
        setAgentStatus(data.userStatus);
    }

    function openDropdown() {
        if (open) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    }
    window.onclick = function (event) {
        if (!event.target.matches("#main-button")) {
            if (open) {
                setOpen(false);
            }
        }
    };

    function requestButtonChange(data) {
        var agentStatus = userStatus[data.target.dataset.name];
        console.log(agentStatus);
        globalThis.socket.send(
            JSON.stringify({
                event: events.setStatusRequest,
                userStatus: agentStatus,
            })
        );
    }

    return (
        <div className="dropdown-container">
            <button style={{ backgroundColor: style[agentStatus].backgroundColor }} id="main-button" onClick={openDropdown} className="status-button">
                <div style={{ color: style[agentStatus].textColor }} id="main-button-text" className="pointer-none">
                    {style[agentStatus].text}
                </div>
                <span style={{ backgroundColor: style[agentStatus].color }} id="main-button-status" className="agent-status-header pointer-none"></span>
            </button>
            {open && (
                <div id="myDropdown" className="dropdown-items">
                    {agentStatus !== userStatus.online && (
                        <button data-name="online" className="status-button  inactive-status-button" onClick={requestButtonChange.bind(this)}>
                            <div style={{ color: style[userStatus.online].textColor }} className="pointer-none">
                                {style[userStatus.online].text}
                            </div>
                            <span style={{ backgroundColor: style[userStatus.online].color }} className="agent-status-header pointer-none"></span>
                        </button>
                    )}
                    {agentStatus !== userStatus.busy && (
                        <button data-name="busy" className="status-button inactive-status-button" onClick={requestButtonChange.bind(this)}>
                            <div style={{ color: style[userStatus.busy].textColor }} className="pointer-none">
                                {style[userStatus.busy].text}
                            </div>
                            <span style={{ backgroundColor: style[userStatus.busy].color }} className="agent-status-header pointer-none"></span>
                        </button>
                    )}
                    {agentStatus !== userStatus.away && (
                        <button data-name="away" className="status-button inactive-status-button" onClick={requestButtonChange.bind(this)}>
                            <div style={{ color: style[userStatus.away].textColor }} className="pointer-none">
                                {style[userStatus.away].text}
                            </div>
                            <span style={{ backgroundColor: style[userStatus.away].color }} className="agent-status-header pointer-none"></span>
                        </button>
                    )}
                    {agentStatus !== userStatus.offline && (
                        <button data-name="offline" className="status-button  inactive-status-button" onClick={requestButtonChange.bind(this)}>
                            <div style={{ color: style[userStatus.offline].textColor }} className="pointer-none">
                                {style[userStatus.offline].text}
                            </div>
                            <span style={{ backgroundColor: style[userStatus.offline].color }} className="agent-status-header pointer-none"></span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
