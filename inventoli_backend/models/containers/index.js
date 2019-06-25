const { Model } = require('../../db')
const Items = require('../items')

class Containers extends Model {
  static get tableName() {
    return 'containers';
  }

  static get relationMappings () {
    return {
      items: {
        relation: Model.HasManyRelation,
        modelClass: Items,
        join: {
          from: 'containers.id',
          to: 'items.container_id'
        }
      },
    }
  }
}

module.exports = Containers;
