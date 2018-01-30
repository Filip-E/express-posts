const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');

app.listen(process.env.PORT || 3001, () => {
  console.log('Listening on port 3001');
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

// Redirect to posts
app.get('/', (req, res) => {
   res.redirect('/posts');
});

// List all posts
app.get('/posts', (req, res) => {
	request('http://jsonplaceholder.typicode.com/posts', function(error, response, body){
		 if (error) return console.log(error);
		 var json = JSON.parse(body);
		 res.render('posts.ejs', {posts: json});
	});
});

// Show the search form
app.get('/search', (req, res) => {
	res.render('search.ejs', { post: '' });
});

// Find all comments for post
app.post('/search', (req, res) => {
	 var query = { title: req.body.title }
		request('http://jsonplaceholder.typicode.com/posts', function(error, response, body){
			 if (error) return console.log(error);
			 var json = JSON.parse(body);
			 for(i = 0; i < json.length; i++){
				 if(json[i].title == query.title){
					 var url = 'http://jsonplaceholder.typicode.com/post/' + json[i].id + '/comments';
					 request(url, function(err, resp, bod){
						 var commentsJSON = JSON.parse(bod);
						 res.render('search_result.ejs', {comments: commentsJSON}); 
					 });
				 } 
				 
			 }
		});
});
