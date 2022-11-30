import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { accountType, events, responses } from "./ServerCommunication";
import globalThis from "./Global";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { validPassword, validEmail } from "./functions";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    let navigate = useNavigate();

    useEffect(() => {
        globalThis.events.addEventListener(events.registerAccountResponse, registerAccountResponse);
        return function cleanup() {
            globalThis.events.removeEventListener(events.registerAccountResponse);
        };
    });

    /*useEffect(() => {}, [username]);*/

    function updatePassword(e) {
        var password = e.target.value;
        setPassword(password);
    }

    function updateConfirmPassword(e) {
        var confirmPassword = e.target.value;
        setConfirmPassword(confirmPassword);
    }

    function updateUsername(e) {
        var username = e.target.value;
        setUsername(username);
    }

    function updateEmail(e) {
        var email = e.target.value;
        setEmail(email);
    }

    function Register() {
        if (!validPassword(password)) {
            toast.error("Password is not valid!");
        } else if (password !== confirmPassword) {
            toast.warn("Passwords doesn't match!", {
                backgroundColor: "#ff8c00",
                color: "#ffffff",
            });
        }
        if (!validEmail(email)) {
            toast.error("Email is not valid");
        }

        if (validEmail(email) && validPassword(password) && password === confirmPassword) {
            console.log("Username: " + username + "\nPassword: " + password + "\nConfirmed Password: " + confirmPassword + "\nE-mail: " + email);
            globalThis.socket.send(
                JSON.stringify({
                    event: "registerAccountRequest",
                    email: email,
                    username: username,
                    password: password,
                    accountType: accountType.guest,
                })
            );
        }
        toast.clearWaitingQueue();
    }

    function registerAccountResponse(data) {
        switch (data.response) {
            case responses.success:
                toast.success("Successful registration!");
                console.log(data);
                globalThis.email = email;
                globalThis.password = password;
                navigate("/chat");
                break;
            case responses.registerAccount.duplicate:
                toast.warn("Account already exists!");
                break;
            case responses.registerAccount.invalidPassword:
                toast.warn("Password does not meet requirements!");
                break;
            case responses.serverError:
                toast.error("Server error!");
                break;
            default:
                break;
        }
        toast.clearWaitingQueue();
    }

    return (
        <div className="register_login_container">
            <div style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }} className="login-register-container">
                <div className="title">Sign up</div>
                <div className="secondary-title">{"Username"}</div>
                <input className="input" placeholder="Enter username" onChange={(e) => updateUsername(e)}></input>
                <div className="secondary-title">{"E-mail"}</div>
                <input className="input" placeholder="Enter e-mail" onChange={(e) => updateEmail(e)}></input>
                <div className="secondary-title"> {"Password"}</div>
                <input type="password" className="input hidden pw" placeholder="Enter password" onChange={(e) => updatePassword(e)}></input>
                <input type="password" className="input hidden pw" placeholder="Repeat password" onChange={(e) => updateConfirmPassword(e)}></input>
                <div className="button-container">
                    <button className="login-register-button" onClick={Register}>
                        {"Register"}
                    </button>
                </div>
                <div className="sign-up-container">
                    <div className="sign-up-style">Have an account?</div>
                    <div
                        className="sign-up-style sign-up-button"
                        onClick={() => {
                            navigate("/chat");
                        }}
                    >
                        Sign In
                    </div>
                </div>
            </div>
        </div>
    );
}
