function payloadGenerator(user) {
  return {
    userId: user.user_id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    country: user.country,
    state: user.state,
    city: user.city,
    zip: user.zip,
    address: user.address,
    contactNumber: user.contact_number,
  };
}

module.exports = payloadGenerator;
