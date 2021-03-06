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
  getContainerById: (id) => {
    return LoadFetch.loadFetch('get', 'storage/getContainerById/' + id)
  },
  updateLocation: (locationDict) => {
    return LoadFetch.loadFetch('put', 'storage/updateLocation', locationDict)
  },
  updateContainer: (updateContainerDict) => {
    return LoadFetch.loadFetch('put', 'storage/updateContainer', updateContainerDict)
  },
  getAllItems: (houseId) => {
    return LoadFetch.loadFetch('get', 'storage/getAllItems/' + houseId)
  },
  test: () => {
    return LoadFetch.loadFetch('get', 'storage/test')
  },
}
