const pool = require("../../../../db/pool");
const {
  accessTokenGenerator,
  refreshTokenGenerator,
} = require("../../../../utilities/jwtGenerator");
const validateInputs = require("../../../../middleware/validateInputs");
const appConstants = require("../../../../constants/appConstants");
const addUser = require("../helperFunctions/funcAddUser");
const addPartipant = require("../helperFunctions/funcAddParticipant");

module.exports = (router) => {
  router.post("/register-participant", validateInputs, async (req, res) => {
    console.log("Route:", req.path);

    const { users, userVerificationTokens, userPermission, userRole } =
      appConstants.SQL_TABLE;

    try {
      // destructure req body
      const {
        email,
        contactNumber,
        firstName,
        lastName,
        password,
        collegeName,
        usn,
        state,
        city,
        zip,
      } = req.body;

      const userDetails = {
        email,
        contactNumber,
        firstName,
        lastName,
        password,
      };

      const participantDetails = {
        collegeName,
        usn,
        state,
        city,
        zip,
      };

      const addUserRes = await addUser(userDetails);
      if (addUserRes.error) {
        return res.status(401).json({ error: addUserRes.errorMessage });
      }
      const newUser = addUserRes.data;

      //Add participant
      const addPartipantRes = await addPartipant(
        newUser.user_id,
        participantDetails
      );
      if (addPartipantRes.error) {
        return res.status(401).json({ error: addPartipantRes.errorMessage });
      }

      // save role of this user
      const userRoleRes = await pool.query(
        `INSERT INTO ${userRole}(user_id, role_participant)
        VALUES ($1, true)
        RETURNING *`,
        [newUser.user_id]
      );
      const newUserRole = userRoleRes.rows[0];
      console.log("USER ROLE: ", newUserRole);

      const perm_add_event = false;
      const perm_edit_event = false;
      const perm_delete_event = false;
      const perm_view_participant = false;
      const perm_edit_participant = false;
      const perm_access_report = false;

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
        contact_number: newUser.contact_number,
      });
    } catch (error) {
      console.error("Error while registering participant", error);
      return res.status(500).send("Server error");
    }
  });
};
