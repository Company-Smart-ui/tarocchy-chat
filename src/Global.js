import Events from "./Events";

const globalEvents = new Events();
const globalThis = {
    events: globalEvents,
    socket: null,
    url: "",
    loggedIn: false,
    username: null,
    password: null,
    online: false,
    isAgent: false,
    isAdmin: false,
    agent: null,
    recipient: "",
    guests: [],
    pin: "",
    selectedRoomID: null,
    isIOS: false,
    siteUrl: "",
};

export default globalThis;
