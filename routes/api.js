/* eslint-disable indent */
const router = require("koa-router")();
const NameController = require("../controller/api/name");
const GroupController = require("../controller/api/group");
const FriendController = require("../controller/api/friend");

router.get("/names", NameController.getName);

router.post("/likeName", NameController.addLikeName)
router.get('/LikeName', NameController.getLikeName)
router.post("/getCommonLikes", NameController.getCommonLikes)

router.post("/group", GroupController.addGroup)
router.get('/group', GroupController.getGroups)

router.post("/addFriend", FriendController.addFriend)
// router.put('/name/like', ctx => likeName(ctx))

// router.get('/group/create', ctx => createGroups(ctx))
// router.get('/group/join', ctx => joinGroup(ctx))

// router.get('/group/:id', ctx => getGroupDetail(ctx))
// router.delete('/group/:id', ctx => exitGroup(ctx))
// router.get('/groups', ctx => getGroups(ctx))

module.exports = router;