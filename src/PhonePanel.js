import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { events, responses, accountType } from "./ServerCommunication";

import globalThis from "./Global";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { validPassword, validEmail } from "./functions";

export default function PhonePanel() {
    const [agentDetails, setAgentDetails] = useState({});

    function agentDetailsRequest() {
        globalThis.socket.send(
            JSON.stringify({
                event: events.agentDetailsRequest,
                agentPIN: globalThis.agent,
            })
        );
    }
    function agentDetailsResponse(data) {
        // console.log(data);
        switch (data.response) {
            case responses.success:
                // console.log(data);
                setAgentDetails({ email: data.email, username: data.username, rate: data.rate, agentPIN: data.agentPIN, discounts: data.discounts });
                //setAgentSelected(true);
                break;
            case responses.notFound:
                //setAgentSelected(false);
                // toast.error("Agent not found");
                break;
            case responses.serverError:
                //setRequested(false);
                toast.error("Server error");
                break;
            default:
                break;
        }
        // console.log(agentDetails);
    }

    useEffect(() => {
        globalThis.events.addEventListener(events.agentDetailsResponse, agentDetailsResponse);
        globalThis.events.addEventListener(events.agentDetailsRequest, agentDetailsRequest);
        return function cleanup() {
            globalThis.events.removeEventListener(events.agentDetailsResponse);
            globalThis.events.addEventListener(events.agentDetailsRequest);
        };
    });

    return (
        <div className="register_login_container">
            <div className="phone-container">
                <div className="phone-header">
                    <p className="phone-text phone-text-title header-text">{agentDetails.username}</p>
                </div>
                <p className="phone-text phone-text-title">CALL US ON +44 03301030250</p>
                <p className="phone-text-price">10 minutes - 15£ (1.45 cents per minute)</p>
                <p className="phone-text-price">20 minutes - 25£ (Discount 4£)</p>
                <p className="phone-text-price">30 minutes - 35£ (Discount 8.50£)</p>
                <p className="phone-text-price">40 minutes - 40£ (Discount 18£)</p>
                <a
                    style={{
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center",
                        margin: "2vmin",
                        textDecoration: "underline",
                        padding: "1vmin",
                        backgroundColor: "var(--othercolor)",
                        borderRadius: "1vmin",
                    }}
                    href="https://payments.digitalselect-uk.com/10802/user"
                >
                    “SIGN UP AND PAY HERE”<br></br> EXISTING CUSTOMERS LOG IN
                </a>
                <a
                    style={{
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center",
                        margin: "2vmin",
                        textDecoration: "underline",
                        backgroundColor: "var(--othercolor)",
                        padding: "1vmin",
                        borderRadius: "1vmin",
                    }}
                    href="https://payments.digitalselect-uk.com/10802/User/NewPayment"
                >
                    NEW CUSTOMERS BUY CREDIT LINK
                </a>
                <p className="phone-text">
                    ALL CALLS ARE RECORDED. FOR ENTERTAINMENT PURPOSES ONLY.<br></br>
                    <strong>WE PAY OUR READERS ETHICALLY.</strong>
                    <br></br>
                </p>
                <p className="phone-text phone-text-title">
                    “EACH READING DONATES TOWARDS AN ANIMAL SANCTUARY,<br></br>FOR A BETTER WORLD”.<br></br>
                </p>
                <a href="https://tarocchy.com">
                    <button className="phone-button">Back</button>
                </a>
            </div>
        </div>
    );
}
