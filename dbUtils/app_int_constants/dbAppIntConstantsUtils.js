const pool = require("../../db/pool");
const appConstants = require("../../constants/appConstants");

const { appIntConstants } = appConstants.SQL_TABLE;

async function getAllGroupEventsFees() {
  const label = "event_fees_all_group_events";

  const intConstantsRes = await pool.query(
    `SELECT * FROM ${appIntConstants}
    WHERE label = $1`,
    [label]
  );
  const data = intConstantsRes.rows[0];
  const fees = data.value;
  return fees;
}

async function getInfinityAndBeyondEventFees() {
  const label = "event_fees_infinity_and_beyond";

  const intConstantsRes = await pool.query(
    `SELECT * FROM ${appIntConstants}
    WHERE label = $1`,
    [label]
  );
  const data = intConstantsRes.rows[0];
  const fees = data.value;
  return fees;
}

async function getSolvathonEventFees() {
  const label = "event_fees_solvathon";

  const intConstantsRes = await pool.query(
    `SELECT * FROM ${appIntConstants}
    WHERE label = $1`,
    [label]
  );
  const data = intConstantsRes.rows[0];
  const fees = data.value;
  return fees;
}

async function getStrikeForceFees() {
  const label = "event_fees_strike_force";

  const intConstantsRes = await pool.query(
    `SELECT * FROM ${appIntConstants}
    WHERE label = $1`,
    [label]
  );
  const data = intConstantsRes.rows[0];
  const fees = data.value;
  return fees;
}

async function getMaxGCMember() {
  const label = "max_gc_member_size";

  const intConstantsRes = await pool.query(
    `SELECT * FROM ${appIntConstants}
    WHERE label = $1`,
    [label]
  );
  const data = intConstantsRes.rows[0];
  const maxMember = data.value;
  return maxMember;
}

module.exports = {
  getAllGroupEventsFees,
  getInfinityAndBeyondEventFees,
  getSolvathonEventFees,
  getStrikeForceFees,
  getMaxGCMember,
};
