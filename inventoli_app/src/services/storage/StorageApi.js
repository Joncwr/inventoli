import jwtFetch from '../middleware/JwtFetch'
import LoadFetch from '../common/LoadFetch'

module.exports = {
  createContainer: (storageDict) => {
    var params = storageDict
    return LoadFetch.loadFetch('post', 'storage/createContainer', params)
  },
  getContainer: (rfid_tag) => {
    return LoadFetch.loadFetch('get', 'storage/getContainer/' + rfid_tag)
  },
  test: () => {
    return LoadFetch.loadFetch('get', 'storage/test')
  },
}
