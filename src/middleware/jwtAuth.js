// the JWT authentication middleware

import jwt from 'jsonwebtoken';

export const jwtAuth = (req, res, next) => {
  try {
    const { token } = req.cookies;

    const user = jwt.verify(token, process.env.TOKEN_SALT);
    req.user = user;
    next();
  } catch (e) {
    res.clearCookie('token');
    return res.redirect('/login');
  }
};
