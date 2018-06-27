const db = require("../db/models");

var amazonService = require("./AmazonService");

var composerUtil = require("../utils/ComposerUtil");

var mm = require("musicmetadata");
var NodeID3 = require("node-id3")
var keys = require("../keys")

// needed for pipe() or Readable Streams.
// MusicMetaData doesn't know how to handle streams made by express-fileuploader
var ns = require("streamifier");

var emailer = require('../utils/Emailer')

const Op = db.Sequelize.Op;

module.exports = {
  // Testing purposes only.
  Disconnect: async function() {
    console.log("Closing connection...");
    return await db.sequelize.close();
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
      homepage: composer.homepage
    };

    var composer = await db.composers.create(c);
    return {
      composer: composer,
      user: user
    };
  },

  GetComposer: async (username, password) => {
    var user = await db.users.findOne({
      where: { username: username, password: password }
    });

    var composer = null;
    if (user) {
      composer = await db.composers.findOne({ where: { user_id: user.id } });
    }
    
    return {
      composer: composer,
      user: user
    };
  },

  ListPlayLists: async function(composer) {
    return await db.playlists.findAll({ where: { composer_id: composer.id } });
  },

  CreatePlayList: async function(composer, playlist) {
    playlist.composer_id = composer.id;
    return await db.playlists.create(playlist);
  },

  AddSongToPlaylist : async function(song, playlist) {
      await db.playlistsongs.create({ song_id : song.id, playlist_id : playlist.id });
  },

  AddSongToComposer: async function(composer, file) {
    // As we are uploading data to S3, read the file info and duration.

    var song = await composerUtil.GetSongInformation(file, composer);
    console.log("************************");
    console.log(composer)
    console.log("uploading song");
    console.log(song);
    console.log('************************');

    // Take song uploaded by web form and send it AWS S3
    var resp = await amazonService.UploadFile(song, file);

    // console.log("creating file");
    var songResponse = await db.songs.create(song);

    // console.log("finished");

    return songResponse;
  },

  ListSongsByComposer: async composer => {
    return await db.songs.findAll({ where: { composer_id: composer.id } });
  },

  ListSongsInPlayList: async function(playlist) {
    // fix this query by optimizing it when we have more time.
    var l = await db.playlistsongs.findAll({ where: { playlist_id: playlist.id } });
    var songIds = l.map(pls => pls.song_id);
    return await db.songs.findAll({ where: { id: { [Op.in] : songIds } } });
  },
  RemoveComposer: async function(composer) {
    var songs = await db.songs.findAll({where : { composer_id : composer.id }});
    for (var i in songs) {
      var s = songs[i];
      try {
        await amazonService.DeleteFile(s.bucket, s.key);
      } catch(ex) {
        console.log('unable to delete aws resource: ' + s.key);
        console.log(ex);
      }
    }
    var user = await db.users.findById(composer.user_id);
    // remove composer first before removing user otherwise a foreign key constraint error will occur.
    // composer table foreign keys are `cascade on delete`, so playlists and songs joined to them will also be deleted automatically.
    await composer.destroy();

    await user.destroy();
  },
  RemovePlaylist: async function(playlist) {

    console.log(playlist);

    if (!playlist.destroy) {
      playlist = await db.playlists.findById(playlist.id);
    }

    return await playlist.destroy();
  },
  RemoveSong: async song => {
    var song = await db.songs.findById(song.id);
    var resp = await amazonService.DeleteFile(song.bucket, song.key);
    return await song.destroy();
  },
  RemoveSongFromPlaylist : async function(song, playlist) {
    var pls = await db.playlistsongs.findAll({ where : { playlist_id: playlist.id, song_id: song.id }});
    pls.forEach(async pp => await pp.destroy());
  },
  UpdatePayment: async composer => {
    console.log("UpdatePayment");
    var composer = await db.composers.findById(composer.id);
    // console.log(composer);
    // composer.ispaid = true;

    // console.log("updating composer");
    composer = await composer.update({ ispaid: true });
    // console.log(composer);

    // console.log("findone");
    var user = db.users.findById(composer.user_id);
    // console.log(user);

    return composerUtil.encrypt({
      user: user["dataValues"],
      composer: composer["dataValues"]
    });
  },
  ListPlaylistReferencesBySong: async (song) => {
    return await db.playlistsongs.findAll({ where : { 'song_id' : song.id }});
  },
  ListPlaylistReferencesByPlaylist: async (playlist) => {
    return await db.playlistsongs.findAll({ where : { 'playlist_id' : playlist.id }});
  },
  GetProfile : async (composer, user) => {

    var bucket = keys.aws.BUCKET;

    console.log('bucket');
    console.log(bucket);

    var dataUsage = await amazonService.GetDataUsage(bucket, composer.id + '-');
    var songs = await db.songs.findAll({ where: { composer_id: composer.id } });

    var usage = dataUsage == 0 ? 0 : dataUsage / 1000000000;

    console.log(songs);

    return {
      songCount : songs.length,
      dataUsage : usage,
      name : user.name,
      email : user.email,
    }
  },

  SendPlaylist : async (email, playlistId, fullName, link) => {
    // console.log('Sending Playlist');
    // console.log(__dirname);
    var l = await db.playlistsongs.findAll({ where: { playlist_id: playlistId } });
    var songIds = l.map(pls => pls.song_id);
    var songsInPlaylist = await db.songs.findAll({ where: { id: { [Op.in] : songIds } } });

    // console.log('songsInPlaylist');
    // console.log(songsInPlaylist)

    var refined = songsInPlaylist.map(s => s.dataValues );

    // console.log('refined');
    // console.log(refined)


    var data = { playlists : refined, FullName :  fullName, link : link };

    // console.log('data');
    // console.log(data);

    var p = __dirname + '/../utils/temp.html';

    // console.log('p');
    // console.log(p);

    await emailer.sendEmail(email, p , data);

  },

  GetPlaylistKey : (playlist) => {
    return composerUtil.encrypt(playlist);
  }

};
