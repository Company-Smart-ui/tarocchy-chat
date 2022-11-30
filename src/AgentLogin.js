import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { events, responses, accountType } from "./ServerCommunication";
import globalThis from "./Global";
import { log, colors } from "./settings";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { validPassword, getCookie } from "./functions";

export default function AgentLogin() {
    // const [username, setUsername] = useState("");
    if (globalThis.socket === null) {
        let socket = new WebSocket(globalThis.url);
        globalThis.socket = socket;
    }
    var [password, setPassword] = useState("");
    var [pin, setPin] = useState("");

    /* 
    
    
    if (pw !== null && mail !== null) {
        authenticateAccount();
    }/*/
    function login() {
        if (getCookie("password") && getCookie("email")) {
            globalThis.password = getCookie("password");
            globalThis.pin = getCookie("pin");
            authenticateAccount();
        }
    }

    let navigate = useNavigate();
    /*useEffectfunction Register() {
        console.log("asd");
    }*/

    useEffect(() => {
        globalThis.events.addEventListener(events.authenticateAccountResponse, authenticateAccountResponse);
        //  globalThis.events.addEventListener("login", login);
        return function cleanup() {
            globalThis.events.removeEventListener(events.authenticateAccountResponse);
            //      globalThis.events.removeEventListener("login", login);
        };
    });

    function updatePassword(e) {
        globalThis.password = e.target.value;
        setPassword(globalThis.password);
    }

    /*iffunction updateUsername(e) {
        globalThis.username = e.target.value;
        setUsername(globalThis.username);
    }*/

    function updatePin(e) {
        globalThis.pin = e.target.value;
        setPin(globalThis.pin);
    }

    function authenticateAccount() {
        //user = username;
        //navigate("/chat");
        if (globalThis.socket != null) {
            if (validPassword(globalThis.password)) {
                globalThis.socket.send(
                    JSON.stringify({ event: "authenticateAccountRequest", pin: globalThis.pin, password: globalThis.password, accountType: accountType.agent })
                );
            }
            if (!validPassword(globalThis.password)) {
                toast.warn("Password is not valid!");
            }
        }
        toast.clearWaitingQueue();
    }

    function authenticateAccountResponse(data) {
        switch (data.response) {
            case responses.failure:
                toast.warn("Login failure!");
                break;
            case responses.notFound:
                toast.warn("Bad pin address or password!");
                break;
            case responses.serverError:
                toast.error("Server error!");
                break;
            case responses.authenticateAccount.alreadyLoggedIn:
                toast.warn("Already logged in!");
                break;
            case responses.success:
                log("%cLogin pin: " + "%c" + pin + "%c\nLogin password: " + "%c" + password, colors.default, colors.success, colors.default, colors.success);
                if (password !== "") {
                    document.cookie = `password=${password}`;
                }
                /*if (pin !== "") {
                    document.cookie = `pin=${pin}`;
                    //  console.log(document.cookie);
                } /*else {
                    console.log("asd");
                }*/

                globalThis.username = data.username;
                globalThis.pin = data.pin;
                //setUsername(globalThis.username);
                switch (data.accountType) {
                    case accountType.agent:
                        globalThis.agent = null;
                        globalThis.isAgent = true;
                        navigate("/chat/agent-panel");
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
        toast.clearWaitingQueue();
    }

    return (
        <div>
            <div className="register_login_container">
                <div style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }} className="login-register-container">
                    <div className="title">Sign in</div>
                    <div className="secondary-title">Pin</div>
                    <input type="text" placeholder="Enter pin" onChange={(e) => updatePin(e)}></input>
                    <div className="secondary-title">Password</div>
                    <input type="password" className="hidden" placeholder="Enter password" onChange={(e) => updatePassword(e)}></input>
                    <div className="button-container">
                        <button className="login-register-button" onClick={authenticateAccount}>
                            {"Login"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
