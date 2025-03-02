const router = require('koa-router')()
const {
  getNames,
  likeName,
} = require('../controller/other/name')

const {
  createGroups,
  exitGroup,
  joinGroup,
  getGroupDetail,
  getGroups,
} = require('../controller/other/groups')

router.prefix('/api')

router.get('/names', ctx => getNames(ctx))
router.put('/name/like', ctx => likeName(ctx))


router.get('/group/create', ctx => createGroups(ctx))
router.get('/group/join', ctx => joinGroup(ctx))

router.get('/group/:id', ctx => getGroupDetail(ctx))
router.delete('/group/:id', ctx => exitGroup(ctx))
router.get('/groups', ctx => getGroups(ctx))

module.exports = router
