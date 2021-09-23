import CryptoJS from 'crypto-js';

class cooky {

  constructor(
    secretKey = '9d6c826b-4cfc-4613-aee4-4ffe823ce69a',
  ) {
    this.secretKey = secretKey;
  }

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
      const bytes = CryptoJS.AES.decrypt(strEncrypted, this.secretKey);
      const city = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      if (city && city.id > 0) return city;
    }
    return null;
  }

  static generateChecksumByParams(params) {
    if (!params) {
      return '';
    }

    let str = '';

    for (let index = 0, length = params.length; index < length; index++) {
      str = str + params[index].toString();
    }

    str = str + this.secretKey;

    if (str && str.length > 0) {
      return md5(str);
    }

    return '';
  }
}

module.exports = cooky;
