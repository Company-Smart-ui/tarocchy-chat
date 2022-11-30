import React from "react";
import "../App.css";
import { useState, useEffect } from "react";
import { events } from "../ServerCommunication";
import globalThis from "../Global";

/*import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { events, response } from "./ServerCommunication";
import globalThis from "./Global";*/

export default function Timer() {
    var [timeLeft, setTimeLeft] = useState("Time left: 0:00");
    var [timeElapsed, setTimeElapsed] = useState("Time Elapsed: 0:00");
    //const [timerRunning, setTimerRunning] = useState(false);

    useEffect(() => {
        globalThis.events.addEventListener(events.chatTimeUpdate, chatTimeUpdate);
        return function cleanup() {
            globalThis.events.removeEventListener(events.chatTimeUpdate);
        };
    });

    function chatTimeUpdate(data) {
        if (!globalThis.isAgent) {
            if (data.roomID === globalThis.selectedRoomID) {
                if (data.chatTime > 0) {
                    setTimeLeft("Time left: " + millisToMinutesAndSeconds(data.chatTime));
                    setTimeElapsed("Time elapsed: " + millisToMinutesAndSeconds(data.endTime - data.startTime - data.chatTime));
                }
            }
        } else {
            // for (var i = 0; i < globalThis.guests.length; i++) {
            if (data.roomID === globalThis.selectedRoomID) {
                if (data.chatTime > 0) {
                    setTimeLeft("Time left: " + millisToMinutesAndSeconds(data.chatTime));
                    setTimeElapsed("Time elapsed: " + millisToMinutesAndSeconds(data.endTime - data.startTime - data.chatTime));
                }
            }
            //  }
        }
    }

    function millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    /*functionif (!timerRunning) {
        setTimerRunning(true);
        timer();
    }*/

    /*function timer() {
        setTimeout(() => {
            setTimeLeft("Time left: " + millisToMinutesAndSeconds(data.endTime - Date.now()));
            setTimeElapsed("Time elapsed: " + millisToMinutesAndSeconds(Date.now() - data.startTime));
            timer();
        }, 1000);
    }*/
    return (
        <div className="timer-container">
            <h2>{timeLeft}</h2>
            <h2>{timeElapsed}</h2>
        </div>
    );
}
