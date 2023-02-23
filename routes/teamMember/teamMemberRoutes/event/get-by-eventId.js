const pool = require("../../../../db/pool");
const {
  authorization,
  validateInputs,
} = require("../../../../middleware/exportMiddlewares");
const appConstants = require("../../../../constants/appConstants");
const {
  getTeamIdOfUser,
  isTeamExistsByTeamId,
} = require("../../../../dbUtils/team_master/dbTeamMasterUtils");
const {
  isEventExistsByEventId,
} = require("../../../../dbUtils/event/dbEventUtils");

module.exports = (router) => {
  router.post(
    "/get-by-eventId",
    [authorization, validateInputs],
    async (req, res) => {
      console.log("Route:", req.originalUrl);

      const { teamIdTeamMemberEvent, teamIdTeamMember, teamMemberMaster } =
        appConstants.SQL_TABLE;

      try {
        const { eventId, teamId } = req.body;

        const isEventExists = await isEventExistsByEventId(eventId);
        if (!isEventExists) {
          return res.status(401).json({ error: "Event does not exists" });
        }

        const isTeamExistsByTeamIdRes = await isTeamExistsByTeamId(teamId);
        if (isTeamExistsByTeamIdRes.isError) {
          return res
            .status(401)
            .json({ error: isTeamExistsByTeamIdRes.errorMessage });
        }
        const isTeamExists = isTeamExistsByTeamIdRes.data;
        if (!isTeamExists) {
          return res.status(401).json({ error: "Team does not exists" });
        }

        const getTeamIdTeamMemberRes = await pool.query(
          `SELECT * FROM ${teamIdTeamMember}
          WHERE
          team_id_team_member_id in (
            SELECT team_id_team_member_id FROM ${teamIdTeamMemberEvent}
            WHERE
            event_id = $1 AND
            team_id = $2
          )`,
          [eventId, teamId]
        );

        const teamIdTeamMemberData = getTeamIdTeamMemberRes.rows;

        let data = [];

        for (const {
          team_id: teamId,
          member_id: memberId,
        } of teamIdTeamMemberData) {
          const getTeamMemberRes = await pool.query(
            `SELECT * FROM ${teamMemberMaster}
            WHERE member_id = $1`,
            [memberId]
          );
          const teamMemberData = { ...getTeamMemberRes.rows[0], teamId };
          data.push(teamMemberData);
        }

        data = data.map((row) => {
          return {
            teamId: row.teamId,
            memberId: row.member_id,
            firstName: row.first_name,
            lastName: row.last_name,
            usn: row.usn,
            email: row.email,
            contactNumber: row.contact_number,
          };
        });

        return res.status(200).json(data);
      } catch (error) {
        console.log("GET Team member by event id error", error);
        return res.status(500).json("Server error");
      }
    }
  );
};
