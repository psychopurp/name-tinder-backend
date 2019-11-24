/*
  用户好友组
*/

const mongoose = require("mongoose");
const ZhNameModel = require('./zh_name_model')
const KzNameModel = require('./kz_name_model')
const LikesModel = require('./LikesModel')

const MODAL_MAP = {
    0: {
        name: "KzNameModel",
        model: KzNameModel
    },
    1: {
        name: "ZhNameModel",
        model: ZhNameModel
    }
};

const Schema = mongoose.Schema

const ChildSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        refPath: 'commonLikes.model',
        required: true,
        index: true
    },
    name: String,
    gender: Number,  // 0: 男女 1：男 2：女
    type: Number,  // 0: KzName 1: ZhName
    lastName: String,
    model: String,
    createdAt: { type: Date, default: Date.now },
})

const FriendSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Users"
        },
        members: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
        // commonLikes: [
        //     ChildSchema
        // ],
    },
    {
        timestamps: true,
        collection: "Friends"
    }
);

FriendSchema.statics.findOrCreate = async function (creatorId) {
    try {
        let user = await this.findById(creatorId)
        if (user == null) {
            user = await this.create({ creatorId })
        }
        return user
    } catch (error) {
        console.log(error);
        return null
    }
};

///添加好友
FriendSchema.methods.addFriend = async function (userId) {
    try {
        this.members.addToSet(userId);
        let friend = await this.model('FriendModel').findOrCreate(userId)
        if (friend != null) {
            friend.members.addToSet(this._id)
            friend.save()
            return { status: true, msg: 'ok' }
        } else {
            return { status: false, msg: 'add fail to friend' }
        }
    } catch (error) {
        console.log(error);
        return { status: false, msg: error.toString() }
    }
};

FriendSchema.methods.getCommonLikes = async function (nameType, gender) {
    try {
        let nameSet = new Set();
        this.members.forEach(async (item) => {
            console.log(item);
            let likes = await LikesModel.find({ userId: item, 'likes.type': nameType, 'likes.gender': gender })
            // let nameList = await likes.likes.fin
            console.log(likes);
            // nameSet.add(...nameList)
        })

        return { status: true, msg: 'ok' }
    } catch (error) {
        console.log(error);
        return { status: false, msg: error.toString() }
    }
};

const model = mongoose.model("FriendModel", FriendSchema);
module.exports = model
