const moongose = require('mongoose');
const bcrypt = require('bcryptjs');

const HASH_ROUND = 10;

let playerSchema = moongose.Schema({
    email: {
        type: String,
        require: [true, 'email harus diisi']
    },

    name: {
        type: String,
        require: [true, 'nama harus diisi'],
        maxLength: [255, 'panjang nama harus diisi 3 - 255 karakter'],
        minLength: [3, 'panjang nama harus diantara 3 - 255 karakter']
    },

    userName: {
        type: String,
        require: [true, 'userName harus diisi'],
        maxLength: [255, 'panjang nama harus diisi 3 - 255 karakter'],
        minLength: [3, 'panjang nama harus diantara 3 - 255 karakter']
    },

    password: {
        type: String,
        require: [true, 'password wajib diisi'],
        maxLength: [15, 'panjang password minimal 15 karakter']
    },

    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },

    status: {
        type: String,
        enum: ['Y', 'N'],
        default: 'Y'
    },

    avatar: {
        type: String
    },

    fileName: {
        type: String
    },

    phoneNumber: {
        type: String,
        require: [true, 'nomor telephone harus disi'],
        maxLength: [13, 'panjang nomor telephone harus antara 13 - 9 karakter'],
        minLength: [9, 'panjang nomonr telephone harus antara 9 - 13 karakter']
    },

    favorite: {
        type: moongose.Schema.Types.ObjectId,
        ref: 'Category'
    },

}, {timestamps: true})

// unttk menghandle email tidak boleh sama
playerSchema.path('email').validate(async function(value){
    try {
        const count = await this.model('Player').countDocuments({email: value})
        return !count;
    } catch (error) {
        throw error
    }
}, attr => `${attr.value} sudah terdaftar!`)


// sebelum disimpan di model nya si password ini sudah dinjadikan dalam bentuk bcrypt
playerSchema.pre('save', function(next) {
    this.password = bcrypt.hashSync(this.password, HASH_ROUND)
    next()
})

module.exports = moongose.model('Player', playerSchema)