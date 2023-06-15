const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// 블로그 포스트 목록 조회
router.get('/', (req, res) => {
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
router.post('/', (req, res) => {
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
router.get('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
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

module.exports = router;
