import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { 
  insertPrayerRequestSchema, 
  insertDiscussionSchema,
  insertContentSchema,
  insertEventSchema,
  insertChurchSchema,
  insertCampusSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Content routes
  app.get("/api/content", async (req, res) => {
    try {
      const content = await storage.getAllContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.get("/api/content/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const content = await storage.getContentByType(type);
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.post("/api/content", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ error: "Unauthorized" });
      }
      
      const validatedData = insertContentSchema.parse(req.body);
      const newContent = await storage.createContent(validatedData);
      res.status(201).json(newContent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create content" });
    }
  });

  // Prayer request routes
  app.get("/api/prayer-requests", async (req, res) => {
    try {
      const prayerRequests = await storage.getPrayerRequests();
      res.json(prayerRequests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch prayer requests" });
    }
  });

  app.post("/api/prayer-requests", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const validatedData = insertPrayerRequestSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const prayerRequest = await storage.createPrayerRequest(validatedData);
      res.status(201).json(prayerRequest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create prayer request" });
    }
  });

  app.post("/api/prayer-requests/:id/pray", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const { id } = req.params;
      const prayerRequest = await storage.updatePrayerCount(parseInt(id), parseInt(req.body.count));
      
      if (!prayerRequest) {
        return res.status(404).json({ error: "Prayer request not found" });
      }
      
      res.json(prayerRequest);
    } catch (error) {
      res.status(500).json({ error: "Failed to update prayer count" });
    }
  });

  // Discussion routes
  app.get("/api/discussions", async (req, res) => {
    try {
      const discussions = await storage.getDiscussions();
      res.json(discussions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch discussions" });
    }
  });

  app.post("/api/discussions", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const validatedData = insertDiscussionSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const discussion = await storage.createDiscussion(validatedData);
      res.status(201).json(discussion);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create discussion" });
    }
  });

  // Events routes
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ error: "Unauthorized" });
      }
      
      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create event" });
    }
  });

  // Achievement routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch achievements" });
    }
  });

  app.get("/api/user-achievements", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const achievements = await storage.getUserAchievements(req.user.id);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user achievements" });
    }
  });

  app.post("/api/user-achievements", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const userAchievement = await storage.awardAchievement({
        userId: req.user.id,
        achievementId: req.body.achievementId
      });
      
      res.status(201).json(userAchievement);
    } catch (error) {
      res.status(500).json({ error: "Failed to award achievement" });
    }
  });

  // User progress
  app.post("/api/user-progress", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const user = await storage.updateUserProgress(req.user.id, req.body.levelProgress);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user progress" });
    }
  });

  // Church Directory routes
  app.get("/api/churches", async (req, res) => {
    try {
      const churches = await storage.getAllChurches();
      res.json(churches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch churches" });
    }
  });

  app.get("/api/churches/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const church = await storage.getChurch(parseInt(id));
      
      if (!church) {
        return res.status(404).json({ error: "Church not found" });
      }
      
      res.json(church);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch church" });
    }
  });

  app.post("/api/churches", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ error: "Unauthorized" });
      }
      
      const validatedData = insertChurchSchema.parse(req.body);
      const church = await storage.createChurch(validatedData);
      res.status(201).json(church);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create church" });
    }
  });

  app.get("/api/churches/:id/campuses", async (req, res) => {
    try {
      const { id } = req.params;
      const campuses = await storage.getCampuses(parseInt(id));
      res.json(campuses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch campuses" });
    }
  });

  app.post("/api/campuses", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.status(403).json({ error: "Unauthorized" });
      }
      
      const validatedData = insertCampusSchema.parse(req.body);
      const campus = await storage.createCampus(validatedData);
      res.status(201).json(campus);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create campus" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
