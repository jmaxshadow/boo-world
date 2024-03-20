const { Account } = require('../model/account');

async function ensureAccountExists(req, res, next) {
    try {
        const { id } = req.params;
        const account = await Account.findById(id);

        if (!account) {
            return res.status(404).send({ message: "Account not found" });
        }

        req.account = account; // Attach the account to the request object
        next(); // Proceed to the next middleware/route handler
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error while retrieving the account." });
    }
}

const addAccount = async (req, res) => {
    const newAccount = new Account(req.body);
    await newAccount.save();
    res.status(201).send(newAccount);
}

const getAccountById = async (req, res) => {
    const account = req.account;
    res.send(account);
}

module.exports = {
    addAccount,
    getAccountById,
    ensureAccountExists
};