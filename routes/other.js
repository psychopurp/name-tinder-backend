const router = require('koa-router')()
const {
  getNames,
} = require('../controller/other/name')

const {
  createGroups,
  exitGroup,
  joinGroup,
  getGroupDetail,
} = require('../controller/other/groups')

router.prefix('/api')

router.get('/names', ctx => getNames(ctx))

router.get('/group/create', ctx => createGroups(ctx))
router.get('/group/exit', ctx => exitGroup(ctx))
router.get('/group/join', ctx => joinGroup(ctx))
router.get('/group', ctx => getGroupDetail(ctx))

module.exports = router
