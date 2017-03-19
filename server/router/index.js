'use strict';

const request = require('request');

const config = require('../config');
const youtube = require('./youtube');
const discogs = require('./discogs');

var Router = function(app) {
    this.start = function() {
        app.route('/').get((req,res) => {
            res.render('index.html');
        });

        app.route('/api/user').get(discogs.getUser);

        app.route('/api/wantlist/:page?').get(discogs.getWantlist);

        app.route('/api/wantlistids').get(discogs.getWantlistIds);

        app.route('/api/wantlist/:id').put(discogs.putWantlist);

        app.route('/api/wantlist/:id').delete(discogs.deleteWantlist);

        app.route('/api/collection/:page?').get(discogs.getCollection);

        app.route('/api/inventory/:page?').get(discogs.getInventory);

        app.route('/api/search/releases/:q/:page?').get(discogs.searchReleases);

        app.route('/api/releases/:id').get(discogs.getRelease);

        app.route('/api/listing/:id').get(discogs.getListing);

        app.route('/api/videos').post(youtube.getVideos);
    };
};

module.exports = Router;