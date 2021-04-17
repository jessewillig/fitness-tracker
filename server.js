const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");

const PORT = process.env.PORT || 3001;

const router = express();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(express.static("public"));
router.use(logger("dev"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {
  useNewUrlParser: true,
  useFindAndModify: false,
});

router.use(require("./routes/api.js"));
router.use(require("./routes/html.js"));

router.listen(PORT, () => {
  console.log(`Router running on port ${PORT}!`);
});
