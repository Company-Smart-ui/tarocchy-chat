import React from "react";
import "./App.css";
import globalThis from "./Global";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { validPassword, validEmail } from "./functions";
import { events, responses, chatRoomType } from "./ServerCommunication";
import PasswordPanel from "./Components/PasswordPanel";
var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + "-" + mm + "-" + dd;
export default function Earnings() {
    let [earnings, setEarnings] = useState([]);
    let [startDate, setStartDate] = useState("2020-01-01");
    let [endDate, setEndDate] = useState(today);
    let navigate = useNavigate();

    useEffect(() => {
        globalThis.events.addEventListener(events.disconnected, disconnected);
        return function cleanup() {
            globalThis.events.removeEventListener(events.disconnected);
        };
    });
    function disconnected() {
        navigate("/chat/agent-login");
    }

    function getChatlogResponse(data) {
        if (data.chatlogs) {
            for (var i = 0; i < data.chatlogs.length; i++) {
                switch (data.chatlogs[i].closeReason) {
                    case responses.chatRoomClosed.unknown:
                        data.chatlogs[i].closeReason = "Unknown";
                        break;
                    case responses.chatRoomClosed.chatTimeEnded:
                        data.chatlogs[i].closeReason = "Completed";
                        break;
                    case responses.chatRoomClosed.guestLeft:
                        data.chatlogs[i].closeReason = "Guest left";
                        break;
                    case responses.chatRoomClosed.agentLeft:
                        data.chatlogs[i].closeReason = "Agent left";
                        break;
                    case responses.chatRoomClosed.chatRequestTimeout:
                        data.chatlogs[i].closeReason = "Missed by agent";
                        break;
                    case responses.chatRoomClosed.agentRejectedChat:
                        data.chatlogs[i].closeReason = "Rejected by agent";
                        break;
                    case responses.chatRoomClosed.insufficientBalance:
                        data.chatlogs[i].closeReason = "Insufficient balance";
                        break;
                    default:
                        break;
                }
                switch (data.chatlogs[i].type) {
                    case chatRoomType.fixed10:
                        data.chatlogs[i].type = "10 minute session";
                        break;
                    case chatRoomType.fixed20:
                        data.chatlogs[i].type = "20 minute session";
                        break;
                    case chatRoomType.fixed30:
                        data.chatlogs[i].type = "30 minute session";
                        break;
                    case chatRoomType.payAsYouGo:
                        data.chatlogs[i].type = "Pay as you go";
                        break;
                    default:
                        break;
                }
            }
            setEarnings(data.chatlogs);
        }
    }

    function getChatlogs() {
        globalThis.socket.send(
            JSON.stringify({
                event: events.getChatlogRequest,
                startTime: startDate,
                endTime: endDate,
            })
        );
    }

    function navigateToChatlogs(log) {
        navigate("/chat/agent-panel/earnings/chatlog", { state: { chatlog: log } });
    }

    function downloadChatlogs() {}

    function msToTime(duration) {
        var milliseconds = Math.floor((duration % 1000) / 100),
            seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
    }

    function getDuration(startTime, endTime) {
        var s = startTime.split(/\D+/);
        var e = endTime.split(/\D+/);
        var sTime = new Date(s[0], --s[1], s[2], s[3], s[4], s[5], s[6]).getTime();
        var eTime = new Date(e[0], --e[1], e[2], e[3], e[4], e[5], e[6]).getTime();

        var duration = msToTime(eTime - sTime);
        return duration;
    }

    function getDate(s) {
        var date = new Date(s);
        var year = 1900 + date.getYear();
        var month = 1 + date.getMonth();
        var day = date.getDate();
        return year + "/" + month + "/" + day;
    }

    function getTime(s) {
        var date = new Date(s);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();

        return (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    useEffect(() => {
        globalThis.events.addEventListener(events.getChatlogResponse, getChatlogResponse);
        return function cleanup() {
            globalThis.events.removeEventListener(events.getChatlogResponse);
        };
    });

    return (
        <div className="register_login_container">
            <div className="agent-panel-container">
                <p className="earnings-title">Earnings</p>
                <div className="date-selector">
                    <p>From date:</p>
                    <input type="date" onChange={(e) => setStartDate(e.target.value)} defaultValue={startDate}></input>
                </div>
                <div className="date-selector">
                    <p>To date:</p>
                    <input type="date" onChange={(e) => setEndDate(e.target.value)} defaultValue={endDate}></input>
                </div>
                <button onClick={getChatlogs} className="table-button">
                    Get report
                </button>
                <p className="date-period">
                    Showing for date period:
                    <br></br>from <span style={{ color: "red" }}>{startDate}</span> to <span style={{ color: "red" }}> {endDate}</span>
                </p>
                <table>
                    <thead>
                        <tr>
                            <th>Started</th>
                            <th>Type</th>
                            <th>Duration</th>
                            <th>Status</th>
                            <th>Earnings</th>
                        </tr>
                    </thead>
                    {earnings && (
                        <tbody>
                            {earnings.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            {getDate(item.startTime)}
                                            <br></br>
                                            {getTime(item.startTime)}
                                        </td>
                                        <td>{item.type}</td>
                                        <td>{getDuration(item.startTime, item.endTime)}</td>
                                        <td>{item.closeReason}</td>
                                        <td>£{item.agentEarnings}</td>
                                        <td>
                                            <button className="table-button" onClick={navigateToChatlogs.bind(this, item.messageLog)}>
                                                View Chatlog
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    )}
                </table>
                <button
                    className="table-button"
                    onClick={function () {
                        navigate("/chat/agent-panel");
                    }}
                >
                    Back
                </button>
            </div>
        </div>
    );
}
