import { body } from 'express-validator';

export default [
  body('email')
    .notEmpty()
    .withMessage('Email is niet juist')
    .bail()
    .isEmail()
    .withMessage('Email is niet juist'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Wachtwoord moet minstens 6 karakters lang zijn'),
];
