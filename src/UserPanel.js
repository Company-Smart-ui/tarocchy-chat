import React, { useState, useEffect } from "react";
import "./App.css";
import { events, responses, accountType } from "./ServerCommunication";
import globalThis from "./Global";
import PasswordPanel from "./Components/PasswordPanel";
import { useNavigate } from "react-router-dom";
import { getPrice } from "./functions";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getCookie } from "./functions";

export default function UserPanel() {
    const [couponCode, setCouponCode] = useState("");
    const [showPasswordPanel, setShowPasswordPanel] = useState(false);
    const [agentSelected, setAgentSelected] = useState(false);
    const [agentDetails, setAgentDetails] = useState({});
    const [userDetails, setUserDetails] = useState({});
    //const [requested, setRequested] = useState(false);

    useEffect(() => {
        globalThis.events.addEventListener(events.changeUserDetailsResponse, changeUserDetailsResponse);
        globalThis.events.addEventListener(events.redeemCouponResponse, redeemCouponResponse);
        globalThis.events.addEventListener(events.userDetailsResponse, userDetailsResponse);
        globalThis.events.addEventListener(events.agentDetailsResponse, agentDetailsResponse);
        globalThis.events.addEventListener(events.chatRequestCreateResponse, chatRequestCreateResponse);
        globalThis.events.addEventListener(events.chatRequestFateUpdate, chatRequestFateUpdate);
        globalThis.events.addEventListener(events.chatRoomOpened, chatRoomOpened);
        globalThis.events.addEventListener(events.disconnected, disconnected);

        return function cleanup() {
            globalThis.events.removeEventListener(events.changeUserDetailsResponse);
            globalThis.events.removeEventListener(events.redeemCouponResponse);
            globalThis.events.removeEventListener(events.userDetailsResponse);
            globalThis.events.removeEventListener(events.agentDetailsResponse);
            globalThis.events.removeEventListener(events.chatRequestCreateResponse);
            globalThis.events.removeEventListener(events.chatRequestFateUpdate);
            globalThis.events.removeEventListener(events.chatRoomOpened);
            globalThis.events.removeEventListener(events.disconnected);
        };
    });

    let navigate = useNavigate();
    useEffect(() => {
        agentDetailsRequest();
        userDetailsRequest();
    }, []);

    /*if (!requested) {
        setRequested(true);
        agentDetailsRequest();
        userDetailsRequest();
    }*/
    function agentDetailsRequest() {
        globalThis.socket.send(
            JSON.stringify({
                event: events.agentDetailsRequest,
                agentPIN: globalThis.agent,
            })
        );
    }

    function userDetailsRequest() {
        globalThis.socket.send(
            JSON.stringify({
                event: events.userDetailsRequest,
            })
        );
    }

    function agentDetailsResponse(data) {
        // console.log(data);
        switch (data.response) {
            case responses.success:
                // console.log(data);
                setAgentDetails({ email: data.email, username: data.username, rate: data.rate, agentPIN: data.agentPIN, discounts: data.discounts });
                setAgentSelected(true);
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

    function userDetailsResponse(data) {
        //console.log(data);
        switch (data.response) {
            case responses.loginRequired:
                //toast.warn("Login required");
                navigate("/chat/");
                break;
            case responses.invalidAccountType:
                toast.warn("Invalid account type");
                break;
            case responses.success:
                setUserDetails({ balance: data.balance, email: data.email, username: data.username });
                break;
            default:
                break;
        }
    }

    function chatRequestCreateRequest(chatTime, isMaximumTime = false) {
        if (userDetails.balance >= 1) {
            globalThis.socket.send(
                JSON.stringify({
                    event: events.chatRequestCreateRequest,
                    chatTime: chatTime,
                    agentPIN: agentDetails.agentPIN,
                    payAsYouGo: true,
                    isMaximumTime: isMaximumTime,
                })
            );
        } else {
            toast.warn("Insufficient Balance");
        }
    }

    function chatRequestCreateResponse(data) {
        switch (data.response) {
            case responses.serverError:
                toast.error("Server error");
                break;
            case responses.success:
                navigate("/chat/chat");
                break;
            case responses.chatRequestCreateRequest.insufficientBalance:
                toast.warn("Insufficient Balance");
                window.open("https://tarocchy.com/product-category/coupon-codes/");
                break;
            case responses.chatRequestCreateRequest.multiplePendingRequestsError:
                toast.error("Multiple pending request error");
                break;
            case responses.notFound:
                toast.warn("This reader is not online, please go back and choose another reader!");
                break;
            case responses.invalidAccountType:
                toast.error("Invalid account type");
                break;
            case responses.loginRequired:
                //toast.error("Login required");
                navigate("/chat/");
                break;
            case responses.chatRequestCreateRequest.agentExceededMaximumOngoingChats:
                toast.error("READER BUSY", { position: "bottom-center" });
                break;
            default:
                break;
        }
    }
    function disconnected() {
        navigate("/chat");
    }

    function chatRequestFateUpdate(data) {
        console.log(data);
    }

    function chatRoomOpened(data) {
        navigate("/chat/chat", { state: data.roomID });
    }

    function redeemCouponResponse(data) {
        switch (data.response) {
            case responses.notFound:
                toast.error("Not found");
                break;
            case responses.redeemCoupon.alreadyRedeemed:
                toast.warn("Coupon already redeemed");
                break;
            case responses.unauthorized:
                toast.error("Account unauthorized");
                break;
            case responses.serverError:
                toast.error("Server error");
                break;
            case responses.success:
                toast.success("Coupon redeemed successfully");
                userDetailsRequest();
                break;
            default:
                break;
        }
    }
    function redeemCouponRequest() {
        globalThis.socket.send(
            JSON.stringify({
                event: "redeemCouponRequest",
                couponCode: couponCode,
            })
        );
    }

    function togglePanel() {
        setShowPasswordPanel(!showPasswordPanel);
    }
    /* function changeUserDetailsRequest() {
        globalThis.socket.send(
            JSON.stringify({
                event: "changeUserDetailsRequest",
                password: newPassword,
            })
        );
    }*/

    function changeUserDetailsResponse(data) {
        switch (data.response) {
            case responses.loginRequired:
                toast.error("Login required");
                break;
            case responses.invalidPassword:
                toast.error("Invalid Password");
                break;
            case responses.invalidAccountType:
                toast.error("Invalid account type");
                break;
            case responses.serverError:
                toast.error("Server error");
                break;
            case responses.success:
                toast.success("Password changed successfully");
                togglePanel();
                break;
            default:
                break;
        }
    }

    function logOut() {
        document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        document.cookie = "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        globalThis.password = null;
        globalThis.email = null;
        globalThis.socket.close();
        navigate("/chat/");
    }

    return (
        <div>
            <div className="register_login_container">
                <div style={{ paddingLeft: "20px", paddingRight: "20px", flexDirecton: "row" }} className="login-register-container">
                    <div className="user-info-container">
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ textAlign: "center", fontSize: "1.2rem", fontWeight: "bold" }} className="userpanel-text blueText">
                                {userDetails.username}
                            </div>
                            <button onClick={logOut} className="orange">
                                Log Out
                            </button>
                        </div>
                        <hr className="separator"></hr>
                        <div className="userpanel-text blueText">
                            <strong>{`Email:${userDetails.email}`}</strong>
                        </div>
                        <div className="userpanel-text blueText">
                            <strong>{`Balance:£${userDetails.balance}`}</strong>
                        </div>
                        <hr className="separator"></hr>

                        <div>
                            <div className="userpanel-text" style={{ fontSize: "0.7rem", textAlign: "center" }}>
                                <i>
                                    You can add funds to your balance by redeeming coupons.<br></br> Go to our shop to purchase coupons.
                                </i>
                            </div>
                            <div className="userpanel-text" style={{ textAlign: "center" }}>
                                <strong>{`Coupon types - Choose here`}</strong>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <button
                                    className="orange"
                                    onClick={function () {
                                        window.open("https://tarocchy.com/checkout/?add-to-cart=1835");
                                    }}
                                >
                                    £10
                                </button>
                                <button
                                    className="orange"
                                    onClick={function () {
                                        window.open("https://tarocchy.com/checkout/?add-to-cart=1884");
                                    }}
                                >
                                    £19
                                </button>
                                <button
                                    className="orange"
                                    onClick={function () {
                                        window.open("https://tarocchy.com/checkout/?add-to-cart=1886");
                                    }}
                                >
                                    £28
                                </button>
                            </div>
                        </div>

                        {showPasswordPanel && <PasswordPanel togglePanel={togglePanel} accountType={accountType.guest} />}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                            <input
                                style={{ width: "50%", borderColor: "orangered" }}
                                type="text"
                                placeholder="Coupon code"
                                onChange={(e) => setCouponCode(e.target.value)}
                            ></input>
                            <button className="orange" onClick={redeemCouponRequest}>
                                Redeem
                            </button>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <button className="brightblue">
                                <a href="http://tarocchy.com">Back to readers</a>
                            </button>
                            <button onClick={togglePanel} className="brightblue">
                                Change password
                            </button>
                        </div>
                    </div>
                    {agentSelected && (
                        <div className="user-info-container">
                            <div
                                style={{ textAlign: "center", fontSize: "1.0rem", fontWeight: "bold" }}
                                className="userpanel-text"
                            >{`Chat with ${agentDetails.username} - PIN ${agentDetails.agentPIN}`}</div>

                            {false && (
                                <div className="button-container">
                                    <button style={{ width: "100%" }} className="login-register-button" onClick={chatRequestCreateRequest.bind(this, 0.5)}>
                                        {"Start 0.5 minute session"}
                                    </button>
                                </div>
                            )}

                            <hr className="separator"></hr>
                            <div className="userpanel-text">
                                Pay as you go per minute: <strong>£1</strong>
                            </div>
                            <div className="button-container">
                                <button style={{ width: "100%" }} className="login-register-button" onClick={chatRequestCreateRequest.bind(this, -1, true)}>
                                    {"Pay as you go"}
                                </button>
                            </div>
                            <div className="userpanel-text">{`${getPrice(agentDetails.rate, 10, 1 - agentDetails.discounts.discount1, 2)} for 10 minutes`}</div>
                            <div className="button-container">
                                <button style={{ width: "100%" }} className="login-register-button" onClick={chatRequestCreateRequest.bind(this, 10, false)}>
                                    {"Start 10 minute session"}
                                </button>
                            </div>
                            <div className="userpanel-text">
                                <span style={{ textDecorationLine: "line-through" }}>{getPrice(agentDetails.rate, 20, 1, 2)}</span>
                                <span style={{ color: "red", fontWeight: "bold" }}>
                                    {" "}
                                    {getPrice(agentDetails.rate, 20, 1 - agentDetails.discounts.discount2, 2)}
                                </span>{" "}
                                for 20 minutes
                            </div>
                            <div className="userpanel-text">{`You save ${getPrice(agentDetails.rate, 20, agentDetails.discounts.discount2, 2)}*`}</div>

                            <div className="button-container">
                                <button style={{ width: "100%" }} className="login-register-button" onClick={chatRequestCreateRequest.bind(this, 20, false)}>
                                    {"Start 20 minute session"}
                                </button>
                            </div>
                            <div className="userpanel-text">
                                <span style={{ textDecorationLine: "line-through" }}>{getPrice(agentDetails.rate, 30, 1, 2)}</span>
                                <span style={{ color: "red", fontWeight: "bold" }}>
                                    {" "}
                                    {getPrice(agentDetails.rate, 30, 1 - agentDetails.discounts.discount3, 2)}
                                </span>{" "}
                                for 30 minutes
                            </div>
                            <div className="userpanel-text">{`You save ${getPrice(agentDetails.rate, 30, agentDetails.discounts.discount3, 2)}*`}</div>
                            <div className="button-container">
                                <button style={{ width: "100%" }} className="login-register-button" onClick={chatRequestCreateRequest.bind(this, 30, false)}>
                                    {"Start 30 minute session"}
                                </button>
                            </div>
                            <hr className="separator"></hr>
                            <div className="userpanel-text">
                                Call pay per minute: <strong>£1</strong>
                            </div>
                            <div className="userpanel-text">
                                Phone number: <strong>0903432567</strong>
                            </div>
                            <hr className="separator"></hr>
                            <div style={{ textAlign: "center", fontSize: "0.9em", fontStyle: "italic", fontWeight: "bold" }} className="userpanel-text">
                                "We pay our readers ethically, <br></br>unlike other sites."
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
