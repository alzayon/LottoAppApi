var express = require('express');

var routes = function(LottoEntry) {
    var lottoEntryRouter = express.Router();

    var lottoEntryControllerFunc = require('../controllers/lotto_entry.controller');
    var lottoEntryController = lottoEntryControllerFunc(LottoEntry);

    //Setup the routes
    lottoEntryRouter.route('/')
        .post(lottoEntryController.post)
        .get(lottoEntryController.get);


    lottoEntryRouter.use('/:lottoEntryId', lottoEntryController.entryByIdResolver);

    lottoEntryRouter.route('/:lottoEntryId')
        .get(lottoEntryController.getById)
        .put(lottoEntryController.put)
        .patch(lottoEntryController.patch)
        .delete(lottoEntryController.deleteEntry);

    //Finally return the router
    return lottoEntryRouter;

}


module.exports = routes;
