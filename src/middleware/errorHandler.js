const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "❌ Internal Server Error" });
};
  
module.exports = errorHandler;
  