const Category = require('./model');

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage")
            const alertStatus = req.flash("alertStatus")

            const alert = {message: alertMessage, status: alertStatus}
            console.log("Allert >>",alert);
            const category = await Category.find()
            res.render('admin/category/view_category', {
                category,
                alert,
                name: req.session.user.name,
                title: 'page category'
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },

    viewCreate : async (req, res) => {
        try {
            res.render('admin/category/create', {
                name: req.session.user.name,
                title: 'page tambah category'
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },

    actionCreate : async (req, res) => {
        try {
            const {name} = req.body
            req.flash('alertMessage', "Berhasil tambah katagori")
            req.flash('alertStatus', "success")
            
            let category = await Category({name})
            await category.save()
            res.redirect('/category');


        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },

    viewEdit: async (req, res) => {
        try {
            const {id} = req.params
            const category = await Category.findOne({_id: id})

            res.render('admin/category/edit', {
                category,
                name: req.session.user.name,
                title: 'page ubah category'
            })

        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },

    actionEdit: async (req, res) => {
        try {
            const {id} = req.params;
            const {name} = req.body

            req.flash('alertMessage', "Berhasil Edit katagori")
            req.flash('alertStatus', "success")

            await  Category.findOneAndUpdate({
                _id: id
            }, {name})

            res.redirect('/category')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },

    actionDelete: async (req, res) => {
        try {
            const {id} = req.params

            req.flash('alertMessage', "Berhasil Delete katagori")
            req.flash('alertStatus', "success")

            await Category.findOneAndRemove({_id: id})

            res.redirect('/category')
        } catch (error){
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
        }
    }