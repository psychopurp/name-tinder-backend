const router = require("koa-router")();
const NameController = require("../controller/api/name");

router.get("/names", NameController.getName);
// router.put('/name/like', ctx => likeName(ctx))

// router.get('/group/create', ctx => createGroups(ctx))
// router.get('/group/join', ctx => joinGroup(ctx))

// router.get('/group/:id', ctx => getGroupDetail(ctx))
// router.delete('/group/:id', ctx => exitGroup(ctx))
// router.get('/groups', ctx => getGroups(ctx))

module.exports = router;
