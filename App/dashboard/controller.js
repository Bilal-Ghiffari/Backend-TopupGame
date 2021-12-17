const Transaction = require('../transaction/model');
const Category = require('../category/model');
const Voucher = require('../voucher/model');
const Player = require('../player/model');

module.exports = {
    index: async (req, res) => {
        const transaction = await Transaction.countDocuments()
        const category = await Category.countDocuments()
        const voucher = await Voucher.countDocuments()
        const player = await Player.countDocuments()
        try {
            res.render('admin/dashboard/view_dashboard',{
                name: req.session.user.name,
                title: 'Halaman Dashboard',
                count: {
                    transaction,
                    category,
                    voucher,
                    player
                }
            })
        } catch (err) {
            console.log(err);
        }
    }
}