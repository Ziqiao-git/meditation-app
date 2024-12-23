const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/users/login');
    }
    next();
};

module.exports = { requireAuth }; 