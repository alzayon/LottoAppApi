var LottoEntryController = function(LottoEntry) {

    var post = function(req, res) {
        var lottoEntry = new LottoEntry(req.body);
        var errorObj = null;
        console.log(req.body);
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
            res.status(200);
            lottoEntry.save();
            res.send(lottoEntry);
        }

    }//End of post

    var get = function(req, res) {
        var query = {};
        if (req.query.date) {
            query.date = req.query.date;
        }
        LottoEntry.find(query, function(err, entries) {
            if (err) {
                res.status(500).send(err);
            } else {
                var returnEntries = [];
                entries.forEach(function(element, index, array) {
                    var entry = element.toJSON();
                    entry.links = {};
                    entry.links.self = "http://" + req.headers.host + '/api/lotto_entries' + entry._id;
                    returnEntries.push(entry)
                });
                res.json(returnEntries);
            }
        });//End of find()
    }//End of get

    var entryByIdResolver = function(req, res, next) {
        var id = req.params.id;
        LottoEntry.find(query, function(err, lottoEntry) {
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
        lottoEntry.links.filterByDate = newLink.replace(' ', '%20');
        res.json(lottoEntry);
    }

    var put = function(req, res) {
        //The value in req.lottoEntry is set by the resolver
        req.lottoEntry.date = req.body.date;
        req.lottoEntry.category = req.body.category;
        req.lottoEntry.entry = req.body.entry;
        req.lottoEntry.save(function(err) {
            if (err) {
                req.status(500).send(err);
            }
            res.json(lottoEntry);
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
            res.status(400).send('Removed');
        })
    };

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
