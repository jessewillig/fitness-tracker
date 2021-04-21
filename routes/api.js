const router = require("express").Router();
const mongoose = require("mongoose");
const Workout = require("../models/Workout.js");

mongoose.connect("mongodb://localhost/workout", {
  useNewUrlParser: true,
  useFindAndModify: false,
});

router.get("/api/workouts/range", (req, res) => {
  Workout.find({})
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/api/workouts", (req, res) => {
  Workout.find({})
    .sort({ day: -1 })
    .limit(1)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.post("/api/workouts", (req, res) => {
  Workout.create(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.put("/api/workouts/:id", (req, res) => {
  Workout.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { exercises: req.body } },
    { upsert: true, new: true }
  )
    .then((data) => {
      let duration = data.calcDuration();
      Workout.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { totalDuration: duration } }
      ).then((updated) => {
        res.json(updated);
      });
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
