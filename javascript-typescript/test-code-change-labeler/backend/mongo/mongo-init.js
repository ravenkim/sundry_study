db.createUser({
  user: 'admin',
  pwd: 'testtest1',
  roles: [
    {
      role: 'readWrite',
      db: 'labeler',
    },
  ],
});
