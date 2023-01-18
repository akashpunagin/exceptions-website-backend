const pool = require("../../../db/pool");
const {
  accessTokenGenerator,
  refreshTokenGenerator,
} = require("../../../utilities/jwtGenerator");
const validateInputs = require("../../../middleware/validateInputs");
const appConstants = require("../../../constants/appConstants");
const addUser = require("./funcAddUser");

module.exports = (router) => {
  router.post("/register-admin", validateInputs, async (req, res) => {
    console.log("Route:", req.path);

    const { users, userVerificationTokens, userPermission, userRole } =
      appConstants.SQL_TABLE;

    try {
      // destructure req body
      const { email, contactNumber, firstName, lastName, password } = req.body;

      const userDetails = {
        email,
        contactNumber,
        firstName,
        lastName,
        password,
      };

      const addUserRes = await addUser(userDetails);
      if (addUserRes.error) {
        return res.status(401).json({ error: addUserRes.errorMessage });
      }
      const newUser = addUserRes.data;

      // save role of this user
      const userRoleRes = await pool.query(
        `INSERT INTO ${userRole}(user_id, role_admin)
        VALUES ($1, true)
        RETURNING *`,
        [newUser.user_id]
      );
      const newUserRole = userRoleRes.rows[0];
      console.log("USER ROLE: ", newUserRole);

      const perm_add_event = true;
      const perm_edit_event = true;
      const perm_delete_event = true;
      const perm_view_participant = true;
      const perm_edit_participant = true;
      const perm_access_report = true;

      // save permission of this user
      const userPermissionRes = await pool.query(
        `INSERT INTO ${userPermission}(
          user_id,
          perm_add_event,
          perm_edit_event,
          perm_delete_event,
          perm_view_participant,
          perm_edit_participant,
          perm_access_report
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
          newUser.user_id,
          perm_add_event,
          perm_edit_event,
          perm_delete_event,
          perm_view_participant,
          perm_edit_participant,
          perm_access_report,
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

      // save the access token in db for email verification
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
        contact_number: newUser.contact_number,
      });
    } catch (error) {
      console.error("Error while registering admin", error);
      return res.status(500).send("Server error");
    }
  });
};
