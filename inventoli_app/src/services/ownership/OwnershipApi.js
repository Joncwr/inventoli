import jwtFetch from '../middleware/JwtFetch'
import LoadFetch from '../common/LoadFetch'

module.exports = {
  getOwners: (house_id) => {
    return LoadFetch.loadFetch('get', 'ownership/getOwners/' + house_id)
  },
}
