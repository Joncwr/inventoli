const { Model } = require('../../db')

class Owners_Items extends Model {
  static get tableName() {
    return 'owners_items';
  }
}

module.exports = Owners_Items;
