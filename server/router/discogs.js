'use strict';

const request = require('request');

const { getCallback, discogsPageStr, handleMultiple } = require('./util');
const { tokens, username, headers } = require('../config');

const apiBase = 'https://api.discogs.com';

module.exports = {
    getUser: (req, res) => {
        getRequest(`${apiBase}/users/${username}`, res);
    },

    getWantlistIds: (req, res) => {
        const wantCount = 1780; // req.query.want_count;
        const pages = Math.ceil(wantCount / 100);
        const urls = [];

        for (let i = 0; i < pages; i++) {
            let page = i + 1;
            urls.push(`${apiBase}/users/${username}/wants?sort=added&sort_order=desc&page=${page}&per_page=100`);
        }

        handleMultiple(urls, response => {
            // grab the date from the latest added wantlist item
            const lastUpdated = Date.now();
            // transform the response to an array of ids
            const ids = response
                .map(d => d.wants)
                .reduce((a, b) => a.concat(b))
                .map(w => w.id);

            res.send({ lastUpdated, count: ids.length, ids });
        });
    },

    getWantlist: (req, res) => {
        const pageStr = discogsPageStr(req);
        getRequest(`${apiBase}/users/${username}/wants?sort=added&sort_order=desc${pageStr}&token=${tokens.discogs}`, res);
    },

    getCollection: (req, res) => {
        const pageStr = discogsPageStr(req);
        getRequest(`${apiBase}/users/${username}/collection/folders/0/releases?sort=added&sort_order=desc${pageStr}&token=${tokens.discogs}`, res);
    },

    getInventory: (req, res) => {
        const pageStr = discogsPageStr(req);
        getRequest(`${apiBase}/users/${username}/inventory?status=${encodeURIComponent('For Sale')}&sort=listed&sort_order=desc${pageStr}&token=${tokens.discogs}`, res);
    },

    searchReleases: (req, res) => {
        const pageStr = discogsPageStr(req);
        getRequest(`${apiBase}/database/search?q=${req.params.q}&type=release${pageStr}&token=${tokens.discogs}`, res);
    },

    getRelease: (req, res) => {
        const id = req.params.id;
        getRequest(`${apiBase}/releases/${id}?token=${tokens.discogs}`, res);
    },

    getListing: (req, res) => {
        const id = req.params.id;
        getRequest(`${apiBase}/marketplace/listings/${id}?curr_abbr=USD&token=${tokens.discogs}`, res);
    },

    putWantlist: (req, res) => {
        const id = req.params.id;
        request.put(`${apiBase}/users/${username}/wants/${id}?token=${tokens.discogs}`, {headers: headers}, 
            (error, response, body) => {
                if (error) {
                    res.status(500).send(error);
                    return;
                }

                const statusCode = response.statusCode;
                if (statusCode !== 201) {
                    res.status(statusCode).send(response);
                    return;
                }

                res.status(201).send(body);
            });
    }
};

function getRequest(url, res) {
    request.get({ url: url, headers: headers }, getCallback(res));
}