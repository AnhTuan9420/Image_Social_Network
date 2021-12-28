const isAdmin = (req, res, next) => {
  if (req.session && req.session.isAdmin === true && req.session.userId) {
    return next();
  } else {
    const msg =
      "You must be logged in with admin permission to view this page.";
    return res.redirect(`/account/login?msg=${msg}`);
  }
};

const isUser = (req, res, next) => {
  if (req.session && req.session.isUser === true && req.session.userId) {
    return next();
  } else {
    const msg =
      "You must be logged in with User permission to view this page.";
    return res.redirect(`/account/login?msg=${msg}`);
  }
};

module.exports = { isAdmin, isUser };