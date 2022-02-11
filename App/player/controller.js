const Player = require('./model');
const Voucher = require('../voucher/model');
const Category = require('../category/model');
const Bank = require('../bank/model');
const Payment = require('../payment/model');
const Nominal = require('../nominal/model');
const Transaction = require('../transaction/model');
const fs = require('fs');
const path = require('path');
const config = require('../../config')

module.exports = {
    landingPage: async (req, res) => {
        try {
            const voucher = await Voucher.find()
            .select('_id name status category thumbnail')
            .populate('category')

            res.status(200).json({data: voucher})
        } catch (error) {
            res.status(500).json({message: error.message || `Internal server error`})
        }
    },

    detailPage: async (req, res) => {
        try {
            const {id} = req.params
            const voucher = await Voucher.findOne({_id: id})
            .populate('category')
            .populate('nominals')
            .populate('user', '_id name phoneNumber')

            const payment = await Payment.find().populate('banks')

            if(!voucher) {
                res.status(404).json({message: "voucher game tidak ditemukan"})
            }

            res.status(200).json({
                data: {
                    detail: voucher,
                    payment
                } 
            })
            
        } catch (error) {
            res.status(500).json({message: error.message || `Internal server error`})
        }
    },

    category: async (req, res) => {
        try {
            const category = await Category.find()
            res.status(200).json({data: category})
        } catch (error) {
            res.status(500).json({message: error.message || `Internal Server Error`})
        }
    },

    checkout: async (req, res) => {
        try {
            const {accountUser, name, nominal, voucher, payment, bank} = req.body

            const res_voucher = await Voucher.findOne({_id: voucher})
            .select('name category _id thumbnail user')
            .populate('user')
            if(!res_voucher) return res.status(404).json({message: 'voucher game tidak ditemukan'})
            
            const res_nominal = await Nominal.findOne({_id: nominal})
            if(!res_nominal) return res.status(404).json({message: 'nominal tidak ditemukan'})

            const res_payment = await Payment.findOne({_id: payment})
            if(!res_payment) return res.status(404).json({message: 'payment tidak ditemukan'})

            const res_bank = await Bank.findOne({_id: bank})
            if(!res_bank) return res.status(404).json({message: 'bank tidak ditemukan'})


            let tax = (10 / 100) * res_nominal._doc.price;
            let value = res_nominal._doc.price - tax;

            const payload = {
                historyVoucherTopup: {
                    gameName: res_voucher._doc.name,
                    category: res_voucher._doc.category ? res_voucher._doc.category.name : '',
                    thumbnail: res_voucher._doc.thumbnail,
                    coinName: res_nominal._doc.coinName,
                    coinQuantity: res_nominal._doc.coinQuantity,
                    price: res_nominal._doc.price
                },

                historyPayment: {
                    name: res_bank._doc.name,
                    type: res_payment._doc.type,
                    bankName: res_bank._doc.bankName,
                    noRekening: res_bank._doc.noRekening
                },

                name: name,
                accountUser: accountUser,
                tax: tax,
                value: value,
                player: req.player._id,
                historyUser: {
                    name: res_voucher._doc.user?.name,
                    phoneNumber: res_voucher._doc.user?.phoneNumber
                },

                category: res_voucher._doc.category?._id,
                user: res_voucher._doc.user?._id

            }

            const transactions = new Transaction(payload)
            await transactions.save()

            res.status(201).json({
                data: transactions
            })
        } catch (error) {
            res.status(500).json({message: error.message || `Internal Server Error`})
        }
    },

    history: async (req, res) => {
        try {
            const {status = ''} = req.query
            let criteria = {}

            // $regex: untuk mencocokkan pola yang berbeda. Ini berguna untuk menemukan string dalam dokumen /  untuk mencari string dalam collection
            // $options: dengan parameter 'i' menentukan bahwa kita ingin melakukan pencarian tanpa mempertimbangkan huruf besar atau kecil.
            if(status.length){
                criteria = {
                    ...criteria,
                    status: {
                        $regex: `${status}`,
                        $options: 'i'
                    }
                }
            }

            if(req.player._id){
                criteria = {
                    ...criteria,
                    player: req.player._id
                }
            }
            
            // total value
            let total = await Transaction.aggregate([
                {$match: criteria},
                {
                    $group: {
                        _id: null,
                        value: {$sum: "$value"}
                    }
                }
            ])

            const history = await Transaction.find(criteria).populate('category')
            console.log("history", history)
            res.status(200).json({
                data: {
                    history: history,
                    total: total.length ? total[0].value : 0
                }
            })

        } catch (error) {
            res.status(500).json({message: error.message || `Internal Server Error`})
        }
    },

    // Details history 
    historyDetails: async (req, res) => {
        try {
            const {id} = req.params;
            const history = await Transaction.findOne({_id: id})
            
            if(!history) return res.status(404).json({
                message: "history tidak ditemukan"
            })

            res.status(200).json({
                data: history
            })
        } catch (error) {
            res.status(500).json({
                message: error.message || `Internal Server Error`
            })
        }
    },

    dashboard: async (req, res) => {
        try {
            const count = await Transaction.aggregate([
                {$match: {player: req.player._id}},
                {
                    $group: {
                        _id: '$category',
                        value: {$sum: '$value'}
                    }
                }
            ])

            const category = await Category.find({})
            category.forEach(category => {
                count.forEach(count => {
                    if(count._id.toString() === category._id.toString()){
                        count.name = category.name
                    }
                })
            });

            const history = await Transaction.find({player: req.player._id})
            .populate('category')
            .sort({'updateAt': -1})

            res.status(200).json({
                data: {
                    history,
                    count
                }
            })
        } catch (error) {
            res.status(500).json({
                message: error.message || `Internal Server Error`
            })
        }
    }, 

    profile: async (req, res) => {
        try {
            const players = {
                id: req.player._id,
                name: req.player.name,
                avatar: req.player.avatar,
                email: req.player.email,
                password: req.player.password,
                phoneNumber: req.player.phoneNumber
            }
            
            res.status(200).json({
                data: players
            })
        } catch (error) {
            res.status(500).json({
                message: error.message || `Internal Server Error`
            })
        }
    },

    editProfile: async (req, res, next) => {
        try {
            const {name = "", phoneNumber = ""} = req.body
            const payload = {}

            if(name.length) payload.name = name;
            if(phoneNumber.length) payload.phoneNumber = phoneNumber;
            console.log("player",req.file)
            if (req.file) {
                // update untuk input file
                let tmp_path = req.file.path;
                let originaExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let filename = req.file.filename + '.' + originaExt;
                let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`);

                const src = fs.createReadStream(tmp_path);
                const dest = fs.createWriteStream(target_path);

                src.pipe(dest)

                    src.on('end', async () => {
                        
                        let player = await Player.findOne({_id: req.player._id});
                        let currentImage = `${config.rootPath}/public/uploads/${player.avatar}`

                        // Metode fs.existsSync() digunakan untuk memeriksa secara sinkron 
                        // apakah file sudah ada di jalur yang diberikan atau tidak. 
                        // Ini mengembalikan nilai boolean yang menunjukkan keberadaan file.
                        if(fs.existsSync(currentImage)){
                            fs.unlinkSync(currentImage)
                        }

                        //unlinkSync method untuk menghapus file
                        player = await Player.findOneAndUpdate({
                            _id: req.player._id
                        },{
                            ...payload,
                            avatar: filename
                            //Secara default, findOneAndUpdate() mengembalikan dokumen seperti sebelum 
                            //pembaruan diterapkan. Jika Anda menyetel new: true, findOneAndUpdate() akan memberi Anda objek setelah pembaruan diterapkan.
                        },{new: true, runValidators: true})
                            res.status(201).json({
                                data: {
                                    _id: player._id,
                                    name: player.name,
                                    phoneNumber: player.phoneNumber,
                                    avatar: player.avatar
                                }
                            })
                    })
                    
                    src.on('err', async () => {
                        next(err)
                    })

            } else {
                const player = await Player.findOneAndUpdate({
                    _id: req.player._id
                }, payload, {new: true, runValidators: true})

                res.status(201).json({
                    data: {
                        id: player.id,
                        name: player.name,
                        phoneNumber: player.phoneNumber,
                        avatar: player.avatar
                    }
                })
            }
        } catch (err) {
            if(err && err.name === "ValidationError"){
                res.status(422).json({
                    error: 1,
                    message: err.message,
                    fields: err.errors
                })
            }
        }
    }
}