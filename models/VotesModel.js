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
        refPath: 'votes.model',
        required: true,
        index: true
    },

    name: String,
    gender: Number, // 0: 男女 1：男 2：女
    type: Number, // 0: KzName 1: ZhName
    lastName: String,
    model: String,
    voteNum: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const VotesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    },
    ///参与投票的成员
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }],
    names: [
        ChildSchema
    ],
    expires: {
        type: Date,
    },
    statis: Number, ///1：正在投票 0：过期 2：删除
}, {
    timestamps: true,
    collection: "Votes"
});

VotesSchema.statics.findOrCreate = async function (userId) {
    try {
        let user = await this.findOne({
            userId
        })
        if (user == null) {
            user = await this.create({
                userId
            })
        }
        return user
    } catch (error) {
        throw error
    }
};

VotesSchema.statics.addVote = async function (userId, names, expires = Date.now) {
    try {
        expires=Date.now
        let vote = await this.create({
            userId: userId,
            members: [],
            names: names,
            // expires: expires
        })
        return vote
    } catch (error) {
        throw error
    }
};

// VotesSchema.methods.vote = async function (nameId) {
//     try {
//         ///自己的喜欢列表id
//         let myLikes = this.likes.filter((item) => (item.type == nameType)).map((item) => item.id)
//         // console.log(myLikes);
//         let likes = await this.model('LikesModel').aggregate([{
//                 $match: {
//                     userId: new mongoose.Types.ObjectId(userId)
//                 }
//             }, {
//                 $project: {
//                     _id: 0,
//                     likes: {
//                         $filter: {
//                             input: "$likes",
//                             as: "item",
//                             cond: {
//                                 $and: [{
//                                     $eq: ["$$item.type", +nameType]
//                                 }],
//                                 // $in: ["$$item", likeList]
//                             }
//                         },
//                     }
//                 }
//             },

//         ])

//         let otherLikes = []
//         if (likes[0] != null)
//             otherLikes = likes[0].likes
//         let commonLikes = otherLikes.filter((item) => (myLikes.includes(item._id)))

//         // console.log(otherLikes);
//         return commonLikes

//     } catch (error) {
//         throw error
//     }
// };

module.exports = mongoose.model("VotesModel", VotesSchema);