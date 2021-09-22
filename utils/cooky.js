import CryptoJS from 'crypto-js';

class cooky {
  static getCookie(cookieName) {
    const str = `${cookieName}=`;
    const ca = document.cookie.split(';');
    for (let i = 0, j = ca.length, str1 = ''; i < j; i += 1) {
      str1 = ca[i];
      while (str1.charAt(0) === ' ') {
        str1 = str1.substring(1);
      }
      if (str1.indexOf(str) !== -1) {
        return str1.substring(str.length, str1.length);
      }
    }
    return '';
  }

  static deleteCookie(name) {
    document.cookie =
      name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  static setCookie(cookieName, cookieValue, expireDays) {
    const d = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    document.cookie = `${cookieName}=${cookieValue}; expires=${d.toUTCString()}; path=/`;
  }

  static getCityFromCookie() {
    const cookieCity = cooky.getCookie('CookyCity'); //decrypted one
    if (cookieCity) {
      const strEncrypted = cookieCity.split('@')[0];
      const bytes = CryptoJS.AES.decrypt(strEncrypted, secretKey);
      const city = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      if (city && city.id > 0) return city;
    }
    return null;
  }
}

export default cooky;
