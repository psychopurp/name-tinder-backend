const router = require("koa-router")();

router.get("", async ctx => {
  // ctx.response.status = 200;
  ctx.body = {
    status: true,
    data: "hello koa2 home",
    response: ctx.request
  };
});

router.get("string", async ctx => {
  ctx.body = ctx.session.id || "fsdjfkhds";
});

let count = 0;
router.get("json", async ctx => {
  ctx.session.id = count;
  count += 1;
  // ctx.cookie = ctx.session.cookie
  ctx.body = {
    title: "koa2 json"
  };
});

module.exports = router;
