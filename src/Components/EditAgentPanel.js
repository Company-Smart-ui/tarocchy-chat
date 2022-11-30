import React from "react";
import "../App.css";
import { useState, useEffect, useRef } from "react";
import globalThis from "../Global";
import { accountType, events, responses } from "../ServerCommunication";
import StarRatings from "react-star-ratings";


export default function EditAgentPanel(data) {
    const [newPassword, setNewPassword] = useState(null);
    const [agentPin, setAgentPin] = useState(null);
    const [agentEmail, setAgentEmail] = useState(null);
    const [agentUsername, setAgentUsername] = useState(null);
    const [agentRate, setAgentRate] = useState(null);
    const [agentImage, setAgentImage] = useState("");
    const [agentBIO, setAgentBIO] = useState("");
    const [agentList, setAgentList] = useState([]);
    const [whatToExpect, setWhatToExpect] = useState("");
    const [whatIsRequired, setWhatIsRequired] = useState("");
    const [specialties, setSpecialties] = useState("");
    const [languages, setLanguages] = useState("");
    const [categories, setCategories] = useState([]);
    const [visible, setVisible] = useState(1);
    const [isVisible, setIsVisible] = useState(null);
    const imageTrigger = useRef(null);
    const [agentReviews, setAgentReviews] = useState([]);

    const togglePanel = data.togglePanel;
    useEffect(() => {
        globalThis.events.addEventListener(events.allAgentPINsResponse, allAgentPINsResponse);
        globalThis.events.addEventListener(events.downloadAgentProfilePictureResponse, downloadAgentProfilePictureResponse);
        globalThis.events.addEventListener(events.setAgentProfilePictureResponse, setAgentProfilePictureResponse);
        globalThis.events.addEventListener(events.agentDetailsResponse, agentDetailsResponse);
        globalThis.events.addEventListener(events.getReviewsResponse, getReviewsResponse);
        globalThis.events.addEventListener(events.deleteReviewResponse, deleteReviewResponse);
        globalThis.socket.send(
            JSON.stringify({
                event: events.allAgentPINsRequest,
                showVisibleOnly: false,
            })
        );
        return function cleanup() {
            globalThis.events.removeEventListener(events.allAgentPINsResponse);
            globalThis.events.removeEventListener(events.downloadAgentProfilePictureResponse);
            globalThis.events.removeEventListener(events.setAgentProfilePictureResponse);
            globalThis.events.removeEventListener(events.agentDetailsResponse);
            globalThis.events.removeEventListener(events.getReviewsResponse);
            globalThis.events.removeEventListener(events.deleteReviewResponse);
        };
    }, []);

    function getReviewsResponse(data) {
        setAgentReviews(data.reviews);
    }

    function deleteReviewResponse(data) {
        if (data.response === responses.success) {
            globalThis.socket.send(
                JSON.stringify({
                    event: events.getReviewsRequest,
                    agentPIN: agentPin,
                })
            );
        }
    }
    useEffect(() => {
        globalThis.socket.send(
            JSON.stringify({
                event: events.downloadAgentProfilePictureRequest,
                agentPIN: agentPin,
            })
        );
        globalThis.socket.send(
            JSON.stringify({
                event: events.agentDetailsRequest,
                agentPIN: agentPin,
            })
        );
        globalThis.socket.send(
            JSON.stringify({
                event: events.getReviewsRequest,
                agentPIN: agentPin,
            })
        );
    }, [agentPin]);

    useEffect(() => {
        var selectedCategories = document.getElementsByClassName("categories");
        // console.log(selectedCategories);
        for (var k = 0; k < selectedCategories.length; k++) {
            selectedCategories[k].checked = false;
        }
        if (categories) {
            for (var i = 0; i < categories.length; i++) {
                for (var j = 0; j < selectedCategories.length; j++) {
                    if (selectedCategories[j].value === categories[i]) {
                        selectedCategories[j].checked = true;
                    }
                }
            }
        }
    }, [categories]);

    function agentDetailsResponse(data) {
        console.log(data);
        setAgentBIO(data.bio);
        setAgentUsername(data.username);
        setAgentEmail(data.email);
        setAgentRate(data.rate);
        setSpecialties(data.specialties);
        setLanguages(data.languages);
        setWhatIsRequired(data.whatisrequired);
        setWhatToExpect(data.whattoexpect);
        setCategories(data.categories);
        setVisible(data.visible);
    }

    useEffect(() => {
        console.log(agentBIO);
    }, [agentBIO]);

    function allAgentPINsResponse(data) {
        console.log(data);
        setAgentList(data.agentPINs);
    }

    function setAgentProfilePictureResponse(data) {
        globalThis.socket.send(
            JSON.stringify({
                event: events.downloadAgentProfilePictureRequest,
                agentPIN: agentPin,
            })
        );
        // setAgentImage(data.imageBase64);
    }

    function downloadAgentProfilePictureResponse(data) {
        setAgentImage(data.imageBase64);
    }

    function changeAgentDetails() {
        //  console.log(categories);
        globalThis.socket.send(
            JSON.stringify({
                event: events.changeAgentDetailsRequest,
                agentPIN: agentPin,
                username: agentUsername,
                password: newPassword,
                email: agentEmail,
                rate: agentRate,
                bio: agentBIO,
                whatisrequired: whatIsRequired,
                whattoexpect: whatToExpect,
                specialties: specialties,
                languages: languages,
                categories: categories,
                visible: visible,
                //whatisrequired:
            })
        );
    }
    function setNewAgent(pin) {
        setAgentPin(pin);
        /*globalThis.socket.send(
            JSON.stringify({
                event: events.downloadAgentProfilePictureRequest,
                PIN: pin,
            })
        );*/
    }

    function setNewAgentImage(event) {
        var file = event.target.files[0];
        var reader = new FileReader(file);
        reader.readAsDataURL(file);
        reader.onload = function (event) {
            // setAgentImage(event.target.result);
            // console.log(agentImage);
            // The file's text will be printed here
            globalThis.socket.send(
                JSON.stringify({
                    event: events.setAgentProfilePictureRequest,
                    agentPIN: agentPin,
                    imageBase64: event.target.result,
                })
            );
        };
    }

    function triggerUploader() {
        imageTrigger.current.click();
    }

    function setAgentCategories() {
        var newCategories = [];
        var selectedCategories = document.getElementsByClassName("categories");
        for (var i = 0; i < selectedCategories.length; i++) {
            if (selectedCategories[i].checked) {
                var value = selectedCategories[i].value;
                console.log(value);
                newCategories.push(value);
                //  newCategories[selectedCategories[i].value] = selectedCategories[i].value;
            }
        }
        setCategories(newCategories);
    }

    function setVisibility(e) {
        if (e.checked) {
            setVisible(1);
        } else {
            setVisible(0);
        }
    }

    function deleteReview(id) {
        globalThis.socket.send(
            JSON.stringify({
                event: events.deleteReviewRequest,
                reviewID: id,
                agentPIN: agentPin,
            })
        );
    }
    return (
        <div style={{ position: "fixed", top: 0, left: 0, backgroundColor: "rgba(0,0,0,0.7)", width: "100%", minHeight: "100%", boxSizing: "border-box" }}>
            <div
                style={{
                    position: "absolute",
                    display: "flex",
                    top: "50%",
                    left: "50%",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: 20,
                    maxHeight: "80%",
                    width: "50%",
                    boxSizing: "border-box",
                    overflow: "auto",
                    backgroundColor: "rgba(255,255,255,0.9)",
                    borderRadius: 15,
                    transform: "translate(-50%,-50%)",
                }}
            >
                <div style={{ textAlign: "center" }} className="secondary-title">
                    Update agent details
                </div>
                <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center" }}>
                    <select onChange={(e) => setNewAgent(e.target.value)}>
                        {agentList.map((item) => {
                            return <option value={item}>{item}</option>;
                        })}
                    </select>
                    <input type="text" placeholder="Agent email" onChange={(e) => setAgentEmail(e.target.value)} value={agentEmail}></input>
                    <input type="number" placeholder="Agent rate" onChange={(e) => setAgentRate(e.target.value)} value={agentRate}></input>
                    <input type="text" placeholder="Agent username" onChange={(e) => setAgentUsername(e.target.value)} value={agentUsername}></input>
                    <input type="password" placeholder="New password" onChange={(e) => setNewPassword(e.target.value)}></input>
                    <div>
                        <label>Visible</label>
                        <input type="checkbox" onChange={(e) => setVisibility(e.target)} checked={visible}></input>
                    </div>

                    <div style={{ textAlign: "center" }} className="secondary-title">
                        Click on the image to change the picture.
                    </div>
                    <img className="edit-agent-image" src={agentImage} onClick={triggerUploader}></img>
                    <input
                        ref={imageTrigger}
                        style={{ display: "none" }}
                        type="file"
                        id="img"
                        name="img"
                        accept="image/*"
                        onChange={(e) => setNewAgentImage(e)}
                    ></input>
                    <label>BIO</label>
                    <textarea id="bio" placeholder="BIO" value={agentBIO} onChange={(e) => setAgentBIO(e.target.value)} rows="5"></textarea>
                    <label>What is required</label>
                    <textarea placeholder="What is required" value={whatIsRequired} onChange={(e) => setWhatIsRequired(e.target.value)} rows="5"></textarea>
                    <label>What to expect</label>
                    <textarea placeholder="What to expect" value={whatToExpect} onChange={(e) => setWhatToExpect(e.target.value)} rows="5"></textarea>
                    <label>Specialties</label>
                    <input type="text" placeholder="Specialties" onChange={(e) => setSpecialties(e.target.value)} value={specialties}></input>
                    <label>Languages</label>
                    <input type="text" placeholder="Languages" onChange={(e) => setLanguages(e.target.value)} value={languages}></input>
                    <label>Categories</label>
                    <div className="category-container">
                        <div className="category">
                            <input type="checkbox" id="categories" className="categories" value="TAROT" onChange={(e) => setAgentCategories(e.target)}></input>
                            <label>Tarot</label>
                        </div>
                        <div className="category">
                            <input
                                type="checkbox"
                                id="categories"
                                className="categories"
                                value="PSYCHICS"
                                onChange={(e) => setAgentCategories(e.target)}
                            ></input>
                            <label>Psychics</label>
                        </div>
                        <div className="category">
                            <input
                                type="checkbox"
                                id="categories"
                                className="categories"
                                value="HEALERS"
                                onChange={(e) => setAgentCategories(e.target)}
                            ></input>
                            <label>Healers</label>
                        </div>
                        <div className="category">
                            <input
                                type="checkbox"
                                id="categories"
                                className="categories"
                                value="LOVE ADVICE"
                                onChange={(e) => setAgentCategories(e.target)}
                            ></input>
                            <label>Love Advice</label>
                        </div>
                        <div className="category">
                            <input
                                type="checkbox"
                                id="categories"
                                className="categories"
                                value="MEDIUMS"
                                onChange={(e) => setAgentCategories(e.target)}
                            ></input>
                            <label>Mediums</label>
                        </div>
                        <div className="category">
                            <input type="checkbox" id="categories" className="categories" value="RUNES" onChange={(e) => setAgentCategories(e.target)}></input>
                            <label>Runes</label>
                        </div>
                        <div className="category">
                            <input
                                type="checkbox"
                                id="categories"
                                className="categories"
                                value="REMOVING ATTACHMENTS"
                                onChange={(e) => setCategories(e.target)}
                            ></input>
                            <label>Removing Attachments</label>
                        </div>
                    </div>
                </div>{" "}
                <div className="button-container">
                    <button style={{ width: "50%" }} className="login-register-button" onClick={changeAgentDetails}>
                        Change agent details
                    </button>
                    <button style={{ width: "50%" }} className="login-register-button" onClick={togglePanel}>
                        {"Back"}
                    </button>
                </div>
                <label className="label">Reviews</label>
                <div className="review-container">
                    {agentReviews
                        .slice(0)
                        .reverse()
                        .map((review) => {
                            return (
                                <div className="review">
                                    <div className="name-rating">
                                        <div className="review-name">User: {review.username}</div>
                                        <StarRatings
                                            rating={review.stars}
                                            starRatedColor="orange"
                                            numberOfStars={5}
                                            name="rating"
                                            starDimension="2.5vmin"
                                            starSpacing="0vmin"
                                        />
                                    </div>
                                    <div className="review-title">{review.title === "" ? "No title" : "Title: " + review.title}</div>
                                    <div className="review-content">Content: {review.content}</div>
                                    <button onClick={deleteReview.bind(this, review.reviewID)} className="review-delete">
                                        DELETE
                                    </button>
                                    <hr className="review-hr"></hr>
                                </div>
                            );
                        })}
                    {agentReviews.length === 0 && <div className="no-reviews">No reviews yet!</div>}
                </div>
            </div>
        </div>
    );
}
