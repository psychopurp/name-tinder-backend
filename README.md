# 环境

- mongodb
- pm2
- nginx

## 开发

```bash
// 1.启动 mongod
mongod

// 2.启动 node 项目

npm run dev
```

## 线上部署

```bash
npm run pro
```

# 接口文档
prefix: api

1.关于名字的接口
## 获取名字
url: "/api/names"
method: GET
queryparam: 
    type : int  //0 kz  //1 zh
    gender : int  // 1 boy  2 girl
return :
{
    status : bool
    data :[]
}
## 左滑或者右滑
url: "/api/likeName"
method: POST
data: 
    nameId: str
    isLike : bool  //左滑为false 右滑为true
    lastName : str //用户选择的姓
return :
{
    status : bool
    data :[]
}

## 获取共同喜欢的名字
url: "/api/getCommonLikes"
method: POST
data: 
    userId: str  //好友的id
    nameType: int  //名字类型 0 kz 1 zh
return :
{
    status : bool
    data :[]
}

## 添加好友接口
url: "/api/addFriend"
method: POST
data: 
    userId: str  //好友的id
return :
{
    status : bool
}
<!-- router.post("/likeName", NameController.addLikeName)
router.get('/LikeName', NameController.getLikeName)
router.post("/getCommonLikes", NameController.getCommonLikes)

router.post("/group", GroupController.addGroup)
router.get('/group', GroupController.getGroups) -->
