const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const app = express();

const errorController = require('./controllers/error');
const mongoose = require('mongoose');
const User = require('./models/user');

 const adminRoutes = require('./routes/admin');
 const shopRoutes = require('./routes/shop');
 const authRoutes = require('./routes/auth');

app.set('view engine','ejs');
app.set('views','views');

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname,'public')));
app.use(
    session({ secret: 'my secret', resave: false, saveUninitialized: false })
);

app.use((req, res, next) => {
    User.findById('5c52a9629a2f0653d0cabd2f')
           .then(user => {
               req.user = user;
               next();
           })
           .catch(err => console.log(err));
});

 app.use('/admin',adminRoutes);
 app.use(shopRoutes);
 app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://Tarun:longterm@cluster0-vusue.mongodb.net/shop?retryWrites=true')
        .then(result => {
            User.findOne()
                .then(user => {
                    if(!user) {
                        const user = new User({
                            name: 'C. Tarun Reddy',
                            email: 'tarunreddy1018@gmail.com',
                            cart: {
                                items: []
                            }
                        });
                        user.save();
                    }
                });
            app.listen(3000);
        })
        .catch(err => {
            console.log(err);
        });