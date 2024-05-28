exports.getServerHealth = async (req, res) => {
  try {
    const healthcheck = {
      uptime: process.uptime(),
      timestamp: Date.now(),
    };
    return res
      .status(200)
      .json({ status: 200, msg: "success", data: healthcheck });
  } catch (error) {
    return res.status(500).json({ status: 500, msg: "internal server error" });
  }
};
