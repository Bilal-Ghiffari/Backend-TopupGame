const Transaction = require('./model');

module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash("alertMessage")
            const alertStatus = req.flash("alertStatus")

            const alert = {message: alertMessage, status: alertStatus}
            let transaction = await Transaction.find().populate('player')

            res.render('admin/transaction/view_transaction', {
                alert,
                transaction,
                name: req.session.user.name,
                title: 'page metode pembayaran'
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/transaction')
        }
    },

    actionStatus: async (req, res) => {
        try {
            const {id} = req.params;
            const {status} = req.query;

            await Transaction.findByIdAndUpdate({_id: id}, {status})

            req.flash('alertMessage', 'Berhasil ubah status')
            req.flash('alertStatus', 'success')
            res.redirect('/transaction')

        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/transaction')
        }
    }
}