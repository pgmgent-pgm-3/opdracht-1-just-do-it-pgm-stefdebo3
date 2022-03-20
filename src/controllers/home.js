import { getConnection } from 'typeorm';

export const home = async (req, res) => {
  const userRepository = getConnection().getRepository('User');
  const reqUser = await userRepository.findOne({
    where: { id: req.user?.userId },
  });
  const userData = await userRepository.findOne({
    where: { id: req.user?.userId },
    relations: ['user_meta'],
  });
  const categoryRepository = getConnection().getRepository('Category');
  const categories = await categoryRepository.find({
    relations: ['user'],
    where: { user: reqUser },
  });
  const taskRepository = getConnection().getRepository('Task');
  const tasks = await taskRepository.find({
    relations: ['category', 'user'],
    where: { user: reqUser },
  });
  const toDo = tasks.filter((e) => e.status === 'to-do');
  const done = tasks.filter((e) => e.status === 'done');
  const data = {
    categories,
    toDo,
    done,
    userData,
  };
  res.render('home', { data });
};
