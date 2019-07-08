const { Model } = require('../../db')
const Owners = require('../owners')

class Items extends Model {
  static get tableName() {
    return 'items';
  }

  static get relationMappings () {
    return {
      owners: {
        relation: Model.ManyToManyRelation,
        modelClass: Owners,
        join: {
          from: 'items.id',
          through: {
            from: 'owners_items.item_id',
            to: 'owners_items.owner_id'
          },
          to: 'owners.id'
        }
      },
    }
  }
}

module.exports = Items;
