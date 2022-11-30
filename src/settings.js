export const settings = {
    log: false,
    version: `v1.0.63`,
    showVersion: true,
};
export const globalColors = {
    /*--agent: red;
    --guest: green;
    --background: rgba(255, 255, 255, 0.5);
    --secondarybg: rgba(255, 255, 255, 0.7);
    --textcolor: rgba(0, 0, 0, 1);
    --alert: rgba(255, 255, 255, 1);
    --chatinput: rgba(255, 255, 255, 1);
    --inputtextcolor: rgba(0, 0, 0, 1);
    --messagecolor: rgba(0, 0, 0, 1);*/
    light: {
        guest: "yellow",
        agent: "blue",
        background: "rgba(255, 255, 255, 0.5)",
        secondarybg: "rgba(255, 255, 255, 0.7)",
        textcolor: "rgba(0, 0, 0, 1)",
        alert: "rgba(255, 255, 255, 1)",
        chatinput: "rgba(255, 255, 255, 1)",
        inputtextcolor: "rgba(0, 0, 0, 1)",
        messagecoloragent: "rgba(255, 255, 255, 1)",
        messagecolorguest: "rgba(0,0,0,1)",
        othercolor: "rgba(0,0,0,1)",
        othercolorhover: "rgba(63,145,129,1)",
        sidebarcolor: "rgba(255, 255, 255, 1)",
    },
    dark: {
        guest: "yellow",
        agent: "blue",
        background: "rgba(0, 0, 0, 0.5)",
        secondarybg: "rgba(0, 0, 0, 0.7)",
        textcolor: "rgba(200, 200, 200, 1)",
        alert: "rgba(0, 0, 0, 1)",
        chatinput: "rgba(255, 255, 255, 0.2)",
        inputtextcolor: "rgba(255, 255, 255, 1)",
        messagecoloragent: "rgba(255, 255, 255, 1)",
        messagecolorguest: "rgba(0,0,0,1)",
        othercolor: "orangered",
        othercolorhover: "rgba(63,145,129,1)",
        sidebarcolor: "rgba(0, 0, 0, 0.5)",
    },
    temp: {
        guest: "rgba(255,200,0,1)",
        agent: "rgba(69,200,107,1)",
        background: "rgba(255, 150, 150, .05)",
        secondarybg: "rgba(0, 0, 0, 0.7)",
        textcolor: "rgba(200, 200, 200, 1)",
        alert: "rgba(0, 0, 0, 1)",
        chatinput: "rgba(255, 255, 255, 0.2)",
        inputtextcolor: "rgba(255, 255, 255, 1)",
        messagecoloragent: "rgba(0, 0, 0, 1)",
        messagecolorguest: "rgba(0,0,0,1)",
        othercolor: "rgba(63,145,129,1)",
        othercolorhover: "rgba(20,100,100,1)",
        sidebarcolor: "rgba(0, 0, 0, 0.8)",
    },
};

export const colors = {
    text: "color:#d3d3d3;font-size:12px;font-family:Courier New;font-style:italic;",
    action: "color: #00ffff;font-size:12px;font-weight:bold;font-style:italic;font-family:Courier New;",
    alert: "color:#ff0000;font-size:12px;font-weight:bold;font-style:italic;font-family:Courier New;",
    success: "color:#00ff00;font-size:12px;font-family:Courier New;",
    warning: "color:#ff8000;font-size:12px;font-family:Courier New;",
    error: "color:#ff0000;font-size:12px;font-family:Courier New;",
    default: "color:#FF00FF;font-size:12px;font-family:Courier New;margin-top:2px;margin-bottom:2px;",
};

export var log = setLogging();

function setLogging() {
    if (settings.log) {
        console.log("%cLogging enabled!", colors.action);
        return console.log;
    } else {
        console.log("%cLogging disabled!", colors.alert);
        return function () {};
    }
}

function setColorScheme(theme) {
    for (const key in theme) {
        if (Object.hasOwnProperty.call(theme, key)) {
            document.documentElement.style.setProperty(`--${key}`, theme[key]);
        }
    }
}

setColorScheme(globalColors.temp);
