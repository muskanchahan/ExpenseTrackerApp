const Razorpay = require('razorpay');
const Order = require('../model/order.model');
// const userController = require('../controller/user.controller');


const purchasePremium = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: 'rzp_test_6mibziaNEsM9ew',
            key_secret: 'lg6qn1Rd41cEwK46Q909Lczg'
        })
        const amount = 2500;

        rzp.orders.create({ amount, currency: 'INR' }, (err, order) => {
            if (err) {
                console.log("Raw Error:", err);
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING' }).then(() => {
                return res.status(201).json({ order, key_id: rzp.key_id });
            }).catch(err => {
                throw new Error(err)
            })
        })
    } catch (error) {
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error: err })
    }
}

const updateTransactionStatus = (req, res) => {
    try {
        const { payment_id, order_id } = req.body;
        Order.findOne({ where: { orderid: order_id } }).then(order => {
            const promise1 = order.update({ paymentid: payment_id, status: 'SUCCESSFUL' })
            const promise2 = req.user.update({ ispremiumuser: true })
            Promise.all([promise1, promise2]).then(() => {
                return res.status(202).json({ sucess: true, message: "Transaction Successful"});
            })
        }).catch((err) => {
            throw new Error(err);
        })
    }
    catch (err) {
        console.log(err);
        res.status(403).json({ errpr: err, message: 'Sometghing went wrong' })

    }
}



module.exports = {
    purchasePremium,
    updateTransactionStatus
}