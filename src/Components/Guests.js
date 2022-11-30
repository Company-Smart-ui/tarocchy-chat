import React from "react";
import "../App.css";
import globalThis from "../Global";
import { events, chatRequestStatus } from "../ServerCommunication";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheck, faX } from "@fortawesome/free-solid-svg-icons";

export default function Guests(data) {
    const [triggerRender, setTriggerRender] = useState(false);
    var func = data.func;
    var toggleGuestList = data.toggleGuestList;

    function rejectGuest(guest) {
        /*for (var i = 0; i < globalThis.guests.length; i++) {
            if (globalThis.guests[i].email === guest.email) {
                globalThis.guests[i].waiting = false;
                globalThis.guests.splice(i, 1);
            }
        }*/
        //setTriggerRender(!triggerRender);
        globalThis.socket.send(
            JSON.stringify({
                event: events.chatRequestAcceptResponse,
                requestID: guest.requestID,
                chatRequestStatus: chatRequestStatus.rejected,
            })
        );
    }
    function acceptGuest(guest) {
        console.log(guest);
        for (var i = 0; i < globalThis.guests.length; i++) {
            if (globalThis.guests[i].requestID === guest.requestID) {
                globalThis.guests[i].waiting = false;
            }
        }
        setTriggerRender(!triggerRender);
        globalThis.socket.send(
            JSON.stringify({
                event: events.chatRequestAcceptResponse,
                requestID: guest.requestID,
                chatRequestStatus: chatRequestStatus.accepted,
            })
        );
    }

    function removeGuest(guest) {
        for (var i = 0; i < globalThis.guests.length; i++) {
            if (guest.roomID === globalThis.guests[i].roomID) {
                globalThis.guests.splice(i, 1);
            }
        }
    }
    return (
        <div className="sidebar">
            <h2 className="guest-header">Guests</h2>
            <ul className="guest-container">
                {globalThis.guests.map((guest, index) => (
                    <li key={index} className={globalThis.selectedRoomID === guest.roomID ? "guest-item selected" : "guest-item notselected"} onClick={func.bind(this, guest)}>
                        <div className="guest-name">{guest.name}</div>
                        {guest.waiting && (
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <button className="icon-button reject" onClick={rejectGuest.bind(this, guest)}>
                                    <FontAwesomeIcon icon={faX} />
                                </button>
                                <button className="icon-button accept" onClick={acceptGuest.bind(this, guest)}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </button>
                            </div>
                        )}
                        {guest.leftChat && (
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <button className="icon-button reject" onClick={removeGuest.bind(this, guest)}>
                                    <FontAwesomeIcon icon={faX} />
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <div className="exit-guests">
                <button style={{ margin: "10px" }} onClick={toggleGuestList}>
                    CLOSE
                </button>
            </div>
        </div>
    );
}
