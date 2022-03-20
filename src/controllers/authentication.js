/**
 * A Register Controller
 */

import { validationResult } from 'express-validator';
import { getConnection } from 'typeorm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  // check for token
  if (req.cookies.token) {
    res.redirect('/');
    return;
  }
  // errors

  const formErrors = req.formErrors ? req.formErrors : [];

  // input fields
  const inputs = [
    {
      name: 'firstName',
      label: 'First name',
      type: 'text',
      value: req.body?.firstName ? req.body.firstName : '',
      error: req.formErrorsFields?.firstName
        ? req.formErrorsFields.firstName
        : '',
    },
    {
      name: 'lastName',
      label: 'Last name',
      type: 'text',
      value: req.body?.lastName ? req.body.lastName : '',
      error: req.formErrorsFields?.lastName
        ? req.formErrorsFields.lastName
        : '',
    },
    {
      name: 'email',
      label: 'E-mail',
      type: 'text',
      value: req.body?.email ? req.body.email : '',
      error: req.formErrorsFields?.email ? req.formErrorsFields.email : '',
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      value: req.body?.password ? req.body.password : '',
      error: req.formErrorsFields?.password
        ? req.formErrorsFields.password
        : '',
    },
  ];

  // render the register page
  res.render('register', {
    layout: 'authentication',
    inputs,
    formErrors,
  });
};

export const login = async (req, res) => {
  if (req.cookies.token) {
    res.redirect('/');
    return;
  }

  // errors
  const formErrors = req.formErrors ? req.formErrors : [];

  // input fields
  const inputs = [
    {
      name: 'email',
      label: 'E-mail',
      type: 'text',
      value: req.body?.email ? req.body.email : '',
      error: req.formErrorsFields?.email ? req.formErrorsFields.email : '',
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      value: req.body?.password ? req.body.password : '',
      error: req.formErrorsFields?.password
        ? req.formErrorsFields.password
        : '',
    },
  ];

  // render the login page
  res.render('login', {
    layout: 'authentication',
    inputs,
    formErrors,
  });
};

export const postRegister = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.formErrorsFields = {};

      errors.array().forEach(({ msg, param }) => {
        req.formErrorsFields[param] = msg;
      });
      return next();
    }

    const userRepository = getConnection().getRepository('User');
    // validate if the user exists
    const user = await userRepository.findOne({
      where: { email: req.body.email },
    });

    if (user) {
      req.formErrors = [{ message: 'User already exists.' }];
      return next();
    }
    // hash the password
    const hashedPassword = bcrypt.hashSync(req.body.password, 12);

    // create a new user
    const savedUser = await userRepository.save({
      email: req.body.email,
      password: hashedPassword,
      user_meta: {
        firstname: req.body.firstName,
        lastname: req.body.lastName,
      },
    });

    const categoryRepository = getConnection().getRepository('Category');

    await categoryRepository.save({
      name: 'Default',
      isDefault: true,
      user: {
        id: savedUser.id,
      },
    });

    return res.redirect('/login');
  } catch (e) {
    return res(200).json('Something went wrong trying to post register');
  }
};

export const postLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.formErrorsFields = {};

      errors.array().forEach(({ msg, param }) => {
        req.formErrorsFields[param] = msg;
      });
      return next();
    }

    const userRepository = getConnection().getRepository('User');
    // validate if the user exists
    const user = await userRepository.findOne({
      where: { email: req.body.email },
    });

    if (!user) {
      req.formErrors = [{ message: 'User does not exist.' }];
      return next();
    }
    // check if password is equal to database
    const isEqual = bcrypt.compareSync(req.body.password, user.password);

    if (!isEqual) {
      req.formErrors = [{ message: 'Password is wrong.' }];
      return next();
    }
    // create a webtoken

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.TOKEN_SALT,
      { expiresIn: '1h' }
    );
    // add the cookie in response
    res.cookie('token', token, { httpOnly: true });

    return res.redirect('/');
  } catch (e) {
    return res(200).json('Something went wrong trying to post login');
  }
};
export const logout = (req, res, next) => {
  try {
    res.clearCookie('token');
    res.redirect('/login');
  } catch (error) {
    next(error.message);
  }
};
