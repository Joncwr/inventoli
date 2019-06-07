import jwtFetch from '../middleware/JwtFetch'

function loadFetch (method, endpoint, json) {
  return new Promise((resolve, reject) => {
    if (loader) loader('show')
    jwtFetch(method, endpoint, json)
      .then (data => {
        if (loader) loader('hide')
        resolve(data)
      })
      .catch (err => {
        //if error is timeout open modal
        if (loader) loader('hide')
        reject(err)
      })
  })
}

module.exports = {
  setLoader: (loaderParam) => {
    loader = loaderParam
  },
  loadFetch: loadFetch,
}
