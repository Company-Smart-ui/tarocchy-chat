import React from "react";
import "./App.css";
import Messages from "./Components/Messages";
import Input from "./Components/Input";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Guests from "./Components/Guests";
import { log, colors, globalColors } from "./settings";
import { events, userStatus, chatRequestStatus, responses } from "./ServerCommunication";
import globalThis from "./Global";
import Timer from "./Components/Timer";
import Dropdown from "./Components/Dropdown";
import Dropdown2 from "./Components/Dropdown2";

import FooterButtons from "./Components/FooterButtons";
import Popup from "./Components/Popup";

import messageSfx from "../src/audio/message.mp3";
import beep from "../src/audio/loud_sharp_beep.mp3";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { useIdleTimer } from "react-idle-timer";
import { toast } from "react-toastify";

var waiting = true;

const AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx = new AudioContext();
class Sfx {
    //creates a new HTML Audio file, stores it in the 'sfx' variable
    constructor(audioFile) {
        //Stores base volume values, so we can fade to it
        this.protected_volumeBase = 1;
        this.isPlaying = false;
        this.audioFile = audioFile;
        this.pausedAt = 0;
        this.startedAt = 0;

        var source = audioCtx.createBufferSource();
        var gainNode = audioCtx.createGain();

        var request = new XMLHttpRequest();
        request.open("GET", audioFile, true);
        request.responseType = "arraybuffer";

        request.onload = function () {
            var audioData = request.response;
            audioCtx.decodeAudioData(
                audioData,
                function (buffer) {
                    source.buffer = buffer;
                    source.connect(gainNode);
                    gainNode.connect(audioCtx.destination);
                },
                function (e) {
                    console.log("Error with decoding audio data" + e.err);
                }
            );
        };
        request.send();

        this.source = source;
        this.source.onended = function (event) {
            this.isPlaying = false;
        };
        this.gainNode = gainNode;
    }
    /* Sets the base loudness for the audio, between 0 and 1 */
    setBaseVolume(value) {
        this.protected_volumeBase = value;
        this.gainNode.gain.value = this.protected_volumeBase;
    }
    getBaseVolume() {
        return this.protected_volumeBase;
    }

    //stops playing the audio
    stop() {
        if (this.isPlaying) {
            this.source.stop(0);
        }
    }
    copy() {
        return new Sfx(this.audioFile);
    }
    //starts playing the audio
    play(loop = false) {
        this.isPlaying = true;
        var source = audioCtx.createBufferSource();
        source.buffer = this.source.buffer;
        if (loop === true) source.loop = true;

        this.gainNode = audioCtx.createGain();

        source.connect(this.gainNode);
        this.gainNode.connect(audioCtx.destination);

        this.source = source;
        this.source.onended = function (event) {
            this.isPlaying = false;
        };
        this.source.start(0);
    }
    pause() {
        if (this.isPlaying) {
            this.pausedAt = Date.now() - this.startedAt;
            this.source.stop(0);
            this.isPlaying = false;
        }
    }
}

var audio = new Sfx(messageSfx);
var sharp_beep = new Sfx(beep);

audio.setBaseVolume(1);
sharp_beep.setBaseVolume(1);

function Chat() {
    var [messages, setMessages] = useState({});
    const [triggerRender, setTriggerRender] = useState(false);
    var [roomID, setRoomID] = useState("temp");
    var [agentStatus] = useState(userStatus.online);
    const [showPopup, setShowPopup] = useState(false);
    const [showDisconnectPopup, setShowDisconnectPopup] = useState(false);
    var [balance, setBalance] = useState(0);
    var [roomClosed, setRoomClosed] = useState(true);
    var [guestWaiting, setGuestWaiting] = useState(false);
    var [chatRoomStatus, setChatRoomStatus] = useState("waiting");

    var [popupText, setPopupText] = useState("Do you want to close the chat?");
    var timeOutButtons;
    var [disabled, setDisabled] = useState(true);
    let navigate = useNavigate();

    //const { state } = useLocation();

    //  if (state !== null && roomID !== null) {
    useEffect(() => {
        globalThis.socket.send(
            JSON.stringify({
                event: events.userDetailsRequest,
            })
        );
        if (!globalThis.isAgent) {
            if (!messages[roomID]) messages[roomID] = [];
            messages[roomID].push({
                type: "alert",
                alertText: "Waiting for agent.",
            });
        } else {
            agentStatusRequest(agentStatus);
        }

        setTriggerRender(!triggerRender);
    }, []);
    //  }
    /* const handleOnIdle = (event) => {
        // log("user is idle", event);
        // log("last active", getLastActiveTime());
        agentStatusRequest(userStatus.away);
    };

    const handleOnActive = (event) => {
        agentStatusRequest(userStatus.online);
        //log("user is active", event);
        //log("time remaining", getRemainingTime());
    };

    const handleOnAction = (event) => {
        //log("user did something", event);
    };*/

    //const {
    /*getRemainingTime, getLastActiveTime */
    /* } = useIdleTimer({
        timeout: 1000 * 60 * 5, //last is = minutes
        onIdle: handleOnIdle,
        onActive: handleOnActive,
        onAction: handleOnAction,
        debounce: 500,
    });*/
    if (globalThis.recipient && waiting && !globalThis.isAgent) {
        globalThis.socket.send(JSON.stringify({ event: events.startChatRoomRequest, recipientUsername: globalThis.recipient }));
        log("%cStart chat room request to: " + "%c" + globalThis.recipient, colors.default, colors.success);
        waiting = false;
    }

    useEffect(() => {
        globalThis.events.addEventListener(events.messageReceived, messageReceived);
        globalThis.events.addEventListener(events.chatRoomOpened, chatRoomOpened);
        globalThis.events.addEventListener(events.chatRoomClosed, chatRoomClosed);
        globalThis.events.addEventListener(events.chatRequestAcceptRequest, chatRequestAcceptRequest);
        globalThis.events.addEventListener(events.chatRequestFateUpdate, chatRequestFateUpdate);
        globalThis.events.addEventListener(events.disconnected, toggleDisconnectPopup);
        globalThis.events.addEventListener(events.userDetailsResponse, userDetailsResponse);
        globalThis.events.addEventListener(events.payAsYouGoTimeExtended, payAsYouGoTimeExtended);
        globalThis.events.addEventListener(events.leaveRoomResponse, leaveRoomResponse);
        globalThis.events.addEventListener(events.chatRequestCancelResponse, chatRequestCancelResponse);

        return function cleanup() {
            globalThis.events.removeEventListener(events.messageReceived);
            globalThis.events.removeEventListener(events.chatRoomOpened);
            globalThis.events.removeEventListener(events.chatRoomClosed);
            globalThis.events.removeEventListener(events.chatRequestAcceptRequest);
            globalThis.events.removeEventListener(events.chatRequestFateUpdate);
            globalThis.events.removeEventListener(events.disconnected);
            globalThis.events.removeEventListener(events.userDetailsResponse);
            globalThis.events.removeEventListener(events.payAsYouGoTimeExtended);
            globalThis.events.removeEventListener(events.leaveRoomResponse);
            globalThis.events.removeEventListener(events.chatRequestCancelResponse);
        };
    });

    function chatRequestCancelResponse(data) {
        switch (data.response) {
            case responses.success:
                navigate("/chat/user");
                globalThis.selectedRoomID = null;
                break;
            default:
                break;
        }
    }

    function chatRequestCancelRequest() {
        globalThis.socket.send(
            JSON.stringify({
                event: events.chatRequestCancelRequest,
            })
        );
    }

    function userDetailsResponse(data) {
        setBalance(data.balance);
    }

    function chatRequestFateUpdate(data) {
        //   console.log(data);
        if (data.status === chatRequestStatus.rejected) {
            if (!globalThis.isAgent) {
                if (!messages[data.roomID]) messages[data.roomID] = [];
                setRoomID(data.roomID);
                messages[data.roomID].push({
                    type: "alert",
                    alertText: "Agent rejected.",
                });
                setChatRoomStatus("rejected");
            } else {
                for (var i = 0; i < globalThis.guests.length; i++) {
                    if (globalThis.guests[i].email === data.userEmail) {
                        globalThis.guests.splice(i, 1);
                    }
                }
            }
            setTriggerRender(!triggerRender);
        }
        var isGuestWaiting = false;
        for (var j = 0; j < globalThis.guests.length; j++) {
            if (globalThis.guests[j].waiting) {
                isGuestWaiting = true;
            }
        }
        setGuestWaiting(isGuestWaiting);
    }

    function chatRequestAcceptRequest(data) {
        //  console.log(data);
        var alreadyOpened = false;
        for (var i = 0; i < globalThis.guests.length; i++) {
            if (globalThis.guests[i].email === data.userEmail) {
                globalThis.guests[i].waiting = true;
                globalThis.guests[i].requestID = data.requestID;
                globalThis.guests[i].leftChat = false;
                alreadyOpened = true;
            }
        }
        if (!alreadyOpened) {
            globalThis.guests.push({ name: data.userUsername, waiting: true, requestID: data.requestID, leftChat: false, email: data.userEmail });
        }
        sharp_beep.play();
        setGuestWaiting(true);
        toast.error("A new guest wants to chat with you.", { position: "bottom-center" });
        setTriggerRender(!triggerRender);
    }

    /*function startChatRoomResponse(data) {
        log(data);
        if (data.response === responses.startChatRoom.rejected) {
            messages[globalThis.recipient].push({
                type: "alert",
                alertText: "Agent rejected.",
            });
            setTriggerRender(!triggerRender);
        }
    }*/

    function payAsYouGoTimeExtended(data) {
        console.log(data);
        globalThis.socket.send(
            JSON.stringify({
                event: events.userDetailsRequest,
            })
        );
    }
    function chatRoomOpened(data) {
        // console.log(data)

        globalThis.recipient = data.agentUsername;
        setRoomID(data.roomID);
        globalThis.selectedRoomID = data.roomID;
        if (!globalThis.isAgent) {
            setChatRoomStatus("open");
            if (!messages[data.roomID]) {
                messages[data.roomID] = [];
            }
            messages[data.roomID].push({
                type: "alert",
                alertText: "Agent connected.",
            });
        } else {
            agentStatusRequest(userStatus.busy);
            for (var i = 0; i < globalThis.guests.length; i++) {
                if (globalThis.guests[i].email === data.userEmail) {
                    globalThis.guests[i].roomID = data.roomID;
                    globalThis.guests[i].startTime = data.startTime;
                    globalThis.guests[i].endTime = data.endTime;
                }
            }
            //if (globalThis.selectedRoomID === null) {
            globalThis.recipient = data.userUsername;
            globalThis.selectedRoomID = data.roomID;
            if (!messages[data.roomID]) {
                messages[data.roomID] = [];
            }
            messages[data.roomID].push({
                type: "alert",
                alertText: `Chat has started with ${globalThis.recipient}`,
            });
            //}
        }

        setDisabled(false);
        setTriggerRender(!triggerRender);
    }
    function chatRoomClosed(data) {
        if (!globalThis.isAgent) {
            setChatRoomStatus("closed");
            var reason = "";
            switch (data.reason) {
                case responses.chatRoomClosed.chatTimeEnded:
                    reason = "Chat time ended.";
                    break;
                case responses.chatRoomClosed.agentLeft:
                    reason = "Agent has left the chat.";
                    break;
                case responses.chatRequestCreateRequest.insufficientBalance:
                    reason = "You have insufficient balance to coninue.";
                    break;
                default:
                    reason = "Chat has ended.";
                    break;
            }
            messages[data.roomID].push({
                type: "alert",
                alertText: reason,
            });
            setPopupText("Chat has ended.");
            setShowPopup(true);
            setDisabled(true);
        } else {
            agentStatusRequest(userStatus.online);
            for (var i = 0; i < globalThis.guests.length; i++) {
                if (data.roomID === globalThis.guests[i].roomID) {
                    var reason = "";
                    globalThis.guests[i].leftChat = true;
                    switch (data.reason) {
                        case responses.chatRoomClosed.guestLeft:
                            reason = "Guest has left the chat.";
                            break;
                        case responses.chatRequestCreateRequest.insufficientBalance:
                            reason = "Guest has insufficient balance to coninue.";
                            break;
                        default:
                            reason = "Chat has ended.";
                            break;
                    }
                    messages[globalThis.guests[i].roomID].push({
                        type: "alert",
                        alertText: reason,
                    });
                    if (globalThis.selectedRoomID === data.roomID) {
                        setDisabled(true);
                    }
                }
            }
        }

        setTriggerRender(!triggerRender);
    }

    function messageReceived(data) {
        log(
            "%cMessage received from: " + "%c" + data.message.senderUsername + "%c\nMessage: " + "%c" + data.message.message,
            colors.default,
            colors.success,
            colors.default,
            colors.neutral
        );
        var msg = { ...messages };
        if (!msg[data.roomID]) {
            msg[data.roomID] = [];
        }
        console.log(data);
        msg[data.roomID].push({
            text: data.message.message,
            member: {
                username: data.message.senderUsername,
                isAgent: !globalThis.isAgent,
            },
            timeStamp: getTimeStamp(),
        });
        console.log(msg);
        setMessages(msg);
    }

    function switchGuest(guest) {
        globalThis.recipient = guest.name;
        console.log(guest);
        if (globalThis.selectedRoomID !== null) {
            for (var i = 0; i < globalThis.guests.length; i++) {
                if (globalThis.guests[i].roomID === guest.roomID) {
                    globalThis.selectedRoomID = guest.roomID;
                    if (globalThis.guests[i].leftChat || globalThis.guests[i].waiting) {
                        setDisabled(true);
                    } else {
                        setDisabled(false);
                    }
                }
            }
        }
        var isGuestWaiting = false;
        for (var j = 0; j < globalThis.guests.length; j++) {
            if (globalThis.guests[j].waiting) {
                isGuestWaiting = true;
            }
        }
        setGuestWaiting(isGuestWaiting);
        setRoomID(guest.roomID);
        setTriggerRender(!triggerRender);
        if (!globalThis.isAgent) {
            globalThis.recipient = globalThis.agent;
        }
    }

    function getTimeStamp() {
        var time = new Date();
        var hours = time.getHours();
        var minutes = time.getMinutes();
        var timeStamp = ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2);
        return timeStamp;
    }

    /*function leaveChat() {
        navigate("/chat");
        agentStatusRequest(userStatus.offline);
    }*/

    function setAgentStatus(agentStatus) {
        globalThis.socket.send(
            JSON.stringify({
                event: "setStatusRequest",
                userStatus: agentStatus,
            })
        );
    }

    function agentStatusRequest(data) {
        var agentStatus;
        if (data !== undefined) {
            if (data.target === undefined) {
                agentStatus = data;
            } else {
                agentStatus = parseInt(data.target.dataset.status);
            }
        } else {
            agentStatus = userStatus.online;
        }

        globalThis.socket.send(
            JSON.stringify({
                event: "setStatusRequest",
                userStatus: agentStatus,
            })
        );
    }

    const onSendMessage = (message) => {
        if (message !== "") {
            var msg = { ...messages };
            if (!msg[roomID]) {
                msg[roomID] = [];
            }
            msg[roomID].push({
                text: message,
                member: {
                    username: globalThis.username,
                    isAgent: globalThis.isAgent,
                },
                timeStamp: getTimeStamp(),
            });
            setMessages(msg);
            log(roomID);
            globalThis.socket.send(
                JSON.stringify({
                    event: "sendMessageRequest",
                    message: message,
                    recipientUsername: globalThis.recipient,
                    roomID: roomID,
                })
            );
            if (globalThis.recipient) {
                log(
                    "%cMessage sent to: " + "%c" + globalThis.recipient + "%c\nMessage: " + "%c" + message,
                    colors.default,
                    colors.success,
                    colors.default,
                    colors.text
                );
            } else {
                log("%cMessage sent to: " + "%c" + "undefined" + "%c\nMessage: " + "%c" + message, colors.default, colors.error, colors.default, colors.text);
            }
        }
    };

    function toggleGuestList() {
        var guestList = document.getElementsByClassName("sidebar");
        if (guestList[0].style.transform === "translateX(-100%)" || guestList[0].style.transform === "") {
            guestList[0].style.transform = "translateX(0%)";
        } else {
            guestList[0].style.transform = "translateX(-100%)";
        }
    }

    function toggleFooter() {
        var footer = document.getElementsByClassName("footer-buttons-container")[0];
        var footerToggler = document.getElementById("toggleFooter");
        if (footer.classList.contains("footer-buttons-toggle")) {
            footer.classList.remove("footer-buttons-toggle");
            footerToggler.classList.remove("rotate");
            clearTimeout(timeOutButtons);
        } else {
            footer.classList.add("footer-buttons-toggle");
            footerToggler.classList.add("rotate");
            timeOutButtons = setTimeout(() => {
                if (footer.classList.contains("footer-buttons-toggle")) {
                    footer.classList.remove("footer-buttons-toggle");
                    footerToggler.classList.remove("rotate");
                }
            }, 3000);
        }
    }

    function togglePopup() {
        setPopupText("Do you want to leave the chat?");
        setShowPopup(!showPopup);
    }

    function toggleDisconnectPopup() {
        setShowDisconnectPopup(true);
    }

    function disconnectLeaveChat() {
        if (globalThis.isAgent) {
            navigate("/chat/agent-login");
        } else {
            navigate("/chat/");
        }
    }

    function leaveChat() {
        if (!globalThis.isAgent) {
            if (globalThis.online) {
                if (chatRoomStatus === "waiting") {
                    chatRequestCancelRequest();
                } else if (chatRoomStatus === "open") {
                    leaveRoomRequest();
                } else if (chatRoomStatus === "closed") {
                    navigate("/chat/user");
                    globalThis.selectedRoomID = null;
                } else if (chatRoomStatus === "rejected") {
                    navigate("/chat/user");
                    globalThis.selectedRoomID = null;
                }
            } else {
                navigate("/chat/user");
                globalThis.selectedRoomID = null;
            }
        } else {
            globalThis.socket.close();
            globalThis.guests = [];
            navigate("/chat/agent-login");
        }
    }
    function leaveRoomResponse(data) {
        switch (data.response) {
            case responses.notFound:
                toast.error("Something unexpected happened.");
                break;
            case responses.success:
                navigate("/chat/user");
                globalThis.selectedRoomID = null;
            default:
                break;
        }
    }

    function leaveRoomRequest() {
        globalThis.socket.send(
            JSON.stringify({
                event: events.leaveRoomRequest,
            })
        );
    }
    return (
        <div className="App">
            {showDisconnectPopup && <Popup reject={null} accept={disconnectLeaveChat} text="You have been disconnected, press the button to leave?"></Popup>}
            {showPopup && <Popup reject={togglePopup} accept={leaveChat} text={popupText}></Popup>}
            <div className="App-header">
                <div className="App-header-top">
                    <img alt="logo" className="App-logo"></img>
                    <div>
                        <h1 className="chat-header">Tarocchy Chat</h1>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end" }}>
                        <div>{globalThis.isAgent && <Dropdown status={agentStatus} />}</div>
                        <div>{globalThis.isAgent && <Dropdown2 status={agentStatus} />}</div>
                    </div>
                </div>

                <div className="App-header-bottom">
                    <Timer></Timer>
                </div>
                {!globalThis.isAgent && <div className="user-balance">Balance: £{balance}</div>}
            </div>

            <div className="Agent-messages-list">
                {globalThis.isAgent && <Guests func={switchGuest} toggleGuestList={toggleGuestList}></Guests>}
                {messages[roomID] && <Messages messages={messages[roomID]} />}
            </div>
            <div className="inputField">
                <FooterButtons waiting={guestWaiting} toggleGuestList={toggleGuestList} isAgent={globalThis.isAgent} leave={togglePopup}></FooterButtons>
                <div>
                    <button id="leaveChat" onClick={togglePopup}>
                        {globalThis.isAgent ? "LOG OUT" : "END CHAT"}
                    </button>
                </div>
                <Input onSendMessage={onSendMessage} disabled={disabled} />
            </div>
        </div>
    );
}

export default Chat;
