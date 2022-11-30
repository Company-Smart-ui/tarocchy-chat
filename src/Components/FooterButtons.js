import React from "react";
import "../App.css";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

/*import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { events, response } from "./ServerCommunication";
import globalThis from "./Global";*/

export default function FooterButtons(data) {
    const toggleGuestList = data.toggleGuestList;
    const isAgent = data.isAgent;
    const leave = data.leave;
    const waiting = data.waiting;
    return (
        <div className="footer-buttons-container">
            <button onClick={leave}>EXIT</button>
            {isAgent && !waiting && (
                <button onClick={toggleGuestList}>
                    <FontAwesomeIcon icon={faUserGroup} />
                </button>
            )}
            {isAgent && waiting && (
                <button onClick={toggleGuestList} style={{ backgroundColor: "red" }}>
                    ACCEPT
                </button>
            )}
        </div>
    );
}
