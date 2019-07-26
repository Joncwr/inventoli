const { Model } = require('../../db')
let Owners = require('../owners')

class Houses extends Model {
  static get tableName() {
    return 'houses';
  }

  static get relationMappings () {
    return {
      owners: {
        relation: Model.HasManyRelation,
        modelClass: Owners,
        join: {
          from: 'houses.id',
          to: 'owners.house_id'
        }
      }
    }
  }
}

module.exports = Houses;
