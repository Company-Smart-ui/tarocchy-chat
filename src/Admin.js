import React from "react";
import "./App.css";
import globalThis from "./Global";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { validPassword, validEmail } from "./functions";
import { events, responses, accountType } from "./ServerCommunication";
import PasswordPanel from "./Components/PasswordPanel";
import EditAgentPanel from "./Components/EditAgentPanel";

export default function Admin() {
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState("");
    const [removePin, setRemovePin] = useState();
    const [removeEmail, setRemoveEmails] = useState();
    const [registerPin, setRegisterPin] = useState("");
    const [creditAmount, setCreditAmount] = useState();
    const [couponCount, setCouponCount] = useState();
    const [registerRate, setRegisterRate] = useState();
    const [showPasswordPanel, setShowPasswordPanel] = useState(false);
    const [showAgentPanel, setShowAgentPanel] = useState(false);
    const [type, setType] = useState();
    const [removeType, setRemoveType] = useState(accountType.agent);

    useEffect(() => {
        globalThis.events.addEventListener(events.registerAccountResponse, registerAccountResponse);
        globalThis.events.addEventListener(events.generateCouponsResponse, generateCouponsResponse);
        globalThis.events.addEventListener(events.deleteAccountResponse, deleteAccountResponse);
        globalThis.events.addEventListener(events.getChatlogResponse, getChatlogResponse);
        globalThis.events.addEventListener(events.changeAdminDetailsResponse, changeAdminDetailsResponse);
        globalThis.events.addEventListener(events.changeAgentDetailsResponse, changeAgentDetailsResponse);
        globalThis.events.addEventListener(events.changeUserDetailsResponse, changeUserDetailsResponse);
        globalThis.events.addEventListener(events.setAgentProfilePictureResponse, setAgentProfilePictureResponse);
        globalThis.events.addEventListener(events.disconnected, disconnected);

        return function cleanup() {
            globalThis.events.removeEventListener(events.registerAccountResponse);
            globalThis.events.removeEventListener(events.generateCouponsResponse);
            globalThis.events.removeEventListener(events.deleteAccountResponse);
            globalThis.events.removeEventListener(events.getChatlogResponse);
            globalThis.events.removeEventListener(events.changeAdminDetailsResponse);
            globalThis.events.removeEventListener(events.changeAgentDetailsResponse);
            globalThis.events.removeEventListener(events.changeUserDetailsResponse);
            globalThis.events.removeEventListener(events.setAgentProfilePictureResponse);
            globalThis.events.removeEventListener(events.disconnected);
        };
    });

    useEffect(() => {
        //console.log(removeType);
    }, [removeType]);

    function togglePanel(accountType) {
        setShowPasswordPanel(!showPasswordPanel);
        setType(accountType);
    }

    function toggleAgentPanel() {
        setShowAgentPanel(!showAgentPanel);
    }

    function changeUserDetailsResponse(data) {
        //console.log(data);
        switch (data.response) {
            case responses.success:
                toast.success("User account updated successfully");
                break;
            case responses.invalidPassword:
                toast.warn("Password is invalid");
                break;
            case responses.loginRequired:
                toast.warn("Login required");
                break;
            case responses.invalidAccountType:
                toast.warn("Invalid account type");
                break;
            case responses.serverError:
                toast.error("Server error");
                break;
            default:
                break;
        }
    }

    function changeAdminDetailsResponse(data) {
        //console.log(data);
        switch (data.response) {
            case responses.success:
                toast.success("Admin account updated successfully");
                break;
            case responses.invalidPassword:
                toast.warn("Password is invalid");
                break;
            case responses.loginRequired:
                toast.warn("Login required");
                break;
            case responses.invalidAccountType:
                toast.warn("Invalid account type");
                break;
            case responses.serverError:
                toast.error("Server error");
                break;
            default:
                break;
        }
    }

    function changeAgentDetailsResponse(data) {
        console.log(data);
        switch (data.response) {
            case responses.success:
                toast.success("Agent account updated successfully");
                break;
            case responses.invalidPassword:
                toast.warn("Password is invalid");
                break;
            case responses.unauthorized:
                toast.warn("User unauthorized");
                break;
            case responses.invalidAccountType:
                toast.warn("Invalid account type");
                break;
            case responses.serverError:
                toast.error("Server error");
                break;
            default:
                break;
        }
        // console.log(data);
    }
    function disconnected() {
        navigate("/chat/admin-login");
    }

    function addAllAgents() {
        const names = [
            "Alegra",
            "Allan",
            "Anastasia",
            "Andrea",
            "Andromeda",
            "Bobby",
            "Carlonia",
            "Cosmic Mystery",
            "Crystal",
            "Cynthia",
            "Daniel",
            "Devine Feminine",
            "Divine Priestess",
            "Empress Destiny",
            "Eve",
            "Exodus Mary",
            "Gaia's Child",
            "Gamma Waves",
            "Griselda",
            "Hailey",
            "Indigo Sister",
            "Isis Tale",
            "Ivi",
            "Jasmine",
            "Kelly Mint",
            "Love Healing",
            "Max",
            "Moon Shimmer",
            "Mystical Cosmos",
            "Oliver",
            "Olivia Bells",
            "Osis",
            "Pagan Runes",
            "Polly",
            "Quantum Chanter",
            "Rose",
            "Shaka Zulu",
            "Shanti Ra",
            "Source Lily",
            "Suzanne",
            "Tantric Wisdom",
            "Taylor",
            "Universal Predictions",
            "Vega Stardust",
            "Victor",
            "Viking Predictions",
            "Water Sign",
        ];
        var agentPin = 1121;
        var agentPassword;
        for (var i = 0; i < names.length; i++) {
            agentPin = agentPin + 1;
            agentPassword = agentPin.toString().split("");
            agentPassword.reverse();
            agentPassword = agentPassword.join("") + "5";
            globalThis.socket.send(
                JSON.stringify({
                    event: "registerAccountRequest",
                    email: "",
                    username: names[i],
                    pin: agentPin.toString(),
                    password: agentPassword,
                    accountType: accountType.agent,
                    rate: 1,
                    visible: true,
                })
            );
        }
    }

    //addAllAgents();

    function registerAccountResponse(data) {
        switch (data.response) {
            case responses.success:
                toast.success("agent added successfully");
                break;
            case responses.registerAccount.duplicate:
                toast.error("agent duplicate");
                break;
            case responses.registerAccount.invalidPassword:
                toast.error("invalid password");
                break;
            case responses.registerAccount.invalidAccountType:
                toast.error("invalid account type");
                break;
            case responses.unauthorized:
                toast.error("Account unauthorized");
                break;
            default:
                break;
        }
        toast.clearWaitingQueue();
    }

    function addAgent() {
        if (validPassword(registerPassword) && registerPassword === registerPasswordConfirm) {
            globalThis.socket.send(
                JSON.stringify({
                    event: "registerAccountRequest",
                    email: registerEmail,
                    username: registerUsername,
                    pin: registerPin,
                    password: registerPassword,
                    accountType: accountType.agent,
                    rate: parseFloat(registerRate),
                })
            );
        } else {
            if (!validEmail(registerEmail)) {
                toast.error("Not a valid email");
            }
            if (registerPassword !== registerPasswordConfirm) {
                toast.error("Passwords doesn't match");
            }
            if (!validPassword(registerPassword)) {
                toast.error("Password is not valid");
            }
        }
        toast.clearWaitingQueue();
    }
    function generateCouponsRequest() {
        globalThis.socket.send(
            JSON.stringify({
                event: "generateCouponsRequest",
                creditAmount: creditAmount,
                couponCount: couponCount,
            })
        );
    }

    function generateCouponsResponse(data) {
        switch (data.response) {
            case responses.unauthorized:
                toast.error("Account unauthorized");
                break;
            case responses.generateCouponsRequest.maximumCouponCountExceeded:
                toast.warn("Maximum coupon count reached");
                break;
            case responses.serverError:
                toast.error("Server error");
                break;
            case responses.success:
                toast.success("Coupons generated successfully");
                var textToSave = "";
                for (var i = 0; i < data.couponCodes.length; i++) {
                    textToSave += data.couponCodes[i] + "\n";
                }
                var hiddenElement = document.createElement("a");
                hiddenElement.href = "data:attachment/text," + encodeURI(textToSave);
                hiddenElement.target = "_blank";
                hiddenElement.download = `coupon_codes_count_${couponCount}_price_${creditAmount}.txt`;
                hiddenElement.click();
                break;
            default:
                break;
        }
    }

    function deleteAccountResponse(data) {
        switch (data.response) {
            case responses.success:
                toast.success("Account removed successfully");
                break;
            case responses.failure:
                toast.error("Account remove failure");
                break;
            case responses.notFound:
                toast.warn("Account not found");
                break;
            case responses.unauthorized:
                toast.error("Account unauthorized");
                break;
            default:
                break;
        }
        toast.clearWaitingQueue();
    }

    function removeUser() {
        switch (removeType) {
            case accountType.agent:
                globalThis.socket.send(
                    JSON.stringify({
                        event: "deleteAccountRequest",
                        pin: removePin,
                        accountType: removeType,
                    })
                );
                break;
            case accountType.guest:
                globalThis.socket.send(
                    JSON.stringify({
                        event: "deleteAccountRequest",
                        email: removeEmail,
                        accountType: removeType,
                    })
                );
                break;
            default:
                break;
        }
    }

    function getChatlogResponse(data) {
        //  console.log(data);
        switch (data.response) {
            case responses.serverError:
                toast.error("Server error");
                break;
            case responses.unauthorized:
                toast.warn("User unauthorized");
                break;
            case responses.notFound:
                toast.warn("Not found");
                break;
            case responses.empty:
                toast.warn("There are not chatlogs");
                break;
            case responses.success:
                navigate("/chat/admin/log", {
                    state: { chatlog: data.chatlogs },
                });
                break;
            default:
                break;
        }
        toast.clearWaitingQueue();
    }

    function downloadChatLogs() {
        globalThis.socket.send(
            JSON.stringify({
                event: "getChatlogRequest",
                roomID: responses.getChatlog.all,
            })
        );
    }

    function test(event) {
        var file = event.target.files[0];
        var reader = new FileReader(file);
        reader.readAsDataURL(file);
        reader.onload = function (event) {
            // The file's text will be printed here
            globalThis.socket.send(
                JSON.stringify({
                    event: events.setAgentProfilePictureRequest,
                    agentPIN: 1141,
                    imageBase64: event.target.result,
                })
            );
        };
    }
    function setAgentProfilePictureResponse(data) {
        console.log(data);
    }

    let navigate = useNavigate();

    return (
        <div>
            {globalThis.isAdmin ? (
                <div className="adminPanel">
                    <div className="adminSecondaryPanel">
                        <div className="adminTitle">Register a new agent</div>
                        <input type="text" placeholder="Agent username" onChange={(e) => setRegisterUsername(e.target.value)}></input>
                        <input type="email" placeholder="Agent email" onChange={(e) => setRegisterEmail(e.target.value)}></input>
                        <input type="text" placeholder="Agent pin" onChange={(e) => setRegisterPin(e.target.value)}></input>
                        <input type="number" placeholder="Agent rate" onChange={(e) => setRegisterRate(e.target.value)}></input>
                        <input type="password" placeholder="Agent password" onChange={(e) => setRegisterPassword(e.target.value)}></input>
                        <input type="password" placeholder="Agent confirm password" onChange={(e) => setRegisterPasswordConfirm(e.target.value)}></input>
                        <button onClick={addAgent}>Add agent</button>
                    </div>
                    <div className="adminSecondaryPanel">
                        <div className="adminTitle">Remove an existing agent/user</div>
                        <select onChange={(e) => setRemoveType(parseFloat(e.target.value))}>
                            <option defaultValue="selected" value={accountType.agent}>
                                Agent
                            </option>
                            <option value={accountType.guest}>User</option>
                        </select>
                        <input
                            type="email"
                            placeholder="User email to remove"
                            onChange={(e) => setRemoveEmails(e.target.value)}
                            disabled={removeType === accountType.agent ? true : false}
                        ></input>
                        <input
                            type="number"
                            placeholder="Agent pin to remove"
                            onChange={(e) => setRemovePin(e.target.value)}
                            disabled={removeType === accountType.agent ? false : true}
                        ></input>

                        <button onClick={removeUser}>{removeType === accountType.agent ? "Remove agent" : "Remove User"}</button>
                    </div>
                    <div className="adminSecondaryPanel">
                        <div className="adminTitle">Generate coupon codes</div>
                        <input type="number" placeholder="Credit amount" onChange={(e) => setCreditAmount(e.target.value)}></input>
                        <input type="number" placeholder="Coupon count" onChange={(e) => setCouponCount(e.target.value)}></input>
                        <button onClick={generateCouponsRequest}>Generate Coupons</button>
                    </div>
                    <div className="adminSecondaryPanel">
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <div className="adminTitle">Edit details</div>
                            <button onClick={togglePanel.bind(this, accountType.admin)}>Edit Admin</button>
                            <button onClick={toggleAgentPanel.bind(this, accountType.agent)}>Edit Agent</button>
                            <button onClick={togglePanel.bind(this, accountType.guest)}>Edit Guest</button>
                        </div>
                        {showPasswordPanel && <PasswordPanel togglePanel={togglePanel} accountType={type} />}
                        {showAgentPanel && <EditAgentPanel togglePanel={toggleAgentPanel} />}
                    </div>
                    <div className="adminSecondaryPanel">
                        <button
                            className="agent-panel-button"
                            onClick={function () {
                                navigate("/chat/admin/earnings");
                            }}
                        >
                            Earnings
                        </button>
                        <button onClick={downloadChatLogs}>Download chat logs</button>
                    </div>
                    <button
                        onClick={() => {
                            globalThis.socket.close();
                            navigate("/chat/?redirect=admin-login");
                        }}
                    >
                        Log out
                    </button>
                </div>
            ) : (
                <div style={{ color: "white", fontSize: "50px" }}>Admin login required!</div>
            )}
        </div>
    );
}
