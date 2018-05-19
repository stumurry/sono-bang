const db = require('../db/models')

module.exports = {

    // Testing purposes only.
    Disconnect: function() {
      console.log("Closing connection...");
      db.sequelize.close();
    },

    // Complete Unit Tests Here:

    CreateComposer : async function(composer) {

        return await composer.save();
      
    },
    CreatePlayList : async function(composer, playlist) {

      playlist.composer_id = composer.id;

      return await db.playlists
        .build(playlist)
        .save()

    },
    AddSongToPlayList : async function(playlist, song) {

      song.playlist_id = playlist.id;

      return await db.songs
        .build(song)
        .save();
    },
    ListSongsInPlayList: async function(playlist) {
      return await db.songs.findAll({ where: { playlist_id: playlist.id } });
    },
    RemoveSongFromPlayList: async function(song) {
      return await song.destroy();
    },
    RemoveComposer: async function(composer) {
      return await composer.destroy();
    },
    RemovePlaylist: async function(playlist) {
      return await playlist.destroy();
    },

  };
