function payloadGenerator(user) {
  return {
    userId: user.user_id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    contactNumber: user.contact_number,
    createdAt: user.created_at,
  };
}

module.exports = payloadGenerator;
