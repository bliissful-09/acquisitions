export const cookies = {
  getOptions: () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 1 day
  }),
  set: (res, name, value, options = {}) => {
    const cookieOptions = cookies.getOptions();
    res.cookie(name, value, { ...cookieOptions, ...options });
  },
  clear: (res, name, options = {}) => {
    const cookieOptions = cookies.getOptions();
    res.clearCookie(name, { ...cookieOptions, ...options });
  },

  get: (req, name) => {
    return req.cookies[name];
  },
};
