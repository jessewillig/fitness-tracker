const router = require("express").Router();
const Workout = require("../models/workout.js");

router.post("/api/workouts", (req, res) => {
    Workout.create({})
    .then((fitnessdb) => {
        res.json(fitnessdb);
    })
    .catch((err) => {
        res.json(err);
    });
});

router.get("/api/workouts/:id", ({body,params}, res ) => {
    Workout.findByIdAndUpdate(
        params.id, 
        { $push: { exercise: body}},
        { new: true, runValidators: true}
    )
    .then((fitnessdb) => {
        res.json(fitnessdb);
    })
    .catch((err) => {
        res.json(err);
    });
});

router.get("/api/workouts", (req,res) => {
    Workout.aggregate([
        {
          $addFields: {
              totalDuration: {
                  $sum: "exercises.duration",
              },
          },
        },
    ])
    .then((fitnessdb) => {
        res.json(fitnessdb);
    })
    .catch((err) => {
        res.json(err);
    })
})

router.get("/api/workouts/range", (req, res) => {
    Workout.aggregate([ {
        $addFields: {
            totalDuration: {
                $sum: "$exercise.duration",
            },
        },
    },  
    ])
    .sort({ _id: -1})
    .limit(7)
    .then((fitnessdb) => {
     res.json(fitnessdb)
    })
    .catch((err) => {
        res.json(err)
    });
});

module.exports = router;