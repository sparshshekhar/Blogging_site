const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const authMiddleware = require("../middleware/authMiddleware");

// ================= CREATE BLOG =================
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const blog = new Blog({
      ...req.body,
      userId: req.user.userId,
    });

    await blog.save();

    res.json({ message: "Blog created", blog });
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================= GET PUBLIC BLOGS =================
router.get("/public", async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublic: true });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= GET MY BLOGS =================
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const blogs = await Blog.find({ userId: req.user.userId });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= UPDATE BLOG =================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(blog, req.body);
    await blog.save();

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= DELETE BLOG =================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    console.log("DELETE HIT");
    console.log("USER:", req.user);

    const blog = await Blog.findById(req.params.id);

    console.log("BLOG USER:", blog?.userId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.userId.toString() !== req.user.userId) {
      console.log("NOT AUTHORIZED");
      return res.status(403).json({ message: "Not authorized" });
    }

    await blog.deleteOne();

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

//AI GENERATED BLOG
const axios = require("axios");

router.post("/generate", authMiddleware, async (req, res) => {
  const { topic } = req.body;

  const fakeContent = `This is an AI-generated blog about ${topic}.

${topic} is an interesting subject that involves multiple aspects...
`;

  res.json({ content: fakeContent });
});

// LIKE BLOG
router.put("/:id/like", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    blog.likes += 1;

    await blog.save();

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// COMMENT BLOG
router.post("/:id/comment", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    blog.comments.push({
      text: req.body.text,
      userId: req.user.userId,
    });

    await blog.save();

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SEARCH BLOGS
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    const blogs = await Blog.find({
      title: { $regex: q, $options: "i" }, // 🔥 case-insensitive
      isPublic: true,
    });

    res.json(blogs);
  } catch (err) {
    console.log("SEARCH ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
