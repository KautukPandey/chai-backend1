import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


// const toggleSubscription = asyncHandler(async (req, res) => {
//     const {channelId} = req.params
//     // TODO: toggle subscription
//     if(!isValidObjectId(channelId)){
//         throw new ApiError(400,"Invalid ID")
//     }
//     const channel = await User.findById(channelId)
//     if(!channel){
//         throw new ApiError(400,"Channel does not exists")
//     }
//     const sub = await Subscription.findById(req.user._id)
//     if(!sub){
//         const subss = await Subscription.create({
//             subscriber: req.user._id,
//             channel: channelId
//         })

//         res.status(200).json(new ApiResponse(200,subss,"Subscribed"))
//     }else{
//         const sub1 = await Subscription.findByIdAndDelete(req.user._id)

//         return res.status(200).json(new ApiResponse(200,sub1,"Unsubscribed"))
//     }
// })

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid channel ID")
    }
    const channel = await User.findById(channelId)
    if(!channel){
        throw new ApiError(400,"Channel does not exists")
    }
    const filter = {}
    filter.channel = channelId
    const subs = await Subscription.find(filter)
    
    return res.status(200).json(new ApiResponse(200,subs,"List of subs"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400,"Invalid sub ID")
    }
    const sub = await User.findById(subscriberId)
    if(!sub){
        throw new ApiError(400,"Sub does not exists")
    }
    const filter = {}
    filter.subscriber = subscriberId
    const channelList = await Subscription.find(filter)

    return res.status(200).json(new ApiResponse(200,channelList,"List of channels"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}