import typeorm from 'typeorm';

const { EntitySchema } = typeorm;

export default new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    email: {
      type: 'varchar',
    },
    password: {
      type: 'varchar',
    },
  },
  relations: {
    user_meta: {
      target: 'UserMeta',
      type: 'one-to-one',
      cascade: true,
      joinColumn: true,
    },
    task: {
      target: 'Task',
      type: 'one-to-many',
      joinColumn: true,
      inverseSide: 'user',
    },
    category: {
      target: 'Category',
      type: 'one-to-many',
      joinColumn: true,
      inverseSide: 'user',
    },
  },
});
