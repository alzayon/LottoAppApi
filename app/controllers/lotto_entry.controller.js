var moment = require('moment');

var LottoEntryController = function(LottoEntry) {

    var post = function(req, res) {
        var lottoEntry = new LottoEntry(req.body);
        var errorObj = null;
        if (!req.body.date) {
            errorObj = {
                error: true,
                message: "Date is required!"
            };
        } else if(!req.body.entry) {
            errorObj = {
                error: true,
                message: "Entry is required!",
            };
        } else if(!req.body.category) {
            errorObj = {
                error: true,
                message: "Category is required!",
            };
        }

        if (errorObj) {
            res.status(400); //Bad request
            res.send(JSON.stringify(errorObj));
        } else {
            var lottoEntry = new LottoEntry(req.body);
            lottoEntry.date = moment(lottoEntry.date).format();
            lottoEntry.save();
            res.status(200);
            res.send(lottoEntry);
        }

    }//End of post

    var get = function(req, res) {
        //https://stackoverflow.com/questions/6912584/how-to-get-get-query-string-variables-in-express-js-on-node-js
        //https://stackoverflow.com/questions/24348437/mongoose-select-a-specific-field-with-find
        var query = {};
        if (req.query.date) {
            query.date = req.query.date;
        }

        //http://snipref.com/uncategorized/mongoose-js-find-with-regex/
        //https://stackoverflow.com/questions/9824010/mongoose-js-find-user-by-username-like-value
        if (req.query.category) {
            let m = req.query.category;
            query.category = new RegExp(m, "i")
        }

        LottoEntry.find(query, function(err, entries) {
            if (err) {
                res.status(500).send(err);
            } else {
                var returnEntries = [];
                entries.forEach(function(element, index, array) {
                    var entry = prepareEntryForTransport(element, req);
                    returnEntries.push(entry)
                });
                res.json(returnEntries);
            }
        });//End of find()
    }//End of get

    var entryByIdResolver = function(req, res, next) {
        var id = req.params.lottoEntryId;
        var query = {
            _id : id
        };

        //https://stackoverflow.com/questions/12483632/mongodb-via-mongoose-js-what-is-findbyid
        LottoEntry.findOne(query, function(err, lottoEntry) {
            if (err) {
                res.status(500);
            } else if (lottoEntry) {
                req.lottoEntry = lottoEntry;
                next();
            } else {
                res.status(400).send('No entry found');
            }
        });
    }//End of entryByIdResolver()

    var getById = function(req, res) {

        //The value in req.lottoEntry is set by the resolver
        var lottoEntry = req.lottoEntry.toJSON();

        lottoEntry.links = {};
        var newLink = 'http://' + req.headers.host + '/api/lotto_entries/?date=' + lottoEntry.date;

        //https://stackoverflow.com/questions/3794919/replace-all-spaces-in-a-string-with
        lottoEntry.links.filterByDate = newLink.replace(/\s/g, '%20');
        res.json(lottoEntry);

    }

    var put = function(req, res) {
        //The value in req.lottoEntry is set by the resolver
        req.lottoEntry.date = moment(Number(req.body.date)).format();
        req.lottoEntry.category = req.body.category;
        req.lottoEntry.entry = req.body.entry;
        req.lottoEntry.save(function(err) {
            if (err) {
                res.status(500).send(err);
            }
            res.json(req.lottoEntry);
        })
    }

    var patch = function(req, res) {
        //Remove so that we do not inadvertently remove the primary key
        if (req.body._id) {
            delete req.body._id;
        }

        for(var p in req.body) {
            req.lottoEntry[p] = req.lottoEntry[p];
        }

        req.lottoEntry.save(function(err) {
            if (err) {
                res.status(500).send(err);
            }
            res.json(req.lottoEntry);
        });
    };

    var deleteEntry = function(req, res) {
        req.lottoEntry.remove(function (err) {
            if (err) {
                res.status(500).send(err);
            }
            //WARNING
            //You should always call .send()
            //even if its emtpy, or else jquery success closeCallback
            //will not be invoked
            res.status(204).send();
        })
    };

    var prepareEntryForTransport = function(element, req) {
        element.date = moment.utc(element.date);
        var entry = element.toJSON();
        entry.links = {};
        entry.links.self = "http://" + req.headers.host + '/api/lotto_entries/' + entry._id;
        return entry;
    }

    return {
        post: post,
        get: get,
        getById: getById,
        patch: patch,
        put: put,
        deleteEntry: deleteEntry,
        entryByIdResolver: entryByIdResolver
    }

}

module.exports = LottoEntryController;
