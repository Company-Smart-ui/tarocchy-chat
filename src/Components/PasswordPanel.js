import React from "react";
import "../App.css";
import { useState } from "react";
import globalThis from "../Global";
import { accountType } from "../ServerCommunication";

export default function PasswordPanel(data) {
    const [newPassword, setNewPassword] = useState(null);
    const [agentPin, setAgentPin] = useState(null);
    const [agentEmail, setAgentEmail] = useState(null);
    const [agentUsername, setAgentUsername] = useState(null);
    const [guestEmail, setGuestEmail] = useState(null);
    const [agentRate, setAgentRate] = useState(null);

    const togglePanel = data.togglePanel;
    const type = data.accountType;

    function changeDetails() {
        switch (type) {
            case accountType.agent:
                globalThis.socket.send(
                    JSON.stringify({
                        event: "changeAgentDetailsRequest",
                        agentPIN: agentPin,
                        username: agentUsername,
                        password: newPassword,
                        email: agentEmail,
                        rate: agentRate,
                    })
                );
                break;
            case accountType.guest:
                if (globalThis.isAdmin) {
                    globalThis.socket.send(
                        JSON.stringify({
                            event: "changeUserDetailsRequest",
                            userEmail: guestEmail,
                            password: newPassword,
                        })
                    );
                } else {
                    globalThis.socket.send(
                        JSON.stringify({
                            event: "changeUserDetailsRequest",
                            password: newPassword,
                        })
                    );
                }
                break;
            case accountType.admin:
                globalThis.socket.send(
                    JSON.stringify({
                        event: "changeAdminDetailsRequest",
                        password: newPassword,
                    })
                );
                break;
            default:
                break;
        }
    }

    return (
        <div style={{ position: "fixed", top: 0, left: 0, backgroundColor: "rgba(0,0,0,0.7)", width: "100%", minHeight: "100%" }}>
            <div
                style={{
                    position: "absolute",
                    display: "flex",
                    top: "50%",
                    left: "50%",
                    flexDirection: "column",
                    padding: 20,
                    backgroundColor: "rgba(255,255,255,0.8)",
                    borderRadius: 15,
                    transform: "translate(-50%,-50%)",
                }}
            >
                <div className="secondary-title"> {type === accountType.admin || type === accountType.guest ? "Set a new password" : "Update agent details"}</div>
                <div>
                    {type === accountType.agent && (
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <input style={{ width: "auto" }} type="text" placeholder="Agent pin" onChange={(e) => setAgentPin(e.target.value)}></input>
                            <input style={{ width: "auto" }} type="text" placeholder="Agent email" onChange={(e) => setAgentEmail(e.target.value)}></input>
                            <input style={{ width: "auto" }} type="number" placeholder="Agent rate" onChange={(e) => setAgentRate(e.target.value)}></input>
                            <input style={{ width: "auto" }} type="text" placeholder="Agent username" onChange={(e) => setAgentUsername(e.target.value)}></input>
                        </div>
                    )}
                    {globalThis.isAdmin && type === accountType.guest && (
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <input style={{ width: "auto" }} type="text" placeholder="Guest email" onChange={(e) => setGuestEmail(e.target.value)}></input>
                        </div>
                    )}
                    <input style={{ width: "auto" }} type="password" placeholder="New password" onChange={(e) => setNewPassword(e.target.value)}></input>
                </div>
                <div className="button-container">
                    <button style={{ width: "100%" }} className="login-register-button" onClick={changeDetails}>
                        {type === accountType.admin || type === accountType.guest ? "Change password" : "Change agent details"}
                    </button>
                    <button style={{ width: "100%" }} className="login-register-button" onClick={togglePanel}>
                        {"Back"}
                    </button>
                </div>
            </div>
        </div>
    );
}
