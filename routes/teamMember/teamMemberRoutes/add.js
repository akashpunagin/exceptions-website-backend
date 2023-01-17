const pool = require("../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const { isUserExistsByUserId } = require("../../../dbUtils/users/dbUsersUtils");
const {
  isEventExistsByEventId,
} = require("../../../dbUtils/event/dbEventUtils");

module.exports = (router) => {
  router.post("/add", [authorization, validateInputs], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { teamMemberEvent, teamMaster } = appConstants.SQL_TABLE;

    try {
      const { memberUserId, eventId } = req.body;
      const currentUser = req.user;

      const isUserExists = await isUserExistsByUserId(memberUserId);
      if (!isUserExists) {
        return res.status(401).json({ error: "User does not exists" });
      }

      const isEventExists = await isEventExistsByEventId(eventId);
      if (!isEventExists) {
        return res.status(401).json({ error: "Event does not exists" });
      }

      const teamRes = await pool.query(
        `SELECT team_id
        FROM ${teamMaster}
        WHERE
            team_id = $1 AND
            team_head_user = $2`,
        [teamId, currentUser.userId]
      );
      if (teamRes.rowCount === 0) {
        return res
          .status(401)
          .json({ error: "User does not belong to the current team" });
      }

      // TODO validate if member is in any other team
      const memberRes = await pool.query(
        `SELECT *
        FROM ${teamMemberEvent}
        WHERE
          member_user_id = $1 AND
          event_id NOT IN $2`,
        [memberUserId, eventId]
      );

      // const addRes = await pool.query(
      //   `INSERT INTO ${teamMemberEvent}(team_id, member_user_id, event_id)
      //     VALUES($1, $2, $3)
      //     RETURNING *`,
      //   [teamId, memberUserId, eventId]
      // );

      return res.status(200).json({
        status: "Team member added successfully",
        data: "addRes.rows[0]",
      });
    } catch (error) {
      console.log("ADD Team member error", error);
      return res.status(500).json("Server error");
    }
  });
};
