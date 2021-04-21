const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");

const router = express();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(express.static("public"));
router.use(logger("dev"));

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/workout',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
);

router.use(require("./routes/api.js"));
router.use(require("./routes/html.js"));

router.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, router.settings.env);
});