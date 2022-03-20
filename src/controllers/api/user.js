/**
 * The API controllers
 */

import { getConnection } from 'typeorm';

export const getUsers = async (req, res, next) => {
  try {
    // get the repository
    const userRepository = getConnection().getRepository('User');

    // get the interests and return them with status code 200
    res
      .status(200)
      .json(await userRepository.find({ relations: ['user_meta'] }));
  } catch (e) {
    next(e.message);
  }
};
