// Our NavigationItem

import typeorm from 'typeorm';

const { EntitySchema } = typeorm;

export default new EntitySchema({
  name: 'Category',
  tableName: 'categories',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    name: {
      type: 'varchar',
    },
    isDefault: {
      type: 'boolean',
      default: 0,
    },
  },
  relations: {
    task: {
      target: 'Task',
      type: 'one-to-many',
      joinColumn: true,
      inverseSide: 'user',
    },
    user: {
      target: 'User',
      type: 'many-to-one',
      joinTable: true,
      cascade: true,
    },
  },
});
