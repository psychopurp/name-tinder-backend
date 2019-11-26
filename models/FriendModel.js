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
    gender: Number, // 0: 男女 1：男 2：女
    type: Number, // 0: KzName 1: ZhName
    lastName: String,
    model: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const FriendSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }],
    // commonLikes: [
    //     ChildSchema
    // ],
}, {
    timestamps: true,
    collection: "Friends"
});

FriendSchema.statics.findOrCreate = async function (creatorId) {
    try {
        let user = await this.findById(
            creatorId
        )
        if (user == null) {
            user = await this.create({
                _id: creatorId
            })
        }
        return user
    } catch (error) {
        throw error
    }
};

///添加好友
FriendSchema.methods.addFriend = async function (userId) {
    try {
        ///添加到自己列表
        if (this._id != userId) {
            this.members.addToSet(userId);
            this.save()
            ///添加到对方列表
            let friend = await this.model('FriendModel').findOrCreate(userId)
            friend.members.addToSet(this._id)
            friend.save()
            return true
        }
    } catch (error) {
        throw error
    }
};



module.exports = mongoose.model("FriendModel", FriendSchema);