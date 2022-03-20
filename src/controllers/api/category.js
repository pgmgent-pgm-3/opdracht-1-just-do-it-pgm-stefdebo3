/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import { getConnection } from 'typeorm';

export const postCategory = async (req, res, next) => {
  try {
    // validate incoming body
    if (!req.body.name)
      throw new Error('Please provide a name for a category.');
    const categoryRepository = getConnection().getRepository('Category');
    const userRepository = getConnection().getRepository('User');
    // validate if the user exists

    const reqUser = await userRepository.findOne({
      where: { id: req.body.userId },
    });

    // check if interest exists
    const category = await categoryRepository.findOne({
      where: {
        name: req.body.name,
        user: reqUser,
      },
    });

    if (category) {
      res
        .status(200)
        .json({ status: `Posted category with id ${category.id}` });
      return;
    }

    if (req.body.name.indexOf(' ') >= 0) {
      res.status(200).json({ status: `Define category in 1 word please` });
    }

    await categoryRepository.save({
      ...req.body,
      user: {
        id: reqUser.id,
      },
    });

    res.redirect('/');
  } catch (error) {
    next(error.message);
  }
};
export const getCategory = async (req, res, next) => {
  try {
    const categoryRepository = getConnection().getRepository('Category');
    res.status(200).json(await categoryRepository.find());
  } catch (error) {
    next(error.message);
  }
};
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error('Please specify id to remove');

    const taskRepository = getConnection().getRepository('Task');

    const categoryRepository = getConnection().getRepository('Category');

    const category = await categoryRepository.findOne({ id });
    const defaultCategory = await categoryRepository.findOne({
      where: { isDefault: true },
    });

    if (!category) throw new Error(`category with id: ${id} was not found`);
    // console.log(
    //   await taskRepository.find({
    //     relations: ['category'],
    //     where: { category },
    //   })
    // );
    const underlyingTasks = await taskRepository.find({
      relations: ['category'],
      where: { category },
    });

    const defaultCat = await categoryRepository.find({
      where: {
        isDefault: 1,
      },
    });

    // update all found tasks to default category
    underlyingTasks.forEach(async (task) => {
      task.category = defaultCategory;
      await taskRepository.save(task);
    });

    await categoryRepository.remove({ id });

    res.redirect('/');
  } catch (error) {
    next(error.message);
  }
};
