const mongoose = require('mongoose');

let transactionSchema = mongoose.Schema({
    historyVoucherTopup: {
        gameName: {type: String, require: [true, 'nama game harus diisi']},
        category: {type: String, require: [true, 'category harus diisi']},
        thumbnail: {type: String},
        coinName: {type: String, require: [true, 'nama coin harus diisi']},
        coinQuantity: {type: String, require: [true, 'jumlah coin harus diisi']},
        price: {type: String}
    },

    historyPayment: {
        name: {type: String, require: [true, 'nama harus diisi']},
        type: {type: String, require: [true, 'tipe pembayaran harus diisi']},
        bankName: {type: String, require: [true, 'nama bank harus diisi']},
        noRekening: {type: String, require: [true, 'nomor rekening harus diisi']}
    },

    name: {
        type: String,
        require: [true, 'nama harus diisi'],
        maxLength: [225, 'panjang nama harus diisi 3 - 255 karakter'],
        minLength: [3, 'panjang nama harus antara 3 - 255 karakter']
    },

    accountUser: {
        type: String,
        require: [true, 'nama akun harus diisi'],
        maxLength: [255, 'panjang nama harus antara 3 - 255 karakter'],
        minLength: [3, 'panjang nama harus antara 3 - 255 karakter']
    },

    tax: {
        type: Number,
        default: 0
    },

    value: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    },

    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    },

    historyUser: {
        name: {
            type: String,
            require: [true, 'nama player harus diisi']
        },
        phoneNumber: {
            type: Number,
            require: [true, 'mohon isi no telephone anda'],
            maxLength: [13, 'panjang nomor harus diisi antara 9 - 13 karakter'],
            minLength: [9, 'panjang nomor harus antara 9 - 13 karakter']
        }
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

module.exports = mongoose.model('Transaction', transactionSchema);