const MOCK_USERS = [
  {
    id: "usr_001",
    email: "employee@company.com",
    password: "password123",
    name: "Sefali saha",
    role: "Employee",
    department: "IT Operations",
    watchlist: [] // Array tracking Mongo Vendor Object IDs
  },
  {
    id: "usr_002",
    email: "admin@company.com",
    password: "admin123",
    name: "HR Management Group",
    role: "Admin",
    department: "Human Resources",
    watchlist: []
  }
];

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);

    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid corporate credentials." });
    }

    res.status(200).json({
      success: true,
      token: "mock-jwt-token-string-xyz123",
      user: { id: user.id, email: user.email, name: user.name, role: user.role, department: user.department, watchlist: user.watchlist }
    });
  } catch (error) {
    next(error);
  }
};

// Toggle a vendor identifier inside the authenticated user's target profile scope
exports.toggleWatchlist = async (req, res, next) => {
  try {
    const { userId, vendorId } = req.body;
    const user = MOCK_USERS.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ success: false, error: "Session User execution entity not found." });
    }

    const index = user.watchlist.indexOf(vendorId);
    let message = "";

    if (index >= 0) {
      user.watchlist.splice(index, 1); // Pull out if duplicate matches
      message = "Vendor successfully extracted from personal watchlist tracking.";
    } else {
      user.watchlist.push(vendorId); // Inject if missing
      message = "Vendor anchored into your active corporate monitoring watchlist.";
    }

    res.status(200).json({ success: true, message, watchlist: user.watchlist });
  } catch (error) {
    next(error);
  }
};