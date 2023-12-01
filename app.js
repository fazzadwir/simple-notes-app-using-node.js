const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: 'public/images/', // Updated destination directory for uploads
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
  }
});

const upload = multer({ storage });

let posts = [
  {
    id: 0,
    title: "Hari ke 1",
    tag: "Slice of Life",
    post: "Aku jadi kepala sekolah",
    image: "/images/pexels-bri-schneiter-346529.jpg"
  },
];

app.get('/', (req, res) => {
  res.render('index', { posts });
});

app.get('/new-post', (req, res) => {
  res.render('new-post');
});

// Handle file upload in the /create-post route
app.post('/create-post', upload.single('image'), (req, res) => {
  const newId = posts.length + 1;
  const newTitle = req.body.title;
  const newTag = req.body.tag;
  const newPost = req.body.post;
  const imagePath = req.file ? `/images/${req.file.filename}` : null;

  const result = {
    id: newId, title: newTitle, tag: newTag, post: newPost, image: imagePath
  }

  posts.push(result); 
  console.log(result);
  res.redirect('/');
});

app.get('/edit-post/:id', (req, res) => {
  const id = req.params.id;
  res.render('edit-post', { id, posts });
});

app.post('/update-post/:id', upload.single('image'), (req, res) => {
  try {
    const newId = req.params.id;
    const updatedPost = req.body.post;
    const updatedTitle = req.body.title;
    const updatedTags = req.body.tag;
    const imagePath = req.file ? `/images/${req.file.filename}` : posts[id].image;
    
    const result = {
      id: newId, title: updatedTitle, tag: updatedTags, post: updatedPost, image: imagePath
    }

    console.log(result);
    posts[id] = result;
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
});


app.delete('/delete-post/:id', (req, res) => {
  const id = req.params.id;
  posts.splice(id, 1);
  res.redirect('/');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
