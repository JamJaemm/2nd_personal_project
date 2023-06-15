const express = require('express');
const mongoose = require('mongoose');

// MongoDB 연결 설정
mongoose.connect('mongodb://localhost/blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB 연결 오류:'));
db.once('open', () => {
  console.log('MongoDB에 연결되었습니다.');
});

// 블로그 포스트 스키마 정의
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

// 블로그 포스트 모델 생성
const Post = mongoose.model('Post', postSchema);

const app = express();
app.use(express.json());

// 블로그 포스트 목록 조회
app.get('/posts', (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: '서버 오류' });
    } else {
      res.json(posts);
    }
  });
});

// 블로그 포스트 생성
app.post('/posts', (req, res) => {
  const { title, content } = req.body;
  const newPost = new Post({ title, content });
  newPost.save((err, post) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: '서버 오류' });
    } else {
      res.status(201).json(post);
    }
  });
});

// 특정 블로그 포스트 조회
app.get('/posts/:id', (req, res) => {
  const postId = req.params.id;
  Post.findById(postId, (err, post) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: '서버 오류' });
    } else if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: '포스트를 찾을 수 없습니다.' });
    }
  });
});

// 블로그 포스트 삭제
app.delete('/posts/:id', (req, res) => {
  const postId = req.params.id;
  Post.findByIdAndDelete(postId, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: '서버 오류' });
    } else {
      res.sendStatus(204);
    }
  });
});

// 서버 시작
const port = 3000;
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
