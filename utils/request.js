import cooky, { isEmpty } from './index';
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
  ) {
    this.secretKey = secretKey;
    this.clientVersion = clientVersion;
    this.appId = appId;
    this.clientType = clientType;
    this.clientId = clientId;
    this.clientLanguage = clientLanguage;
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
      ...(!isEmpty(authorization) && { Authorization: authorization }),
      ...(!isEmpty(cityId) && { 'X-Cooky-City': cityId.toString() }),
      ...(sellerIds &&
        sellerIds.length > 0 && { 'X-Cooky-Seller': sellerIds[0].toString() }),
    };
  }

  static post(
    endpoint,
    params = {},
    contentType = 'application/json',
    isBlob = false,
  ) {
    if (contentType === 'application/x-www-form-urlencoded') {
      params = qs.stringify(params);
    }
    return axios
      .post(__API_ROOT__ + endpoint, params, {
        headers: Request.header(contentType),
        ...(isBlob && { responseType: 'blob' }),
        withCredentials: true,
        xsrfCookieName: 'csrftoken',
        xsrfHeaderName: 'x-csrftoken',
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        if (error.response.status === 401) {
          store.dispatch(stopAppLoading());
          store.dispatch(clearLocalStorage());
        } else if (error.response.status === 500) {
          return error.response;
        } else if (
          error.response.status === 400 &&
          error.response.data &&
          error.response.data.length
        ) {
          const errorData = error.response.data[0];
          return {
            ...error.response,
            data: {
              error_code: 400,
              detail: Object.keys(errorData)
                .map((key) => `${key}: ${errorData[key]}`)
                .join('/n'),
            },
          };
        }
        throw error;
      });
  }
}

export default Request;
