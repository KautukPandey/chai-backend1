import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body
    if(!content || content.trim()===""){
        throw new ApiError(400,"Tweet cannot be empty")
    }
    const tweet = await Tweet.create({
        content,
        owner: req.user?._id
    })

    return res.status(201).json(new ApiResponse(201,tweet,"Tweet generated"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.query
    const filter = {}
    if(userId){
        filter.owner = userId
    }
    else{
        throw new ApiError(400,"No user id found")
    }
    const tweets = await Tweet.find(filter)

    return res.status(200).json(new ApiResponse(200,tweets,"All tweets are fetched"))

})

// const updateTweet = asyncHandler(async (req, res) => {
//     //TODO: update tweet
//     const {content} = req.body
//     if(!content){
//         throw new ApiError(400,"No content found")
//     }
//     const tweet = await Tweet.findByIdAndUpdate(
//         req.user?._id,
//         {
//             $set: {
//                 content,
//             }
//         },
//         {new: true}
//     )

//     return res.status(200).json(new ApiResponse(200,tweet,"Updated tweet"))
    
// })

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}