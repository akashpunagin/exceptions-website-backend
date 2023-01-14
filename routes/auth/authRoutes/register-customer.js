const pool = require("../../../db/pool");
const {
  accessTokenGenerator,
  refreshTokenGenerator,
} = require("../../../utilities/jwtGenerator");
const validateInputs = require("../../../middleware/validateInputs");
const appConstants = require("../../../constants/appConstants");
const addUser = require("./funcAddUser");

module.exports = (router) => {
  router.post("/register-customer", validateInputs, async (req, res) => {
    console.log("Route:", req.path);

    const { users, userVerificationTokens, userPermission, userRole } =
      appConstants.SQL_TABLE;

    try {
      // destructure req body
      const {
        firstName,
        lastName,
        email,
        password,
        country,
        state,
        city,
        zip,
        address,
        contact_number,
      } = req.body;

      const userDetails = {
        firstName,
        lastName,
        email,
        password,
        country,
        state,
        city,
        zip,
        address,
        contact_number,
      };

      const addUserRes = await addUser(userDetails);
      if (addUserRes.error) {
        return res.status(401).json({ error: addUserRes.errorMessage });
      }
      const newUser = addUserRes.data;

      // save role of this user
      const userRoleRes = await pool.query(
        `INSERT INTO ${userRole}(user_id, role_customer)
        VALUES ($1, true)
        RETURNING *`,
        [newUser.user_id]
      );
      const newUserRole = userRoleRes.rows[0];
      console.log("USER ROLE: ", newUserRole);

      const isAddDevicePermission = false;
      const isAddCustomerPermission = false;
      const isAddSensorPermission = false;
      const isAddTenantPermission = true;

      // save permission of this user
      const userPermissionRes = await pool.query(
        `INSERT INTO ${userPermission}(
          user_id,
          perm_add_device,
          perm_add_customer,
          perm_add_sensor,
          perm_add_tenant
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [
          newUser.user_id,
          isAddDevicePermission,
          isAddCustomerPermission,
          isAddSensorPermission,
          isAddTenantPermission,
        ]
      );
      const newUserPermission = userPermissionRes.rows[0];
      console.log("USER PERMISSION: ", newUserPermission);

      // generate jwt token
      const accessToken = accessTokenGenerator(newUser);
      const refreshToken = refreshTokenGenerator(newUser);

      // save refresh token in users database
      await pool.query(
        `UPDATE ${users}
          SET refresh_token = $1
          WHERE user_id = $2`,
        [refreshToken, newUser.user_id]
      );

      // save the token in db
      await pool.query(
        `INSERT INTO ${userVerificationTokens}(user_id, token)
          VALUES($1, $2)`,
        [newUser.user_id, accessToken]
      );

      return res.status(200).json({
        userId: newUser.user_id,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        email: newUser.email,
        country: newUser.country,
        state: newUser.state,
        city: newUser.city,
        zip: newUser.zip,
        address: newUser.address,
        contact_number: newUser.contact_number,
      });
    } catch (error) {
      console.error("Error while registering user", error);
      return res.status(500).send("Server error");
    }
  });
};
