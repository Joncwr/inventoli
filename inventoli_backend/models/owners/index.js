const { Model } = require('../../db')

class Owners extends Model {
  static get tableName() {
    return 'owners';
  }

  static get relationMappings () {
    return {
      items: {
        relation: Model.ManyToManyRelation,
        modelClass: require('../items'),
        join: {
          from: 'owners.id',
          through: {
            // persons_movies is the join table.
            from: 'owners_items.owner_id',
            to: 'owners_items.item_id'
          },
          to: 'items.id'
        }
      }
    }
  }
}

module.exports = Owners;
