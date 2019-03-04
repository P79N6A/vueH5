import axios from 'axios';
const ajax = (method, path, data, callBack) => {
  const apiUrl = 'http://192.168.5.9:8080';
  if (method === 'post') {
    axios.post(apiUrl + path, data).then(response => {
      callBack(response.data);
    }).catch(function (error) {
      callBack(error);
    });
  } else {
    axios.get(apiUrl + path, {
      params: data
    }).then(response => {
      callBack(response.data);
    }).catch(function (error) {
      callBack(error);
    });
  }
};
export {ajax};
