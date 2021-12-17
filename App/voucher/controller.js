const Voucher = require('./model')
const Category = require('../category/model')
const Nominal = require('../nominal/model')
const fs = require('fs');
const path = require('path');
const config = require('../../config')

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage")
            const alertStatus = req.flash("alertStatus")

            const alert = {message: alertMessage, status: alertStatus}
            console.log("Allert >>",alert);
            const voucher = await Voucher.find()
            .populate('category')
            .populate('nominals')

            console.log("Voucher =>", voucher);
            res.render('admin/voucher/view_voucher', {
                voucher,
                alert,
                name: req.session.user.name,
                title: 'page voucher'
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },

    viewCreate : async (req, res) => {
        try {
            const category = await Category.find()
            const nominal = await Nominal.find()
            res.render('admin/voucher/create', {
                category,
                nominal,
                name: req.session.user.name,
                title: 'page tambah voucher'
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },

    actionCreate : async (req, res) => {
        try {
            const {name, category, nominals} = req.body;

            if(req.file){
                let tmp_path = req.file.path;
                let originaExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let filename = req.file.filename + '.' + originaExt;
                let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`);


                const src = fs.createReadStream(tmp_path);
                const dest = fs.createWriteStream(target_path);

                src.pipe(dest)

                src.on('end', async () => {
                    try {
                        const voucher = new Voucher({
                            name, category, nominals, thumbnial: filename
                        })

                        await voucher.save();
                        
                        req.flash('alertMessage', "Success add voucher")
                        req.flash('alertStatus', "success")

                        res.redirect('/voucher')

                    } catch (error) {
                        req.flash('alertMessage', `${error.message}`)
                        req.flash('alertStatus', 'danger')
                        res.redirect('/voucher')
                    }
                })

            }else {
                const voucher = new Voucher({
                    name, category, nominals
                })

                    await voucher.save();

                    res.redirect('/voucher')

                    req.flash('alertMessage', "Success add voucher")
                    req.flash('alertStatus', "success")
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },

    viewEdit: async (req, res) => {
        try {
            const {id} = req.params
            const category = await Category.find()
            const nominal = await Nominal.find()
            const voucher = await Voucher.findOne({_id: id})
            .populate('category')
            .populate('nominals')

            res.render('admin/voucher/edit', {
                voucher,
                nominal,
                category,
                name: req.session.user.name,
                title: 'page voucher'
            })

        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },

    actionEdit: async (req, res) => {
         try {
             const {id} = req.params
            const {name, category, nominals} = req.body;

            if(req.file){
                let tmp_path = req.file.path;
                let originaExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let filename = req.file.filename + '.' + originaExt;
                let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`);

                const src = fs.createReadStream(tmp_path);
                const dest = fs.createWriteStream(target_path);

                src.pipe(dest)

                src.on('end', async () => {
                    try {
                        const voucher = await Voucher.findOne({_id: id});
                        let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnial}`

                        // Metode fs.existsSync() digunakan untuk memeriksa secara sinkron 
                        // apakah file sudah ada di jalur yang diberikan atau tidak. 
                        // Ini mengembalikan nilai boolean yang menunjukkan keberadaan file.
                        if(fs.existsSync(currentImage)){
                            fs.unlinkSync(currentImage)
                        }

                        //unlinkSync method untuk menghapus file

                        await Voucher.findOneAndUpdate({
                            _id: id
                        },{
                            name,
                            category,
                            nominals,
                            thumbnial: filename
                        })
                        
                        req.flash('alertMessage', "Success Ubah voucher")
                        req.flash('alertStatus', "success")

                        res.redirect('/voucher')

                    } catch (error) {
                        req.flash('alertMessage', `${error.message}`)
                        req.flash('alertStatus', 'danger')
                        res.redirect('/voucher')
                    }
                })

            }else {
                await Voucher.findOneAndUpdate({
                    _id: id
                }, {
                    name,
                    category,
                    nominals
                })

                    res.redirect('/voucher')

                    req.flash('alertMessage', "Success Ubah voucher")
                    req.flash('alertStatus', "success")
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },

    actionDelete: async (req, res) => {
        try {
            const {id} = req.params

            
            const voucher = await Voucher.findOneAndRemove({_id: id})
            let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnial}`
            
            if(fs.existsSync(currentImage)){
                fs.unlinkSync(currentImage)
            }
            req.flash('alertMessage', "Berhasil Delete Voucher")
            req.flash('alertStatus', "success")
            
            res.redirect('/voucher')
        } catch (error){
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },

    actionStatus: async (req, res) => {
        try {
            const {id} = req.params;
            let voucher = await Voucher.findOne({_id: id});

            let status = voucher.status === 'Y' ? 'N' : 'Y'
            voucher = await Voucher.findOneAndUpdate({_id: id}, {status})

            req.flash('alertMessage', "Berhasil update status")
            req.flash('alertStatus', 'success')

            res.redirect('/voucher')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    }
}