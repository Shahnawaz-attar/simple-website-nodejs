require('./config');
const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const weeklynews = require('./models/posts');
const video_posts = require('./models/videos');
const admin = require('./models/admin');
const publicPath = path.join(__dirname, 'views');
const port = process.env.PORT || 3000;
app.use(express.static(publicPath));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
// session
const session = require('express-session');
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  }
}));

// get host link
const host = process.env.HOST || 'localhost';
const baseUrl = `http://${host}:${port}`;
app.locals.baseUrl = baseUrl;
app.locals.admin_id = 0;
app.locals.pageName = 'home';
app.use((req, res, next) => {
  req.url_params = req.url.split('/')[1];
  app.locals.url_params = req.url_params;
  if (app.locals.url_params != '') {
    app.locals.pageName = app.locals.url_params;
  } else {
    app.locals.pageName = 'home';
  }
  next();
}
);



app.use('/uploads', express.static('uploads'));

app.get('/', (_, res) => {
  const get_posts = weeklynews.get_posts();
  const get_videos = video_posts.get_videos();

  let weekly_news = [];
  let news = [];
  get_posts.then(posts => {
    posts.forEach(post => {
      post.date = new Date(post.date).toLocaleDateString();
      if (post.post_type === 'weekly') {
        weekly_news.push(post);
      }
      if (post.post_type === 'daily') {
        news.push(post);
      }
    })


  }).then(() => {
    // load get_videos
    get_videos.then(videos => {
      res.render('home', { weekly_news, news, videos });
    });

  });


}
);

//Contact
app.get('/contact', (req, res) => {
  const page_title = 'Contact';
  res.render('contact', { page_title });
});

//save_contact
app.post('/save_contact', (req, res) => {
  const { name, message } = req.body;
  const save_contact = admin.save_contact(name, message);
  save_contact.then(() => {
    res.send({ status: 'success', url: '/' });
  });
});

// admin
app.get('/admin', (_, res) => {
  if (!check_admin()) {
    return res.redirect('/admin/login');
  }
  const page_title = 'Dashboard';
  res.render('admin/index', { page_title });
}
);

// admin/posts
app.get('/admin/posts', (_, res) => {
  if (!check_admin()) {
    return res.redirect('/admin/login');
  }
  const page_title = 'Posts';
  const get_posts = weeklynews.get_posts();
  get_posts.then(posts => {
    posts.forEach(post => {
      post.date = new Date(post.date).toLocaleDateString();
    })
    res.render('admin/posts', { posts, page_title });

  });

});

app.get('/admin/posts/add', (_, res) => {
  if (!check_admin()) {
    return res.redirect('/admin/login');
  }
  const page_title = 'Add Post';
  res.render('admin/posts_add', { page_title });
}
);




var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

app.post('/admin/post_save', upload.single('profile-file'), function (req, res, next) {
  const post = {
    title: req.body.title,
    description: req.body.description,
    img: req.file.filename,
    date: new Date(),
    order: 1,
    status: 1,
    post_type: req.body.post_type
  }
  weeklynews.add_post(post);
  // res.redirect('/admin/posts');
  res.send({ status: 'success', url: '/admin/posts' });

})


// delete
app.get('/admin/posts/delete/:id', (req, res) => {
  weeklynews.delete_post(req.params.id);
  res.send({ status: 'success', url: '/admin/posts' });
});


// edit
app.get('/admin/posts/edit/:id', (req, res) => {
  const page_title = 'Edit Post';
  const get_post = weeklynews.get_post(req.params.id);
  get_post.then(post => {
    post.date = new Date(post.date).toLocaleDateString();
    res.render('admin/edit_post', { post, page_title });
  });
});

// update
app.post('/admin/update_post', upload.single('profile-file'), function (req, res, next) {
  const post = {
    title: req.body.title,
    description: req.body.description,
    date: new Date(),
    order: 1,
    status: 1,
    post_type: req.body.post_type
  }
  var is_file_change = false;
  if (req.file) {
    post.img = req.file.filename;
    is_file_change = true;
  }

  weeklynews.update_post(req.body._id, post, is_file_change);
  res.send({ status: 'success', url: '/admin/posts' });
});






// Login
app.get('/admin/login', (_, resp) => {
  const page_title = 'Admin Login';

  resp.render('admin/login', { page_title: page_title });



})
app.post('/admin/checklogin', function (req, resp, next) {

  let post = {
    username: req.body.username,
    password: req.body.password
  }

  let result = admin.check_admin(post.username, post.password);
  result.then(data => {
    if (data != null) {
      req.session.admin_id = data._id;
      app.locals.admin_id = data._id;
      resp.send({ status: 'success', url: '/admin' });
    } else {
      resp.send({ status: 'error', url: '/admin/login' });
    }
  })



}
)


//logout
app.get('/admin/logout', (req, resp) => {
  req.session.destroy();
  app.locals.admin_id = 0;
  resp.redirect('/admin/login');
})

function check_admin() {
  if (app.locals.admin_id == 0) {
    return false;
  } else {
    return true;
  }
}

app.listen(port, () => {
  console.log('Example app listening on port 3000!');
}
);