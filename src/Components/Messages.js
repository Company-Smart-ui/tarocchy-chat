import { Component } from "react";
import React from "react";
import globalThis from "../Global";
//import { user } from "./Chat";
class Messages extends Component {
    constructor(props) {
        super(props);
        this.messagesEndRef = React.createRef();
        this.key = 0;
        this.lastSender = null;
    }

    componentDidMount() {
        this.scrollToBottom();
    }
    componentDidUpdate() {
        this.scrollToBottom();
    }
    scrollToBottom = () => {
        if (!globalThis.isIOS) {
            this.messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } else {
            this.messagesEndRef.current.scrollIntoView(true);
        }
    };
    render() {
        const { messages } = this.props;
        this.lastSender = null;
        return (
            <div className="Messages-list">
                <ul key="a">
                    {messages.map((m, index) => this.renderMessage(m, index))} <div ref={this.messagesEndRef} />
                </ul>
            </div>
        );
    }

    renderMessage(message, index) {
        const { member, text, timeStamp, type, alertText } = message;
        var isAgent;
        if (type !== "alert") {
            if (member.isAgent) {
                isAgent = "agent";
            } else {
                isAgent = "guest";
            }
            var className;
            if (member.username === globalThis.username) {
                className = `Messages-message currentMember ${isAgent}`;
            } else {
                className = `Messages-message ${isAgent}`;
            }
            var show;
            if (this.lastSender !== member.username) {
                this.lastSender = member.username;
                show = true;
            } else if (this.lastSender === member.username && this.key !== 0) {
                show = false;
            }
        }

        if (type === "alert") {
            className = "alert";
        }

        return (
            <ul key={index}>
                {className !== "alert" ? (
                    <li key={index} className={className}>
                        {show ? <span className="avatar" /> : <span className="avatar hiddenAvatar" />}
                        {show ? (
                            <div className="Message-content">
                                {show && <div className="username">{member.username}</div>}
                                <div className="text">{text}</div>
                            </div>
                        ) : (
                            <div className="Message-content hiddenBubble">
                                {show && <div className="username">{member.username}</div>}
                                <div className="text">{text}</div>
                            </div>
                        )}
                        <div className="timeStamp">{timeStamp}</div>
                    </li>
                ) : (
                    <li key={index} className="alert">
                        {alertText}
                    </li>
                )}
            </ul>
        );
    }
}

export default Messages;
