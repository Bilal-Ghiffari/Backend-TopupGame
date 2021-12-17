const Nominal = require('./model');

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage")
            const alertStatus = req.flash("alertStatus")

            const alert = {message: alertMessage, status: alertStatus}
            console.log("Allert >>",alert);
            const nominal = await Nominal.find()
            res.render('admin/nominal/view_nominal', {
                nominal,
                alert,
                name: req.session.user.name,
                title: 'page nominal'
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/nominal')
        }
    },

    viewCreate : async (req, res) => {
        try {
            res.render('admin/bank/create', {
                name: req.session.user.name,
                title: 'page tambah nominal'
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/nominal')
        }
    },

    actionCreate : async (req, res) => {
        try {
            const {coinName, coinQuantity, price} = req.body
            req.flash('alertMessage', "Success add coins")
            req.flash('alertStatus', "success")
            
            let nominal = await Nominal({coinName, coinQuantity, price})
            await nominal.save()
            res.redirect('/nominal');


        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/nominal')
        }
    },

    viewEdit: async (req, res) => {
        try {
            const {id} = req.params
            const nominal = await Nominal.findOne({_id: id})

            res.render('admin/nominal/edit', {
                nominal,
                name: req.session.user.name,
                title: 'page ubah nominal'
            })

        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/nominal')
        }
    },

    actionEdit: async (req, res) => {
        try {
            const {id} = req.params;
            const {coinName, coinQuantity, price} = req.body

            req.flash('alertMessage', "Success Edit Nominal")
            req.flash('alertStatus', "success")

            await  Nominal.findOneAndUpdate({
                _id: id
            }, {coinName, coinQuantity, price})

            res.redirect('/nominal')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/nominal')
        }
    },

    actionDelete: async (req, res) => {
        try {
            const {id} = req.params

            req.flash('alertMessage', "Berhasil Delete Coin")
            req.flash('alertStatus', "success")

            await Nominal.findOneAndRemove({_id: id})

            res.redirect('/nominal')
        } catch (error){
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/nominal')
        }
        }
}