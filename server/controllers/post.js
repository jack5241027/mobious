import parse from 'co-busboy';
import fs from 'fs';


exports.index = function *() {

  let posts = yield models.Post.findAll()

  this.body = {posts}
};

exports.get = function *() {

  let postId = this.params.id;

  let post = yield models.Post.findById(postId);

  this.body = {post}
};


exports.create = function *() {

  let newPost = this.request.body;

  let result = null;

  try {
    result = yield models.Post.create(newPost);
  } catch (e) {
    console.error("create post error", e);
  }

  let post = result;

  this.body = {post}
};

exports.update = function *() {

  let editPost = this.request.body;

  let UserId = services.user.getAuthStatus(this).sessionUser.id;

  let result = null;

  try {
    let post = yield models.Post.findById(editPost.id);
    post.title=editPost.title;
    post.content=editPost.content;
    post.UserId = UserId;
    result = yield post.save();
  } catch (e) {
    console.error("delete post error", e);
  }
  this.body = {result}
};


exports.upload = function* (next) {
/*
Code taken from https://github.com/koajs/examples/blob/master/upload/index.js
*/
  if ('POST' != this.method) return yield next;

  try {

    var parts = parse(this);
    var part;
    console.log(parts);
    let fileNames = {};

    while (part = yield parts) {
      var stream = fs.createWriteStream('/tmp/upload/' + part.filename);
      part.pipe(stream);
      console.log('uploading %s -> %s', part.filename, stream.path);

      fileNames[part.filename] = stream.path;
    }
  } catch (e) {
      console.log(e);
  }

  this.body = {fileNames}
  // yield* this.render('index', {
  //   fileNames: fileNames
  // });
};



exports.delete = function *() {

  let postId = this.params.id;

  let result = null;

  try {
    let post = yield models.Post.findById(postId);
    result = post.destroy()
  } catch (e) {
    console.error("delete post error", e);
  }

  this.body = {result}
};
