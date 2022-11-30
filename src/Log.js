import React from "react";
import "./App.css";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Log() {
    const data = useLocation();
    var chatlog = data.state.chatlog;
    getRecipientNames();
    function convertTimestamp(timestamp) {
        const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        var date = new Date(timestamp);
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var dayName = weekday[date.getDay()];
        var monthName = month[date.getMonth()];
        return dayName + " " + monthName + " 0" + day + " " + (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    function getRecipientNames() {
        for (var i = 0; i < chatlog.length; i++) {
            for (var j = 0; j < chatlog[i].messageLog.length; j++) {
                if (!chatlog[i].name1) {
                    chatlog[i].name1 = chatlog[i].messageLog[j].senderUsername;
                }
                if (!chatlog[i].name2 && chatlog[i].messageLog[j].senderUsername !== chatlog[i].name1) {
                    chatlog[i].name2 = chatlog[i].messageLog[j].senderUsername;
                    break;
                }
            }
        }
    }
    /*            {chatlog.map((item, i) => {
                return (
                    <ul>
                        <div className="chatlog-header">Chatlog {i + 1}</div>
                        {chatlog[i].messageLog.map((item2, j) => {
                            return (
                                <li className="log-style" key={j}>
                                    {convertTimestamp(chatlog[i].messageLog[j].timestamp) + " " + chatlog[i].messageLog[j].senderUsername + ": " + chatlog[i].messageLog[j].message}
                                </li>
                            );
                        })}
                    </ul>
                );
            })}*/
    /*            {chatlog.map((item, i) => {
                console.log(chatlog[i]);
                return (
                    <ul>
                        <div className="chatlog-header">Chatlog {i + 1}</div>
                        <li className="log-style" key={i}>
                            {chatlog[i].messageLog.length > 0 && "Chat started: " + convertTimestamp(chatlog[i].messageLog[0].timestamp)}
                        </li>
                        <li className="log-style" key={i}>
                            {chatlog[i].messageLog.length > 0 && "Chat ended: " + convertTimestamp(chatlog[i].messageLog[chatlog[i].messageLog.length - 1].timestamp)}
                        </li>
                    </ul>
                );
            })}*/
    return (
        <div className="log-container">
            {chatlog.map((item, i) => {
                return (
                    <ul key={i}>
                        <div className="chatlog-header">Chatlog {i + 1}</div>
                        <div className="chatlog-header">{`Participants: ${chatlog[i].name1 ? chatlog[i].name1 : ""} ${chatlog[i].name2 ? chatlog[i].name2 : ""}`}</div>
                        <li className="log-style" key={i}>
                            {chatlog[i].messageLog.length > 0 && "Chat started: " + convertTimestamp(chatlog[i].messageLog[0].timestamp)}{" "}
                            {chatlog[i].messageLog.length > 0 && "Chat ended: " + convertTimestamp(chatlog[i].messageLog[chatlog[i].messageLog.length - 1].timestamp)}
                        </li>
                    </ul>
                );
            })}
        </div>
    );
}
