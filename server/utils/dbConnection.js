const mongoose = require('mongoose');

exports.connectDB = (uri) => {
    mongoose.connect(uri, {
        dbName: 'user_invoice'
    }).then((c) => console.log(`DB connect to ${c.connection.host}`))
        .catch((e) => console.log(e));
}