import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {Video} from "../models/video.model.js"
import {Tweet} from "../models/tweet.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const likeId = req.user._id
    //TODO: toggle like on video
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video ID")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(400,"Video does not exist")
    }
    const like = await Like.findOne({"video":videoId,"likedBy":likeId})
    if(like){
        const delLike = await Like.findByIdAndDelete(like._id)
        return res.status(200).json(new ApiResponse(200,delLike,"Like removed"))
    }
    const like1 = await Like.create({
        video: videoId,
        likedBy: likeId
    })
    return res.status(200).json(new ApiResponse(200,like1,"Video Liked")) 
    
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const likeId = req.user._id
    //TODO: toggle like on comment
    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid comment ID")
    }
    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(400,"Comment does not exist")
    }
    const like = await Like.findOne({"comment":commentId,"likedBy":likeId})
    if(like){
        const delLike = await Like.findByIdAndDelete(like._id)
        return res.status(200).json(new ApiResponse(200,delLike,"Like removed"))
        
    }
    const like1 = await Like.create({
        comment: commentId,
        likedBy: likeId
    })
    return res.status(200).json(new ApiResponse(200,like1,"Comment Liked")) 
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const likeId = req.user._id
    //TODO: toggle like on tweet
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweet id")
    }
    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(400,"Tweet does not exist")
    }
    const like = await Like.findOne({"tweet":tweetId,"likedBy":likeId})
    if(like){
        const delLike = await Like.findByIdAndDelete(like._id)
        return res.status(200).json(new ApiResponse(200,delLike,"Like removed"))
    }
    const like1 = await Like.create({
        tweet: tweetId,
        likedBy: likeId
    })
    return res.status(200).json(new ApiResponse(200,like1,"Like added"))
}
)

// const getLikedVideos = asyncHandler(async (req, res) => {
//     //TODO: get all liked videos
//     const likeId = req.user._id
//     const videoList =  await Like.find({likedBy: likeId, video:{$exists: true}})
//     if(!videoList){
//         throw new ApiError(400,"No liked videos")
//     }
//     const videos = await Video.find({_id: {$in: videoList}})

//     return res.status(200).json(new ApiResponse(200,videos,"Video List"))
// })

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}