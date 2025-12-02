import { Users } from "../../api/users/users.js";

async function getUser(userId) {
	if (!userId) return null;

	const user = await Users.findOneAsync({ _id: userId });
	if (!user) return null;

	return {
		id: user._id,
		email: user.emails?.[0]?.address,
		firstName: user.profile?.firstName,
		lastName: user.profile?.lastName,
		name: `${user.profile?.firstName || ""} ${user.profile?.lastName || ""}`.trim(),
	};
}

module.exports = { getUser };
