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
```
url: "/api/names"
method: GET
queryparam: 
    type : int  //0 kz  //1 zh
    gender : int  // 1 boy  2 girl
    friendId : str
    lastName : str
return :
{
    status : bool
    len: int 
    data :[
        ///样例
        {
        "name": "华荣",
        "gender": 0,
        "explanation": "繁荣。",
        "source": "典籍出处：汉 焦赣《易林·复之解》：“春桃萌生，万物华荣，邦君所居，国乐无忧。”",
        "willMatch": false
        }
    ]
}
```
## 左滑或者右滑
```
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
```
## 获取喜欢的名字
```
url: "/api/likeName"
method: GET
data: 
    
return :
{
    status : bool
    data :[
        ///样例
        {
        "nameId": "5dcd37beca1fa4c1b99dd764",
        "name": "Abake",
        "gender": 1,
        "lastName": "",
        "type": 0
        }
    ]
}
```
## 获取共同喜欢的名字
```
url: "/api/getCommonLikes"
method: POST
data: 
    userId: str  //好友的id
    nameType: int  //名字类型 0 kz 1 zh
return :
{
    status : bool
    data :[
        ///样例
        {
    "nameId": "5dcd37beca1fa4c1b99dd766",
    "name": "Abasi",
    "type": 0,
    "gender": 1,
    "lastName": "李"
        }
    ]
}
```
## 添加好友接口
```
url: "/api/addFriend"
method: POST
data: 
    userId: str  //好友的id
return :
{
    status : bool
}
```

## 获取用户信息 (通过session获取自己信息)
```
url: "/api/user"
method: GET

return :
{
    status : bool,
    data : UserModel
}
```
## 获取用户信息 (通过userId获取他人信息)
```
url: "/api/user/getUser"
method: GET
data: 
    userId: str  //好友的id
return :
{
    status : bool,
    data:
}
```
<!-- router.post("/likeName", NameController.addLikeName)
router.get('/LikeName', NameController.getLikeName)
router.post("/getCommonLikes", NameController.getCommonLikes)

router.post("/group", GroupController.addGroup)
router.get('/group', GroupController.getGroups) -->
