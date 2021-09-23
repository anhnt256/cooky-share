import axios from 'axios';
import qs from 'qs';
import cooky from './cooky';
import utils from './index';

const city = cooky.getCityFromCookie();
const authorization = cooky.getCookie('CookyCredential');
const user = cooky.getCookie('CookyUser');

class Request {
  constructor(
    appId = '1001',
    clientType = 'web',
    clientVersion = '5.4.2',
    clientId = '0101',
    clientLanguage = 'vi',
    secretKey = '9d6c826b-4cfc-4613-aee4-4ffe823ce69a',
    rootAPI = '',
  ) {
    this.secretKey = secretKey;
    this.clientVersion = clientVersion;
    this.appId = appId;
    this.clientType = clientType;
    this.clientId = clientId;
    this.clientLanguage = clientLanguage;
    this.rootAPI = rootAPI;
  }

  static header() {
    const { id: cityId, sellerIds } = city || {};
    return {
      'X-Cooky-App-Id': this.appId,
      'X-Cooky-Client-Type': this.clientType,
      'X-Cooky-Client-Version': this.clientVersion,
      'X-Cooky-Client-Id': this.clientId,
      'X-Cooky-Client-Language': this.clientLanguage,
      'X-Cooky-Timestamp': new Date().getTime(),
      'Content-Type': 'application/json',
      ...(!utils.isEmpty(authorization) && { Authorization: authorization }),
      ...(!utils.isEmpty(cityId) && { 'X-Cooky-City': cityId.toString() }),
      ...(sellerIds &&
        sellerIds.length > 0 && { 'X-Cooky-Seller': sellerIds[0].toString() }),
    };
  }

  post = (endpoint, params = {}) => {
    params = qs.stringify(params);
    return axios
      .post(this.rootAPI + endpoint, params, {
        headers: Request.header(),
        withCredentials: true,
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  get = (endpoint, params = {}) => {
    const checksum = cooky.generateChecksumByParams(params);
    params = qs.stringify(params);
    params = { ...params, checksum };
    return axios
      .get(this.rootAPI + endpoint, params, {
        headers: Request.header(),
        withCredentials: true,
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

module.exports = Request;
