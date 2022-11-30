import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { events, responses, accountType } from "./ServerCommunication";
import globalThis from "./Global";
import { log, colors } from "./settings";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { validPassword, validEmail } from "./functions";

export default function Login() {
    // const [username, setUsername] = useState("");
    var [password, setPassword] = useState("");
    var [email, setEmail] = useState("");
    /* 
    if (pw !== null && mail !== null) {
        authenticateAccount();
    }/*/

    function login() {
        if (globalThis.password && globalThis.email) {
            authenticateAccount();
        }
    }

    let navigate = useNavigate();
    /*useEffectfunction Register() {
        console.log("asd");
    }*/
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const page = queryParams.get("redirect");
        console.log(page);
        login();
        switch (page) {
            case "admin-login":
                navigate("/chat/admin-login");
                break;
            case "agent-login":
                navigate("/chat/agent-login");
                break;
            case "call":
                navigate("/chat/call");
                break;
            default:
                break;
        }
        //
    }, []);

    useEffect(() => {
        globalThis.events.addEventListener(events.authenticateAccountResponse, authenticateAccountResponse);
        globalThis.events.addEventListener(events.login, login);
        return function cleanup() {
            globalThis.events.removeEventListener(events.authenticateAccountResponse);
            globalThis.events.removeEventListener(events.login, login);
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
                globalThis.socket.send(
                    JSON.stringify({
                        event: "authenticateAccountRequest",
                        email: globalThis.email,
                        password: globalThis.password,
                        accountType: accountType.guest,
                    })
                );
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
                log(
                    "%cLogin email: " + "%c" + email + "%c\nLogin password: " + "%c" + password,
                    colors.default,
                    colors.success,
                    colors.default,
                    colors.success
                );
                if (email !== "") {
                    document.cookie = `email=${globalThis.email}`;
                }
                if (password !== "") {
                    document.cookie = `password=${globalThis.password}`;
                }

                globalThis.username = data.username;
                //setUsername(globalThis.username);
                switch (data.accountType) {
                    case accountType.guest:
                        globalThis.isAgent = false;
                        globalThis.recipient = globalThis.agent;
                        navigate("/chat/user");
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
                    <div className="sign-up-style" style={{ marginTop: "1rem", marginBottom: "1rem", fontStyle: "italic" }}>
                        You must be logged in to talk to readers
                    </div>
                    <div className="sign-up-container">
                        <div className="sign-up-style">Don't have an account?</div>
                        <div
                            className="sign-up-style sign-up-button"
                            onClick={() => {
                                navigate("/chat/register");
                            }}
                        >
                            Signup now
                        </div>
                    </div>
                    <div className="sign-up-style" style={{ marginTop: "2rem", marginBottom: "1rem", fontStyle: "italic", textAlign: "center" }}>
                        Forgot your password? <br></br>Email us at admin@tarocchy.com
                    </div>
                </div>
            </div>
        </div>
    );
}
