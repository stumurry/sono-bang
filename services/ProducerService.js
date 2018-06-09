const db = require('../db/models');
const Op = db.Sequelize.Op;

var ProducerService = {
  // Testing purposes only.
  Disconnect: async () =>  {
    console.log("Closing connection...");
    return await db.sequelize.close();
  },
  
  GetSongsByPlaylist : async (playlist) => {

      // fix this query by optimizing it when we have more time.
      var l = await db.playlistsongs.findAll({ where: { playlist_id: playlist.id } });
      var songIds = l.map(pls => pls.song_id);
      var songs = await db.songs.findAll({ where: { id: { [Op.in] : songIds } } });

      return songs.map(_ => _.dataValues);

  },
  


};

module.exports = ProducerService;
