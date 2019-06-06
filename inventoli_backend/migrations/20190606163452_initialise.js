
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('houses', t => {
      t.increments('id').primary()
      t.string('name').notNullable()
    }),
    knex.schema.createTable('owners', t => {
      t.increments('id').primary()
      t.string('name').notNullable()
      t.integer('house_id').references('houses.id')
    }),
    knex.schema.createTable('items', t => {
      t.increments('id').primary()
      t.string('description').notNullable()
      t.specificType('images', 'jsonb[]')
      t.specificType('categories', 'jsonb[]')
      t.boolean('certainty').notNullable()
    }),
    knex.schema.createTable('owners_items', t => {
      t.increments('id').primary()
      t.integer('owner_id').references('owners.id')
      t.integer('item_id').references('items.id')
    }),
    knex.schema.createTable('containers', t => {
      t.increments('id').primary()
      t.string('rfid_tag').notNullable()
      t.string('location').notNullable()
    }),
  ])

};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('containers'),
    knex.schema.dropTableIfExists('owners_items'),
    knex.schema.dropTableIfExists('items'),
    knex.schema.dropTableIfExists('owners'),
    knex.schema.dropTableIfExists('houses'),
  ])
};
