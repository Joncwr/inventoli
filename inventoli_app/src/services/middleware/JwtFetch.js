import axios from 'axios'
import Config from 'react-native-config'
import { AsyncStorage } from 'react-native'

let jwtFetch = (method, endpoint, json) => {
  console.log(process.env.REACT_APP_API);
  console.log('http://192.168.2.230:3001/api/' + endpoint, method);
  return new Promise((resolve, reject) => {
    axios({
      url: 'http://192.168.2.230:3001/api/' + endpoint,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(json),
      timeout: 15000
    })
    .then(res => {
      if (res.status >= 200 && res.status < 300){
        resolve(res.data)
      }
      else {
        reject()
      }
    })
    .catch (err => reject(err))
  })
}

// let jwtFetch = (method, endpoint, json) => {
//   return new Promise((resolve, reject) => {
//     let token = ''
//     AsyncStorage.getItem('JWT', (err, token) => {
//       axios({
//         url: Config.API_ENDPOINT + endpoint,
//         method: method,
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'JWT ' + token
//         },
//         data: JSON.stringify(json),
//         timeout: 15000
//       })
//         .then(res => {
//           if (res.status >= 200 && res.status < 300){
//             resolve(res.data)
//           }
//           else {
//             reject()
//           }
//         })
//         .catch (err => reject(err))
//     })
//   })
// }

module.exports = jwtFetch
