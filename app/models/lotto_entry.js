var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LottoEntry = new Schema({
    date: {
        type: Date
    },
    entry: {
        type: String
    },
    category: {
        type: String
    },
    winning: {
        type: Boolean
    }
});

module.exports = mongoose.model('LottoEntry', LottoEntry);
