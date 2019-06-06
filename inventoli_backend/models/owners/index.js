const { Model } = require('../../db')

class Owners extends Model {
  static get tableName() {
    return 'owners';
  }
}

module.exports = Owners;
