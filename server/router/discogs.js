'use strict';

const request = require('request');

const { getCallback, generatePageStr } = require('./util');
const { tokens, username, headers } = require('../config');

const apiBase = 'https://api.discogs.com';

module.exports = {
    getWantlist: (req, res) => {
        const pageStr = generatePageStr(req);
        request.get({
            url: `${apiBase}/users/${username}/wants?sort=added&sort_order=desc${pageStr}&token=${tokens.discogs}`,
            headers: headers
        }, getCallback(res));
    },

    getCollection: (req, res) => {
        const pageStr = generatePageStr(req);
        request.get({
            url: `${apiBase}/users/${username}/collection/folders/0/releases?sort=added&sort_order=desc${pageStr}&token=${tokens.discogs}`,
            headers: headers
        }, getCallback(res));
    },

    getInventory: (req, res) => {
        const pageStr = generatePageStr(req);
        request.get({
            url: `${apiBase}/users/${username}/inventory?sort=listed&sort_order=desc${pageStr}&token=${tokens.discogs}`,
            headers: headers
        }, getCallback(res));
    },

    searchReleases: (req, res) => {
        const pageStr = generatePageStr(req);
        request.get({
            url: `${apiBase}/database/search?q=${req.params.q}&type=release${pageStr}&token=${tokens.discogs}`,
            headers: headers
        }, getCallback(res));
    },

    getRelease: (req, res) => {
        const id = req.params.id;
        request.get({
            url: `${apiBase}/releases/${id}?token=${tokens.discogs}`,
            headers: headers
        }, getCallback(res));
    },

    getListing: (req, res) => {
        const id = req.params.id;
        request.get({
            url: `${apiBase}/marketplace/listings/${id}?curr_abbr=USD&token=${tokens.discogs}`,
            headers: headers
        }, getCallback(res));
    }
};