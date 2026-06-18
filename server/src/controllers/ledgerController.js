const Ledger = require('../models/Ledger');
const Vendor = require('../models/Vendor');

// Add an organizational review, warning, or success story to a target vendor
exports.addLedgerEntry = async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    const { author, entryType, message } = req.body;

    // Verify vendor actually exists before creating dangling ledger records
    const vendorExists = await Vendor.exists({ _id: vendorId });
    if (!vendorExists) {
      return res.status(404).json({ success: false, error: 'Cannot append ledger data. Targeted Vendor does not exist.' });
    }

    const newEntry = await Ledger.create({
      vendorId,
      author,
      entryType,
      message
    });

    res.status(201).json({ success: true, message: 'Institutional knowledge ledger entry logged successfully', data: newEntry });
  } catch (error) {
    next(error);
  }
};