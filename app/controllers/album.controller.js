const { response } = require('express');
const db = require('../models');
const trackModel = require('../models/track.model');
const Sequelize = require("sequelize");

const Album = db.album;
const Op = db.Sequelize.Op;
const User = db.users;
const Artist = db.artist
const Track = db.track

//Methods to perform crud operations
exports.saveAlbum = async (req, res) => {
    console.log("Save Album is called")
    const userId = req.body.userId;
    const album = req.body.album;
    const user = await User.findOne({ where: { id: userId } })
    if (user) {
        console.log(user)
        user.createAlbum(album).then(response => {
            res.status(200).json(response)
        }, error => {
            res.status(400).json({ "message": "Some Error occured" })
            console.log(error)
        })
    }
}

exports.getAllAlbums = async (req, res) => {
    const userId = req.query.userId;
    const albums = await Album.findAll(
        {
            include: [
                {
                    model: Artist, as: "artist"
                }
            ],
            where: { userId: userId }
        }
    )
    res.status(200).json(albums);
}

exports.getAlbumById = async (req, res) => {
    console.log("get Album by Id is called")
    // console.log(req)
    const userId = req.query.userId;
    const albumId = req.params.id;
    console.log(albumId);
    const albums = await Album.findByPk(albumId, {
        include: [{
            model: Track,
            as: "tracks",
        }],
        where: { userId: userId }
    })
    res.status(200).json(albums)
}

exports.addTrackToAlbum = async (req, res) => {
    console.log("AddTrackToAlbum is called")
    const albumId = req.body.albumId;
    const trackId = req.body.trackId;
    console.log("AlbumId: ", albumId, "TrackId: ", trackId);
    const album = await Album.findByPk(albumId)
    if (!album) {
        console.log("Album Not Found")
        res.status(404).json({ "message": "Album Not Found" })
    }

    const track = await Track.findByPk(trackId);
    if (!track) {
        console.log("Track Not Found");
        res.status(404).json({ "message": "Track Not Found" })
    }
    await album.addTrack(track);
    res.status(200).json(album);
}

exports.deleteAlbumById = async (req, res) => {
    console.log("deleteAlbumById is called")
    const albumId = req.params.id
    const status = await Album.destroy({ where: { id: albumId } });
    if (status) {
        res.status(200).json({ "message": "Delete Success" })
    } else {
        res.status(400).json({ "message": "Delete Failed" })
    }
}

exports.deleteAllAlbum = (req, res) => {
    console.log("Delete All Albums is called")
}

exports.searchAlbums = async (req, res) => {
    const userId = req.query.userId;
    const searchKey = req.query.key;
    console.log(userId)
    console.log(searchKey)

    const albums = await Album.findAll({
        include: [{
            model: Track, as: "tracks",
        },
        {
            model: Artist, as: "artist",
        }
        ],
        where: {
            [Op.or]: [
                Sequelize.where(Sequelize.col('tracks.name'), 'like', '%' + searchKey + '%'),
                Sequelize.where(Sequelize.col('album.name'), 'like', '%' + searchKey + '%'),
                Sequelize.where(Sequelize.col('artist.name'), 'like', '%' + searchKey + '%')
            ],
            userId: userId
        }
    })

    res.status(200).json(albums)
}

exports.updateAlbum = async (req, res) => {
    console.log("update Album is called")
    const userId = req.body.userId;
    const album = req.body.album;
    Album.update({ name: album.name, description: album.description, artistId: album.artistId }, { where: { userId: userId, id: album.id } }).then(response => {
        console.log(response)
        res.status(200).json({ "message": "Update Success" })
    }, error => {
        console.log(error)
    })
}

exports.favourite = async (req,res)=>{
    const userId = req.body.userId;
    const album = req.body.album;
    Album.update({ isFavourite:!album.isFavourite }, { where: { userId: userId, id: album.id } }).then(response => {
        res.status(200).json({ "message": "Update Success" })
    }, error => {
        console.log(error)
        res.status(400).json({"error":"Update Failed"})
    })
}


exports.saleAlbum = async (req,res)=>{
    const userId = req.body.userId;
    const album = req.body.album;
    console.log(album)
    Album.update({ isForSale: album.isForSale }, { where: { userId: userId, id: album.id } }).then(response => {
        console.log(response)
        res.status(200).json({ "message": "Update Success" })
    }, error => {
        console.log(error)
        res.status(400).json({"error":"Update Failed"})
    })
}

exports.getAllSaleAlbums = async (req,res)=>{
    const userId = req.params.id;
    console.log(userId)
    const albums = await Album.findAll({where:{userId:{
        [Op.ne]:userId
    },isForSale:true}})
    res.status(200).json(albums) 
}


exports.getAllFavourites = async (req,res)=>{
    const userId = req.params.id;
    console.log(userId)
    const albums = await Album.findAll({where:{userId:userId,isFavourite:true}})
    res.status(200).json(albums)
}


exports.purchaseAlbum = async (req,res) =>{
    const userId = req.body.userId
    const album = req.body.album
    console.log(album)
    Album.update({userId:userId,isForSale:false,isFavourite:false},{where:{id:album.id}}).then(response=>{
        console.log(response)
        res.status(200).json({"message":"Purchase Successful"})
    },error=>{
        console.log(error);
        res.status(400).json({"error":"Something went wrong"})
    })
}
