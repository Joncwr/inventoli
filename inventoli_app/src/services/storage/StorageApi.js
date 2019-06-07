import jwtFetch from '../middleware/JwtFetch'
import LoadFetch from '../common/LoadFetch'

module.exports = {
  createContainer: (storageDict) => {
    var params = storageDict
    return LoadFetch.loadFetch('post', 'storage/createContainer', params)
  },
  test: () => {
    return LoadFetch.loadFetch('get', 'storage/test')
  },
}
