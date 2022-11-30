export function validEmail(email) {
    if (email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        return true;
    } else {
        return false;
    }
}
export function validPassword(password) {
    if (password.length > 4) {
        return true;
    } else {
        return false;
    }
}

export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

export function getPrice(rate, minutes, discount = 1, decimals = 0) {
    return "£" + Math.floor(rate * minutes * discount).toFixed(decimals);
}
