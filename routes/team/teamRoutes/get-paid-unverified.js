const pool = require("../../../db/pool");
const { authorization } = require("../../../middleware/exportMiddlewares");
const appConstants = require("../../../constants/appConstants");
const { getUserByUserId } = require("../../../dbUtils/users/dbUsersUtils");

module.exports = (router) => {
  router.get("/get-paid-unverified", [authorization], async (req, res) => {
    console.log("Route:", req.originalUrl);

    const { teamMaster, teamNames, participantPayment } =
      appConstants.SQL_TABLE;

    try {
      const teamRes = await pool.query(`
        SELECT *
        FROM ${teamMaster}, ${teamNames}, ${participantPayment}
        WHERE 
          ${teamMaster}.team_name_id = ${teamNames}.id AND
          ${teamMaster}.team_head_user = ${participantPayment}.participant_id AND
          ${participantPayment}.is_verified = false
      `);
      let data = teamRes.rows;

      const asyncTeamRes = await Promise.all(
        data.map(async (row) => {
          const headUserId = row.team_head_user;
          const teamNameId = row.id;
          const teamName = row.label;

          const headUser = await getUserByUserId(headUserId);

          const transactionDetails = {
            amount: row.amount,
            transactionId: row.transaction_id,
            googleDriveFileId: row.screenshot_g_drive_file_id,
            fileMimeType: row.screenshot_mime_type,
            isVerified: row.is_verified,
          };

          return {
            teamId: row.team_id,
            teamName: {
              label: teamName,
              id: teamNameId,
            },
            headUser,
            isGCConsidered: row.team_is_gc_considered,
            score: row.team_score,
            transactionDetails,
          };
        })
      );

      return res.status(200).json(asyncTeamRes);
    } catch (error) {
      console.log("GET Team error", error);
      return res.status(500).json("Server error");
    }
  });
};

[
  {
    amount: 10000,
    transaction_id: "1232k3j123j1h3122",
    screenshot_g_drive_file_id: "1n5J3NHbHh0Clud5RZB1up5RknOrF77sp",
    screenshot_mime_type: "image/png",
    is_verified: false,
  },
];
