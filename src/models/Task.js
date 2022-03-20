// Our NavigationItem

import typeorm from 'typeorm';

const { EntitySchema } = typeorm;

export default new EntitySchema({
  name: 'Task',
  tableName: 'tasks',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    name: {
      type: 'varchar',
    },
    status: {
      type: 'varchar',
    },
  },
  relations: {
    category: {
      target: 'Category',
      type: 'many-to-one',
      joinTable: true,
      cascade: true,
    },
    user: {
      target: 'User',
      type: 'many-to-one',
      joinTable: true,
      cascade: true,
    },
  },
});
