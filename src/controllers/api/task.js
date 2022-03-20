/* eslint-disable radix */
import { getConnection } from 'typeorm';

export const postTask = async (req, res, next) => {
  try {
    // validate incoming body
    if (!req.body.name) throw new Error('Please provide a name for a task.');
    const taskRepository = getConnection().getRepository('Task');
    const categoryRepository = getConnection().getRepository('Category');
    const userRepository = getConnection().getRepository('User');
    // validate if the user exists

    const reqUser = await userRepository.findOne({
      where: { id: req.body.userId },
    });

    // check if interest exists
    const task = await taskRepository.findOne({
      where: {
        name: req.body.name,
        user: reqUser,
      },
    });

    const reqCategory = await categoryRepository.findOne({
      where: { name: req.body.category },
    });

    if (task) {
      res.status(200).json({ status: `Posted task with id ${task.id}` });
      return;
    }
    await taskRepository.save({
      name: req.body.name,
      status: 'to-do',
      category: {
        id: reqCategory.id,
      },
      user: {
        id: reqUser.id,
      },
    });
    res.redirect('/');
  } catch (error) {
    next(error.message);
  }
};
export const getTasks = async (req, res, next) => {
  try {
    const taskRepository = getConnection().getRepository('Task');
    res.status(200).json(await taskRepository.find());
  } catch (error) {
    next(error.message);
  }
};
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error('Please specify id to remove');

    const taskRepository = getConnection().getRepository('Task');

    const task = await taskRepository.findOne({ id });

    if (!task) throw new Error(`Task with id: ${id} was not found`);

    await taskRepository.remove({ id });

    res.status(200).json({ status: `Deleted task with id: ${id}` });
  } catch (error) {
    next(error.message);
  }
};
export const updateTask = async (req, res, next) => {
  try {
    // validate incoming ID
    if (!req.body.id)
      throw new Error('Please provide an id for the task you want to update.');
    const validProperties = ['id', 'name', 'status', 'categoryId'];
    const unwantedProperties = Object.getOwnPropertyNames(req.body).filter(
      (prop) => !validProperties.includes(prop)
    );
    if (unwantedProperties.length !== 0)
      throw new Error(
        `You requested unwanted properties: ${unwantedProperties.join(', ')}`
      );
    const taskRepository = getConnection().getRepository('Task');

    const task = await taskRepository.findOne({
      relations: ['category'],
      where: { id: req.body.id },
    });

    if (req.body.name) {
      const duplicateTask = await taskRepository.findOne({
        relations: ['category'],
        where: {
          name: req.body.name,
          category: task.category,
        },
      });
      if (duplicateTask) {
        throw new Error(
          `task with the name ${duplicateTask.name} already exists`
        );
      }
    }

    req.body.id = parseInt(req.body.id);

    if (req.body.categoryId) {
      const categoryRepository = getConnection().getRepository('Category');
      const correctCategory = await categoryRepository.findOne({
        where: { name: req.body.categoryId },
      });
      if (correctCategory) {
        req.body.category = correctCategory;
        delete req.body.categoryId;
      } else {
        res.status(200).json({ status: `${req.body.category} does not exist` });
      }
    }

    if (!task) throw new Error('The given task does not exist.');
    await taskRepository.save({
      ...task,
      ...req.body,
    });

    res.status(200).json({
      status: `Posted task with id ${req.body.id} and name: ${req.body.name}`,
    });
  } catch (error) {
    next(error.message);
  }
};
