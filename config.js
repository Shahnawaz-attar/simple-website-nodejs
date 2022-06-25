const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/simple_website');


// check connection established or not
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     console.log('Connected to MongoDB');
//     }
// );


