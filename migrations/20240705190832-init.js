const bcrypt = require('bcrypt');
module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    const supperAdmin = await db.collection('roles').insertOne({
      name: 'Supper Admin',
      permissions: [
        'create:user',
        'read:users',
        'read:user',
        'update:user',
        'delete:user',
        'create:role',
        'read:roles',
        'read:role',
        'update:role',
        'delete:role',
        'create:assistant',
        'read:assistants',
        'read:assistant',
        'update:assistant',
        'delete:assistant',
        'read:call-logs',
        'read:call-log',
        'update:call-log',
        'delete:call-log',
      ],
    });
    await db.collection('roles').insertOne({
      name: 'Admin',
      permissions: [
        'create:user',
        'read:users',
        'read:user',
        'update:user',
        'delete:user',
        'create:role',
        'read:roles',
        'read:role',
        'update:role',
        'delete:role',
        'create:assistant',
        'read:assistants',
        'read:assistant',
        'update:assistant',
        'delete:assistant',
        'read:call-logs',
        'read:call-log',
        'update:call-log',
        'delete:call-log',
      ],
    });
    await db.collection('users').insertOne({
      username: 'admin',
      password: await bcrypt.hash('admin', 10),
      email: 'admin@admin.com',
      emailVerified: true,
      roles: [supperAdmin.insertedId],
    });
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
