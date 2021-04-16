const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');

const PORT = process.env.PORT || 3001

const db = require('./models');

const router = express();

router.engine('handlebars', exphbs({ defaultLayout: 'main' }));
router.set('view engine', 'handlebars');

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/fitnessdb', {
    useNewUrlParser: true,
    useFindAndModify: false
});

router.get('/', (req, res) => {
    db.Workout.find({})
    .populate('exercises').sort({date:-1}).lean()
    .then(dbWorkout => {
        res.render('index', {workouts: dbWorkout})
    })
    .catch(err => {
        res.json(err);
    });
});

router.post('/api/exercises', ({ body }, res) => {
    const newObject = {
        name: body.name,
        count: body.count,
        unit: body.unit,
        notes: body.notes
    }
    console.log('server side');
    console.table(newObject);

    db.Exercise.create(newObject)
        .then(({ _id }) => db.Workout.findOneAndUpdate({_id: body._id}, { $push: { exercises: _id } }, { new: true }))
        .then(dbWorkout => {
            console.log(dbWorkout);
            res.send(dbWorkout);
        }).catch(err => {
            console.log(err);
            res.send(err);
        });    
});

router.get('/api/exercises', (req, res) => {
    db.Exercise.findOneAndUpdate({_id: req.body._id}, req.body, { new: true })
    .then(dbExercise => {
        res.send(dbExercise);
        console.log(dbExercise);
    }).catch(err => {
        res.send(err);
        console.log(err);
    });
});

router.get('/populatedworkouts', (req, res) => {
    db.Workout.find({}).sort({date:'asc'})
    .populate('exercises')
    .then(dbWorkout => {
        res.render({workouts: dbWorkout});
    }).catch(err => {
        res.json(err);
    });
});

router.get('/api/workouts', ({ body }, res) => {
    db.Workout.create({ name: body.name })
        .then(dbWorkout => {
            console.log(dbWorkout);
            res.send(dbWorkout);
        })
        .catch(({ message }) => {
            console.log(message);
        });
});

router.delete('/api/exercises', ({ body }, res) => {
    db.Exercise.deleteOne({_id: body._id}, function (err) {
        if (err) throw err;
        console.log('Sucessfully deleted!');
        res.redirect('/');
    });
});

router.delete('/api/workouts', ({ body }, res) => {
    db.Workout.deleteOne({_id: body._id}, function (err) {
        if (err) throw err;
        console.log('Successfully deleted!');
        res.redirect('/');
    });
});

router.listen(PORT, () => {
    console.log(`Router running on port ${PORT}!`);
});