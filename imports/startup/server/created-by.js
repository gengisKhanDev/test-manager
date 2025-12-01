const { Users } = require("../../api/users/users.js");

module.exports.getUser = async function (userId) {
	if (!userId) return null;

	const user = await Users.findOneAsync({ _id: userId });

	if (!user) return null;

	return {
		id: user._id,
		name: `${user.profile?.firstName || ""} ${user.profile?.lastName || ""}`.trim(),
		email: user.emails?.[0]?.address || "",
	};
};
