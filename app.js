const   express             =  require('express'),
        app                 =  express(),
        expressSanitizer    =  require('express-sanitizer'),
        bodyParser          =  require('body-parser'),
        methodOverride      =  require('method-override'),
        mongoose            =  require('mongoose');

// APP CONFIG
mongoose.connect('mongodb://localhost:27017/blog_app',{ useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(expressSanitizer());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String, 
    image: String,
    body: String,
    created: 
        {
            type: Date, 
            default: Date.now
        }
});

const Blog = mongoose.model('Blog', blogSchema);
// DEMO START
// Blog.create({
//     title: "Test Blog",
//     image: 'https://acmemkt.com/wp-content/uploads/2017/01/marketing-header.jpg',
//     body: 'Blog related to how to make this app'
// });

//////// RESTFUL ROUTES //////////
// INDEX ROUTE
app.get('/', (req, res) =>{
    res.redirect('/blogs');
});
app.get('/blogs', (req, res) => {
    Blog.find({}, (err, post) =>{
        if(err) throw err;
        res.render('index', {posts: post})
    })
});

//NEW ROUTE
app.get('/blogs/new', (req,res) =>{
    res.render('new');
});

//CREATE ROUTE
app.post('/blogs', (req, res) =>{
    req.body.post.body = req.sanitize(req.body.post.body);
    Blog.create(req.body.post, (err, newPost) =>{
        if (err) throw err;
        res.redirect('/blogs');
    });
});
//SHOW 
app.get('/blogs/:id', (req, res) =>{
    Blog.findById(req.params.id, (err, foundPost) => {
        if (err) throw err;
        res.render('singlePost', {post: foundPost});
    })
});
//EDIT ROUTE
app.get('/blogs/:id/edit', (req, res) =>{
    Blog.findById(req.params.id, (err, foundPost) =>{
        if (err) throw err;
        res.render('edit', {post: foundPost})
    })
});
//UPDATE ROUTE
app.put('/blogs/:id', (req, res) =>{
    Blog.findByIdAndUpdate(req.params.id, req.body.post, (err, updatePost) =>{
        if (err) throw err;
        res.redirect('/blogs/'+ req.params.id);
    })
});
//DELETE ROUTE
app.delete('/blogs/:id', (req, res) => {
    Blog.findByIdAndRemove(req.params.id, (err) => {
        if (err) throw err;
        res.redirect('/blogs');
    })
});



// SERVER LISTENING
app.listen(3000, 'localhost', () => {
    console.log('server start');
})