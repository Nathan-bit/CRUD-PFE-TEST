const isAdmin = (req, res, next) => {
    if (req.role === 'ADMIN') {
      next();
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }
  };
  
  const isUser = (req, res, next) => {
    if (req.role === 'USER' || req.role === 'ADMIN') {
      next();
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }
  };
  
  module.exports = { isAdmin, isUser };