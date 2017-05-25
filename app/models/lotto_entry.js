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
    }
});

module.exports = mongoose.model('LottoEntry', LottoEntry);
