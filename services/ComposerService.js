const db = require("../db/models");

var AmazonService = require("./AmazonService");

module.exports = {
  // Testing purposes only.
  Disconnect: function() {
    console.log("Closing connection...");
    return db.sequelize.close();
  },

  // Complete Unit Tests Here:

  CreateComposer: async composer => {

    var user = await db.users.create({
      name: composer.name,
      username: composer.username,
      password: composer.password,
      email: composer.email
    });

    var c = {
      name: composer.name,
      description: composer.description,
      user_id: user.id,
    };

    var composer =  await db.composers.create(c);
    return {
      composer : composer,
      user : user,
    }

  },
  CreatePlayList: async function(composer, playlist) {
    playlist.composer_id = composer.id;
    return await db.playlists.create(playlist);
  },
  // ** Example Filename(Key) **
  // <PLAYLIST_ID>-<COMPOSER_ID>-<SALT>-<FILENAME>.<EXT>
  AddSongToPlayList: async function(salt, composer, playlist, song, file_uri) {
    // Document S3 location along with meta data provided by Composer.
    song.playlist_id = playlist.id;
    song.key =
      playlist.id + "-" + composer.id + "-" + salt + "-" + song.fileName;

    console.log("uploading file");
    // Take song uploaded by web form and send it AWS S3
    var resp = await AmazonService.UploadFile(song, file_uri);

    console.log("creating file");
    var songResponse = await db.songs.create(song);

    console.log("finished");

    return songResponse;
  },
  ListSongsInPlayList: async function(playlist) {
    return await db.songs.findAll({ where: { playlist_id: playlist.id } });
  },
  RemoveComposer: async function(composer) {
    var user = db.users.findById( composer.user_id );
    await composer.destroy(); // remove composer first before removing user otherwise a foreign key constraint error will occur.
    await user.destroy();
  },
  RemovePlaylist: async function(playlist) {
    return await playlist.destroy();
  },
  RemoveSong: async function(song) {
    return await song.destroy();
  }
};
