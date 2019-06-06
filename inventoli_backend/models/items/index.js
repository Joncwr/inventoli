const { Model } = require('../../db')

class Items extends Model {
  static get tableName() {
    return 'items';
  }
}

module.exports = Items;
