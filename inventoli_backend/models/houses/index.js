const { Model } = require('../../db')

class Houses extends Model {
  static get tableName() {
    return 'houses';
  }
}

module.exports = Houses;
