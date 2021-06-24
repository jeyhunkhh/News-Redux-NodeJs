import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import News from "../models/newsModels";
import { INews } from "../interface";
import dotenv from "dotenv";
import { verify } from "jsonwebtoken";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET_KEY || "";

export const NewsRouter = express.Router();

async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token) {
    try {
      const userPayload = await verify(token, JWT_SECRET);
      if (userPayload) {
        next();
      }
    } catch (error) {
      res.status(401).json({
        errors: error.message,
      });
    }
  } else {
    res.status(401).json({
      errors: ["not allowed"],
    });
  }
}

NewsRouter.use(cors());

// Get
NewsRouter.get("/", async (req, res) => {
  try {
    const news = await News.find();
    res.status(200).json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// getById
NewsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      res.status(404).json({ message: "Not found" });
    } else {
      res.json(news);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create
NewsRouter.post("/", requireAuth, async function (req, res) {
  const reqPayload: INews = req.body;
  const news = new News(reqPayload);

  try {
    const insertedNews = await news.save();
    res.status(201).json(insertedNews);
  } catch (error) {
    res.status(422).json({ message: error.message });
  }

  res.sendStatus(201);
});

// Update
NewsRouter.patch("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    let news = await News.findById(id);
    if (!news) {
      res.status(404).json({ message: "Not found" });
    } else {
      await News.findByIdAndUpdate(id, req.body, {
        useFindAndModify: true,
      });
      news = await News.findById(id);
      res.json(news);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete
NewsRouter.delete("/:id", requireAuth, async function (req, res) {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      res.sendStatus(404);
    } else {
      await news.remove();
      res.sendStatus(204);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});