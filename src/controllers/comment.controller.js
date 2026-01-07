import mongoose from "mongoose"
import { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid object ID")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(400,"Video not found")
    }
    const filter = {}
    if(videoId){
        filter.video= videoId
    }
    const skip = (page-1)*limit

    const allComments = await Comment.find(filter).skip(skip).limit(limit)

    return res.status(200).json(new ApiResponse(200,allComments,"All comments fetched"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {content} = req.body
    if(!content || content.trim()===""){
        throw new ApiError(400,"Content cannot be empty")
    }
    const {videoId} = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid ID")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(400,"Video does not exists")
    }
    const comment = await Comment.create({
        content,
        video: video._id,
        owner: req.user._id

    })

    return res.status(201).json(new ApiResponse(201,comment,"Comment created"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {content} = req.body
    if(!content || content.trim()===""){
        throw new ApiError(400,"Content cannot be empty")
    }
    const {commentId} = req.params
    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid ID")
    }
    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(400,"Comment does not exists")
    }
    
    if(!comment.owner.equals(req.user._id)){
        throw new ApiError(400,"Not the owner")
    }
    const comment1 = await Comment.findByIdAndUpdate(commentId,
        {
            $set:{
                content,
            }
        },
        {new: true}
    )

    return res.status(200).json(new ApiResponse(200,comment1,"Comment updated"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params
    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid ID")
    }
    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(400,"Comment does not exits")
    }
    if(!comment.owner.equals(req.user._id)){
        throw new ApiError(400,"Not the comment owner")
    }
    const comment1 = await Comment.findByIdAndDelete(commentId)

    return res.status(200).json(new ApiResponse(200,comment1,"Comment Deleted"))

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}