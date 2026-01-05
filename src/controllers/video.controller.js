import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const filter = {}
    filter.isPublished = true
    if(userId){
        filter.owner = userId
    }
    if(query){
        filter.$or = [
            {title: {$regex: query, $options: "i"}},
            {description: {$regex: query, $options: "i"}}
        ]
    }
    const sort = {}
    if(sortBy){
        sort[sortBy] = sortType === "asc"?1:-1
    }
    else{
        sort.createdAt = -1
    }
    const skip = (page-1)*limit
    const videos = await Video.find(filter).sort(sort).skip(skip).limit(limit)

    return res.status(200).json(new ApiResponse(200,videos,"Filtered result"))
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if(title===""){
        throw new ApiError(400,"Title is required")
    }
    if(description===""){
        throw new ApiError(400,"Description is required")
    }

    const thumbnailLocalPath = req.files?.thumbnail[0]?.path
    if(!thumbnailLocalPath){
        throw new ApiError(400,"Thumbnail missing")
    }
    const videoLocalPath = req.files?.videoFile[0]?.path
    if(!videoLocalPath){
        throw new ApiError(400,"Video is missing")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    const videoFile = await uploadOnCloudinary(videoLocalPath)

    if(!thumbnail){
        throw new ApiError(400,"Thumbnail is necessary")
    }
    if(!videoFile){
        throw new ApiError(400,"VideoFile is necessary")
    }

    const video = await Video.create({
        title,
        description,
        thumbnail: thumbnail.url,
        videoFile: videoFile.url,
        owner: req.user._id,
        duration: videoFile?.duration
    })


    return res.status(201).json(new ApiResponse(201,video,"VIdeo uploaded"))

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(400,"Video does not exist")
    }
    if(video.isPublished===false){
        throw new ApiError(400,"Video restricted")

    }
    return res.status(200).json(new ApiResponse(200,video,"Video fetched"))

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"Video not found")
    }
    if(!video.owner.equals(req.user._id)){
        throw new ApiError(404,"Not the owner")
    }
    const updatedVideo = {};
    if(req.body.title){
        updatedVideo.title = req.body.title
    }
    if(req.body.description){
        updatedVideo.description = req.body.description
    }

    const thumbnailLocalPath = req.files?.thumbnail[0]?.path
    if(thumbnailLocalPath){
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
        updatedVideo.thumbnail = thumbnail.url
    }

    const video1 = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: updatedVideo
        },{
            new: true,
        }
    )

    return res.status(200).json(new ApiResponse(200,video1,"Updated video"))


})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(400,"Video not found")
    }
    if(!video.owner.equals(req.user._id)){
        throw new ApiError(404,"Not the owner")
    }
    const video1 = await Video.findByIdAndDelete({_id:videoId})
    return res.status(200).json(new ApiResponse(200,video1,"Deleted Successfully"))

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(400,"No video found")
    }
    if(!video.owner.equals(req.user._id)){
        throw new ApiError(404,"Not the owner")
    }
    const isPublished = video.isPublished
    const video1 = await Video.findByIdAndUpdate(videoId,
        {
            $set: {
                isPublished: !isPublished
            }
        },
        {new: true}
    )
    return res.status(200).json(new ApiResponse(200,video1,"Published/Unpublished"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}