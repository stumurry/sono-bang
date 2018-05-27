const db = require("../db/models");

module.exports = {
  // Testing purposes only.
  Disconnect: function() {
    console.log("Closing connection...");
    db.sequelize.close();
  },

  // Complete Unit Tests Here:

  CreateComposer: async (composer)  => {
    return await db.composers.create(composer);
  },
  CreatePlayList: async function(composer, playlist) {
    playlist.composer_id = composer.id;
    return await db.playlists.create(playlist);
  },
  AddSongToPlayList: async function(playlist, song) {
    song.playlist_id = playlist.id;
    return await db.songs.create(song);
  },
  ListSongsInPlayList: async function(playlist) {
    return await db.songs.findAll({ where: { playlist_id: playlist.id } });
  },
  RemoveComposer: async function(composer) {
    await composer.destroy();
  },
  RemovePlaylist: async function(playlist) {
    return await playlist.destroy();
  },
  RemoveSong: async function(song) {
    return await song.destroy();
  }
};
