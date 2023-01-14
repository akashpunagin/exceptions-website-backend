const missingCredsMessage = "Missing Credentials";
const invalidCredsMessage = "Invalid Credentials";
const invalidEmailMessage = "Invalid Email";

function isValidEmail(userEmail) {
  const isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
    userEmail
  );
  return isValidEmail;
}

function handleAuthReq(req) {
  const { userId, email, contactNumber, firstName, lastName, password } =
    req.body;

  if (req.path === "/register-admin") {
    if (![email, firstName, lastName, contactNumber, password].every(Boolean)) {
      return missingCredsMessage;
    }

    if (!isValidEmail(email)) {
      return invalidEmailMessage;
    }
  }

  if (req.path === "/register-customer") {
    if (
      ![
        email,
        firstName,
        lastName,
        country,
        state,
        city,
        zip,
        address,
        contact_number,
        password,
      ].every(Boolean)
    ) {
      return missingCredsMessage;
    }
    if (!isValidEmail(email)) {
      return invalidEmailMessage;
    }
  }

  if (req.path === "/register-tenant") {
    if (
      ![
        email,
        firstName,
        lastName,
        country,
        state,
        city,
        zip,
        address,
        contact_number,
        password,
      ].every(Boolean)
    ) {
      return missingCredsMessage;
    }
    if (!isValidEmail(email)) {
      return invalidEmailMessage;
    }
  }

  if (req.path === "/delete-user") {
    if (![userId].every(Boolean)) {
      return missingCredsMessage;
    }
  }

  if (req.path === "/login") {
    if (![email, password].every(Boolean)) {
      return missingCredsMessage;
    }
    if (!isValidEmail(email)) {
      return invalidEmailMessage;
    }
  }

  if (req.path === "/send-confirmation-email") {
    if (![userId].every(Boolean)) {
      return missingCredsMessage;
    }
  }
}

function handleDeviceReq(req) {
  const {
    device_id,
    user_id,
    client_topic,
    variant,
    hw_ver,
    fw_ver,
    o_logo,
    o_prod_name,
    o_prod_ver,
    u_dev_name,
    u_comp_name,
    u_tz_diff,
    u_lat,
    u_long,
    u_conn_ssid,
  } = req.body;

  if (req.path === "/add") {
    if (
      ![
        device_id,
        user_id,
        client_topic,
        variant,
        hw_ver,
        fw_ver,
        o_logo,
        o_prod_name,
        o_prod_ver,
        u_dev_name,
        u_comp_name,
        u_tz_diff,
        u_lat,
        u_long,
      ].every(Boolean)
    ) {
      return missingCredsMessage;
    }
  }
}

function handleSensorValueError(req) {
  const { deviceId, parameter } = req.body;

  if (req.path === "/get-all-data") {
    if (![deviceId].every(Boolean)) {
      return missingCredsMessage;
    }
  }
  if (req.path === "/get-data") {
    if (![deviceId, parameter].every(Boolean)) {
      return missingCredsMessage;
    }
  }
}

function handleTenetReq(req) {
  const { customerId } = req.body;

  if (req.path === "/get") {
    if (![customerId].every(Boolean)) {
      return missingCredsMessage;
    }
  }
}

function handleCustomerReq(req) {
  const { tenantId, deviceId } = req.body;

  if (req.path === "/add") {
    if (![tenantId, deviceId].every(Boolean)) {
      return missingCredsMessage;
    }
  }
  if (req.path === "/delete") {
    if (![tenantId, deviceId].every(Boolean)) {
      return missingCredsMessage;
    }
  }
}

function handleSensorMasterReq(req) {
  const {
    device_id,
    sensor_idx,
    sensor_name,
    sensor_uom,
    sensor_report_group,
  } = req.body;

  if (req.path === "/add") {
    if (
      ![
        device_id,
        sensor_idx,
        sensor_name,
        sensor_uom,
        sensor_report_group,
      ].every(Boolean)
    ) {
      return missingCredsMessage;
    }
  }

  if (req.path === "/get-sensors-of-device") {
    if (![device_id].every(Boolean)) {
      return missingCredsMessage;
    }
  }

  if (req.path === "/delete") {
    if (
      ![
        device_id,
        sensor_idx,
        sensor_name,
        sensor_uom,
        sensor_report_group,
      ].every(Boolean)
    ) {
      return missingCredsMessage;
    }
  }
}

module.exports = (req, res, next) => {
  const authError = handleAuthReq(req);
  const deviceError = handleDeviceReq(req);
  const sensorValueError = handleSensorValueError(req);
  const tenantError = handleTenetReq(req);
  const customerError = handleCustomerReq(req);
  const sensorMasterError = handleSensorMasterReq(req);

  console.log({
    authError,
    deviceError,
    sensorValueError,
    tenantError,
    customerError,
    sensorMasterError,
  });

  if (authError) {
    return res.status(401).json({ error: authError });
  }
  if (req.originalUrl.includes("/device/") && deviceError) {
    return res.status(401).json({ error: deviceError });
  }
  if (req.originalUrl.includes("/sensor/") && sensorValueError) {
    return res.status(401).json({ error: sensorValueError });
  }
  if (req.originalUrl.includes("/tenant/") && tenantError) {
    return res.status(401).json({ error: tenantError });
  }
  if (req.originalUrl.includes("/customer/") && customerError) {
    return res.status(401).json({ error: customerError });
  }
  if (req.originalUrl.includes("/sensorMaster/") && sensorMasterError) {
    return res.status(401).json({ error: sensorMasterError });
  }

  next();
};
