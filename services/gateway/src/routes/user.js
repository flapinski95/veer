const express = require("express");
const router = express.Router();
const createProxy = require("../utils/httpProxy");

router.use("/", ...createProxy("http://user:3003/api/user"));
module.exports = router;
