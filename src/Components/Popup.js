import React from "react";
import "../App.css";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";

/*import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { events, response } from "./ServerCommunication";
import globalThis from "./Global";*/

export default function Popup(data) {
    const text = data.text;
    const accept = data.accept;
    const reject = data.reject;
    return (
        <div className="popup-container">
            <div className="popup">
                <div style={{ textAlign: "center" }}>{text}</div>
                <div className="popup-buttons-container">
                    {reject && (
                        <button onClick={reject} className="icon-button reject">
                            <FontAwesomeIcon icon={faX} />
                        </button>
                    )}
                    {accept && (
                        <button onClick={accept} className="icon-button accept">
                            <FontAwesomeIcon icon={faCheck} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
