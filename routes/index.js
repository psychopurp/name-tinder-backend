const router = require("koa-router")();

/**
 * 整合所有路由
 */

const home = require("./home");
const api = require("./api");

router.use("/", home.routes(), home.allowedMethods());
router.use("/api", api.routes(), api.allowedMethods());

module.exports = router;
