export function setCookie(key, value) {
    const d = new Date();
    d.setTime(d.getTime() + (10  *24*60*60*1000)); //cookie expires in 10 days
    let expires = "expires="+ d.toUTCString();
    document.cookie = key + "=" + value + ";" + expires + ";";
}

export function getCookie(key) {
    key = key + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(key) == 0) {
        return c.substring(key.length, c.length);
      }
    }
    return undefined;
}

export function deleteCookie(key) {
    document.cookie = key + "=; expires=Thu, 01 Jan 1942 00:00:00 UTC; path=/;";
}

export default {setCookie, getCookie, deleteCookie};