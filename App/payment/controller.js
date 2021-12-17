const Payment = require('./model');
const Bank = require('../bank/model');

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage")
            const alertStatus = req.flash("alertStatus")

            const alert = {message: alertMessage, status: alertStatus}
            const payment = await Payment.find()
            .populate('banks')

            res.render('admin/payment/view_payment', {
                alert,
                payment,
                name: req.session.user.name,
                title: 'page payment'
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertMessage', 'danger')
            res.redirect('/payment')
        }
    },

    viewCreate: async (req, res) => {
        try {
            const payment = await Payment.find()
            const banks = await Bank.find()
            res.render('admin/payment/create', {
                payment,
                banks,
                name: req.session.user.name,
                title: 'page tambah payment'
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertMessage', 'danger')
            res.redirect('/payment')
        }
    },

    actionCreate: async (req, res) => {
        try {
            const {type, banks} = req.body
            let payment = await Payment({type, banks})
            await payment.save()

            req.flash('alertMessage', 'Berhasil Tambah Bank');
            req.flash('alertStatus', 'success');

            res.redirect('/payment')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertMessage', 'danger')
            res.redirect('/payment')
        }
    },

    viewEdit: async (req, res) => {
        try {
            const {id} = req.params;

            const payment = await Payment.findOne({_id: id})
            .populate('banks')
            const banks = await Bank.find()

            res.render('admin/payment/edit', {
                payment,
                banks,
                name: req.session.user.name,
                title: 'page ubah payment'
            })

        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertMessage', 'danger')
            res.redirect('/payment')
        }
    },

    actionEdit: async (req, res) => {
        try {
            const {id} = req.params;
            const {type, banks} = req.body;

            await Payment.findOneAndUpdate({_id: id}, {
                type, banks
            })

            req.flash('alertMessage', 'Berhasil Edit Bank');
            req.flash('alertStatus', 'success')

            res.redirect('/payment')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertMessage', 'danger')
            res.redirect('/payment')
        }
    },

    actionDelete: async (req, res) => {
        try {
            const {id} = req.params;
            await Payment.findOneAndRemove({_id: id})

            req.flash('alertMessage', 'Berhasil Hapus Bank');
            req.flash('alertStatus', 'success')

            res.redirect('/payment')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertMessage', 'danger')
            res.redirect('/payment')
        }
    },

    actionStatus: async (req, res) => {
        try {
            const {id} = req.params;
            let payment = await Payment.findOne({_id: id})

            const status = payment.status === 'Y' ? 'N' : 'Y';

            payment = await Payment.findOneAndUpdate({_id: id}, {
                status
            })

            req.flash('alertMessage', "Berhasil update status")
            req.flash('alertStatus', 'success')

            res.redirect('/payment')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertMessage', 'danger')
            res.redirect('/payment')
        }
    }
}