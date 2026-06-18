const Vendor = require("../models/Vendor");
const Ledger = require("../models/Ledger");

// Fetch all vendors with dynamic filtering (Excludes Deactivated ones by default for Employees)
exports.getVendors = async (req, res, next) => {
  try {
    const { city, category, status } = req.query;
    let queryFilter = {};

    if (city) queryFilter.city = { $regex: new RegExp(city, "i") };
    if (category) queryFilter.category = { $regex: new RegExp(category, "i") };

    if (status) {
      queryFilter.status = status;
    } else {
      // Allow Active, Under Review, Escalated, Strategic Partner, and Archived entries to pass through freely!
      // This explicitly guarantees 'Archived' records aren't filtered out by default database constraints.
      queryFilter.status = {
        $in: [
          "Active",
          "Under Review",
          "Escalated",
          "Strategic Partner",
          "Archived",
        ],
      };
    }

    const vendors = await Vendor.find(queryFilter);
    res
      .status(200)
      .json({ success: true, count: vendors.length, data: vendors });
  } catch (error) {
    next(error);
  }
};

// Fetch a single vendor and populate their corresponding experience ledger history
exports.getVendorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findById(id);

    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, error: "Vendor profile not found" });
    }

    const historyLedger = await Ledger.find({ vendorId: id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: { vendor, historyLedger },
    });
  } catch (error) {
    next(error);
  }
};

// Administrative status override (Updated to include Deactivated state workflows)
exports.updateVendorStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Added 'Archived' to allow graceful deactivation from active dashboards
    const allowedStatuses = [
      "Active",
      "Under Review",
      "Escalated",
      "Strategic Partner",
      "Archived",
    ];
    if (!allowedStatuses.includes(status)) {
      return res
        .status(400)
        .json({
          success: false,
          error: `Invalid status option. Must be one of: ${allowedStatuses.join(", ")}`,
        });
    }

    const updatedVendor = await Vendor.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedVendor) {
      return res
        .status(404)
        .json({ success: false, error: "Vendor profile not found" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Vendor operational status updated successfully",
        data: updatedVendor,
      });
  } catch (error) {
    next(error); // Passes validation structural crashes to express error logger safely
  }
};

exports.createVendor = async (req, res, next) => {
  try {
    // Collect onboarding variables directly from req.body
    const {
      name,
      category,
      city,
      status,
      departmentsUsed,
      scorecard,
      activeContracts,
    } = req.body;

    // Write to MongoDB using your Mongoose model definition layout
    const newVendor = await Vendor.create({
      name,
      category,
      city,
      status: status || "Active",
      departmentsUsed: departmentsUsed || [],
      scorecard: scorecard || {
        slaCompliance: 5,
        communication: 5,
        qualityOfService: 5,
      },
      activeContracts: activeContracts || [],
    });

    res.status(201).json({
      success: true,
      message: "New corporate vendor resource successfully recorded.",
      data: newVendor,
    });
  } catch (error) {
    next(error); // Pass schema validation errors down to the global error handler
  }
};
