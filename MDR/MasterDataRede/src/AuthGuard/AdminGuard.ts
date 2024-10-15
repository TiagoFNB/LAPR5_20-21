module.exports = {
	isAdmin: (req, res, next) => {
		var role = req.user['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

		if (role == 'Admin' || role == 'admin') {
			next();
		} else {
			return res.status(403).send();
		}
	}
};
