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
    useFindAndModify
});