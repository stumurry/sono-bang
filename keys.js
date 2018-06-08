require("dotenv").config();

exports.twitter = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
};

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.mysql = {
  CLEARDB_DATABASE_URL : process.env.CLEARDB_DATABASE_URL
}

exports.environment = {
  NODE_ENV : process.env.NODE_ENV
}


exports.encryption = {
  algorithm : process.env.CRYPTO_ALGORITHM,
  password : process.env.CRYPTO_PASSWORD,
}

// Bucket is case sensistive
exports.aws = {
  BUCKET : process.env.AWS_BUCKET,
  ACCESS_KEY : process.env.access_token_key,
  SECRET_ACCESS_KEY : process.env.access_token_secret,
}
