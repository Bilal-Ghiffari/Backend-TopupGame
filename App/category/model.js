const mongoose = require('mongoose')

let categorySchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Nama kategory wajib di isi']
    },
}, {timestamps: true})

module.exports = mongoose.model('Category', categorySchema)