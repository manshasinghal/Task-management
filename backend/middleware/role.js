const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles]; // convert string to array
  }

  // return another function
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // if user role is there in the list of allowed roles
  // The req.user object is created and attached to the request by the protect middleware, which runs before the authorize middleware



    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: You do not have the required role' });
    }
    next();
  };
};

module.exports = authorize;