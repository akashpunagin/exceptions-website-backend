const pool = require("../../db/pool");
const appConstants = require("../../constants/appConstants");

async function isUserPaid(userId) {
  const { participantPayment } = appConstants.SQL_TABLE;

  try {
    const getRes = await pool.query(
      `SELECT * FROM ${participantPayment}
        WHERE participant_id = $1`,
      [userId]
    );
    const rowCount = getRes.rowCount;

    const rowData = getRes.rows[0];

    const isPaid = rowCount > 0;
    if (!isPaid) {
      return {
        isError: false,
        errorMessage: null,
        data: { isPaid },
      };
    }

    const {
      amount,
      transaction_id: transactionId,
      screenshot_g_drive_file_id: googleDriveFileId,
      is_verified: isVerified,
    } = rowData;
    const paymentData = {
      amount,
      transactionId,
      googleDriveFileId,
      isVerified,
    };

    return {
      isError: false,
      errorMessage: null,
      data: { isPaid, paymentData },
    };
  } catch (error) {
    console.log("IS PAID ERROR: ", error);
    return {
      isError: true,
      errorMessage: "There was some error while calling is user paid",
      data: null,
    };
  }
}

module.exports = { isUserPaid };
