
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('containers', t => {
      t.string('location').alter()
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('containers', t => {
      t.string('location').notNullable().alter()
    })
  ])
};
