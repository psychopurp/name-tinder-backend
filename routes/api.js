/* eslint-disable indent */
const router = require("koa-router")();
const NameController = require("../controller/api/name");
const GroupController = require("../controller/api/group");
const FriendController = require("../controller/api/friend");

///获取名字  type,gender,lastName,friendId
router.get("/names", NameController.getName);

///喜欢名字 和获取喜欢的名字  
router.post("/likeName", NameController.addLikeName)
router.get('/LikeName', NameController.getLikeName)
///获取共同喜欢的名字  
router.post("/getCommonLikes", NameController.getCommonLikes)

// router.post("/group", GroupController.addGroup)
// router.get('/group', GroupController.getGroups)

///添加好友 
router.post("/addFriend", FriendController.addFriend)
// router.put('/name/like', ctx => likeName(ctx))

// router.get('/group/create', ctx => createGroups(ctx))
// router.get('/group/join', ctx => joinGroup(ctx))

// router.get('/group/:id', ctx => getGroupDetail(ctx))
// router.delete('/group/:id', ctx => exitGroup(ctx))
// router.get('/groups', ctx => getGroups(ctx))

module.exports = router;