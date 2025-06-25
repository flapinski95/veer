const express = require("express");
const router = express.Router();
const createProxy = require("../utils/httpProxy");

router.use("/", ...createProxy("http://auth:3002/api/auth"));
module.exports = router;
