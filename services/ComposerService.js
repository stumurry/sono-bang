const db = require("../db/models");

var AmazonService = require("./AmazonService");

var composerUtil = require("../utils/ComposerUtil")

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
      homepage : composer.homepage,
    };

    var composer =  await db.composers.create(c);
    return {
      composer : composer,
      user : user,
    }

  },

  GetComposer: async (username, password) => {

    var user = await db.users.findOne({ where: { username: username, password : password} });

    var composer = await db.composers.findOne( { where  : { user_id : user.id }});

    return {
      composer : composer,
      user : user,
    }
  },

  ListPlayLists: async function(composer) {
    return await db.playlists.findAll({ where: { composer_id: composer.id } });
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
  AddSongToComposer: async function(salt, composer, song, stream) {
    // Document S3 location along with meta data provided by Composer.
    song.composer_id = composer.id;
    song.key =
       composer.id + "-" + salt + "-" + song.fileName;

    console.log("uploading file");
    // Take song uploaded by web form and send it AWS S3
    var resp = await AmazonService.UploadFileByStream(song, stream);

    console.log("creating file");
    var songResponse = await db.songs.create(song);

    console.log("finished");

    return songResponse;
  },

  ListSongsByComposer: async (composer) => {
    return await db.songs.findAll({ where: { composer_id: composer.id } });
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
  RemoveSong: async (song) => {
    return await song.destroy();
  },
  UpdatePayment : async (composer) => {
    console.log('UpdatePayment');
    var composer = await db.composers.findById( composer.id );
    console.log(composer);
    composer.ispaid = true;

    console.log('updating composer');
    composer =  await composer.update( { ispaid : true } );
    console.log(composer);

    console.log('findone');
    var user = db.users.findById( composer.user_id );
    console.log(user);

    return composerUtil.encrypt( { user : user['dataValues'], composer: composer['dataValues'] });

  }
};
