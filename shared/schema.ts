import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  church: text("church"),
  level: integer("level").default(1),
  levelProgress: integer("level_progress").default(0),
  role: text("role").default("member"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  church: true,
  role: true,
});

// Content model (sermons, bible studies, devotionals)
export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // sermon, biblestudy, devotional
  duration: integer("duration"), // in minutes
  parts: integer("parts").default(1),
  thumbnailUrl: text("thumbnail_url"),
  content: text("content").notNull(),
  authorId: integer("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  tags: text("tags").array(),
});

export const insertContentSchema = createInsertSchema(content).pick({
  title: true,
  description: true,
  type: true,
  duration: true,
  parts: true,
  thumbnailUrl: true,
  content: true,
  authorId: true,
  tags: true,
});

// Prayer Requests model
export const prayerRequests = pgTable("prayer_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  prayerCount: integer("prayer_count").default(0),
  commentCount: integer("comment_count").default(0),
});

export const insertPrayerRequestSchema = createInsertSchema(prayerRequests).pick({
  userId: true,
  content: true,
});

// Discussions model
export const discussions = pgTable("discussions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  replyCount: integer("reply_count").default(0),
});

export const insertDiscussionSchema = createInsertSchema(discussions).pick({
  title: true,
  category: true,
  userId: true,
});

// Events model
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  location: text("location").notNull(),
});

export const insertEventSchema = createInsertSchema(events).pick({
  title: true,
  description: true,
  date: true,
  startTime: true,
  endTime: true,
  location: true,
});

// Achievements model
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  criteria: text("criteria").notNull(),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  achievementId: integer("achievement_id").notNull(),
  dateEarned: timestamp("date_earned").defaultNow(),
});

export const insertAchievementSchema = createInsertSchema(achievements).pick({
  name: true,
  description: true,
  icon: true,
  criteria: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).pick({
  userId: true,
  achievementId: true,
});

// Types for use in application
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Content = typeof content.$inferSelect;
export type InsertContent = z.infer<typeof insertContentSchema>;

export type PrayerRequest = typeof prayerRequests.$inferSelect;
export type InsertPrayerRequest = z.infer<typeof insertPrayerRequestSchema>;

export type Discussion = typeof discussions.$inferSelect;
export type InsertDiscussion = z.infer<typeof insertDiscussionSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
