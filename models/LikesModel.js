/*
  用户喜欢和不喜欢名单
*/

const mongoose = require("mongoose");
const ZhNameModel = require('./zh_name_model')
const KzNameModel = require('./kz_name_model')
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
        refPath: 'likes.model',
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

const LikesSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            unique: true,
            index: true,
            ref: "Users"
        },
        likes: [
            ChildSchema
        ],
        disLikes: [
            ChildSchema
        ]
    },
    {
        timestamps: true,
        collection: "Likes"
    }
);

LikesSchema.statics.findOrCreate = async function (userId) {
    try {
        let user = await this.findOne({ userId })
        if (user == null) {
            user = await this.create({ userId })
        }
        return { likes: user, msg: 'ok' };
    } catch (error) {
        console.log(error);
        return { likes: null, msg: error.toString() };
    }
};

LikesSchema.methods.addLike = async function (nameId, isLike, lastName = '') {
    try {
        let kzName = await KzNameModel.findById(nameId);
        let ZhName = await ZhNameModel.findById(nameId);
        let model = (kzName == null) ? ZhName : kzName
        let type = (kzName == null) ? 1 : 0
        let data = {
            type: type,
            name: model.name,
            gender: model.gender,
            model: MODAL_MAP[type].name,
            _id: model._id,
            lastName: lastName
        }
        if (isLike) {
            this.likes.addToSet(data);
        } else {
            this.disLikes.addToSet(data)
        }
        // console.log(this.likes);
        this.save()
        return { status: true, msg: 'ok' }
    } catch (error) {
        console.log(error);
        return { status: false, msg: error.toString() }
    }
};

LikesSchema.methods.getCommonLikes = async function (userId, nameType, gender) {
    try {
        let userList = [userId]
        console.log(userList);
        console.log(gender);
        userList.forEach(async (item) => {
            let likes = await this.model('LikesModel').findOrCreate({ userId: item, 'likes.type': nameType, 'likes.gender': gender })
            console.log(likes);
        })



        return { status: true, msg: 'ok' }
    } catch (error) {
        console.log(error);
        return { status: false, msg: error.toString() }
    }
};

const model = mongoose.model("LikesModel", LikesSchema);
module.exports = model
