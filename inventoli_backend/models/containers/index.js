const { Model } = require('../../db')

class Containers extends Model {
  static get tableName() {
    return 'containers';
  }
}

module.exports = Containers;
