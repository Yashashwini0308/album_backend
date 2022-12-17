module.exports = app => {
    const artists = require('../controllers/artist.controller.js');
    var router = require("express").Router();

    router.post("/artist",artists.saveArtist)
    router.post("/artist/user",artists.saveArtistForUser)
    router.get("/artist/all",artists.getAllArtists)
    router.get("/artist/user/all",artists.getAllArtistForUser)
    router.get("/artist/:id",artists.getArtistById)
    router.delete("/artist/all",artists.deleteAllArtist)
    router.delete("/artist/:id",artists.deleteArtistById)
    router.put("/artist",artists.updateArtist)

    app.use('/api/v1', router);
}