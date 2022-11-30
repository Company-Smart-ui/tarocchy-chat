import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { events, responses, accountType } from "./ServerCommunication";
import globalThis from "./Global";
import { log, colors } from "./settings";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { validPassword, validEmail, getCookie } from "./functions";

export default function AdminLogin() {
    // const [username, setUsername] = useState("");
    var [password, setPassword] = useState("");
    var [email, setEmail] = useState("");

    /* 
    
    
    if (pw !== null && mail !== null) {
        authenticateAccount();
    }/*/
    function login() {
        if (getCookie("password") && getCookie("email")) {
            globalThis.password = getCookie("password");
            globalThis.email = getCookie("email");
            authenticateAccount();
        }
    }

    let navigate = useNavigate();
    /*useEffectfunction Register() {
        console.log("asd");
    }*/

    useEffect(() => {
        globalThis.events.addEventListener(events.authenticateAccountResponse, authenticateAccountResponse);
        // globalThis.events.addEventListener("login", login);
        return function cleanup() {
            globalThis.events.removeEventListener(events.authenticateAccountResponse);
            //     globalThis.events.removeEventListener("login", login);
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

    function updateEmail(e) {
        globalThis.email = e.target.value;
        setEmail(globalThis.email);
    }

    function authenticateAccount() {
        //user = username;
        //navigate("/chat");

        if (globalThis.socket != null) {
            if (validPassword(globalThis.password) && validEmail(globalThis.email)) {
                globalThis.socket.send(JSON.stringify({ event: "authenticateAccountRequest", email: globalThis.email, password: globalThis.password, accountType: accountType.admin }));
            }
            if (!validPassword(globalThis.password)) {
                toast.warn("Password is not valid!");
            }
            if (!validEmail(globalThis.email)) {
                toast.error("Email is not valid!");
            }
        }
        toast.clearWaitingQueue();
    }

    function authenticateAccountResponse(data) {
        console.log(data);
        switch (data.response) {
            case responses.failure:
                toast.warn("Login failure!");
                break;
            case responses.notFound:
                toast.warn("Bad email address or password!");
                break;
            case responses.serverError:
                toast.error("Server error!");
                break;
            case responses.authenticateAccount.alreadyLoggedIn:
                toast.warn("Already logged in!");
                break;
            case responses.success:
                log("%cLogin email: " + "%c" + email + "%c\nLogin password: " + "%c" + password, colors.default, colors.success, colors.default, colors.success);
                if (email !== "") {
                    document.cookie = `email=${email}`;
                }
                if (password !== "") {
                    document.cookie = `password=${password}`;
                }

                globalThis.username = data.username;
                //setUsername(globalThis.username);
                switch (data.accountType) {
                    case accountType.admin:
                        globalThis.isAdmin = true;
                        globalThis.isAgent = null;
                        globalThis.recipient = null;
                        navigate("/chat/admin");
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
                    <div className="secondary-title">Email</div>
                    <input type="email" placeholder="Enter email" onChange={(e) => updateEmail(e)}></input>
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
