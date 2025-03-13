import {
  users, type User, type InsertUser,
  content, type Content, type InsertContent,
  prayerRequests, type PrayerRequest, type InsertPrayerRequest,
  discussions, type Discussion, type InsertDiscussion,
  events, type Event, type InsertEvent,
  achievements, type Achievement, type InsertAchievement,
  userAchievements, type UserAchievement, type InsertUserAchievement
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User related methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserProgress(id: number, levelProgress: number): Promise<User | undefined>;
  
  // Content related methods
  createContent(contentItem: InsertContent): Promise<Content>;
  getContent(id: number): Promise<Content | undefined>;
  getContentByType(type: string): Promise<Content[]>;
  getAllContent(): Promise<Content[]>;
  
  // Prayer request related methods
  createPrayerRequest(request: InsertPrayerRequest): Promise<PrayerRequest>;
  getPrayerRequests(): Promise<PrayerRequest[]>;
  updatePrayerCount(id: number, count: number): Promise<PrayerRequest | undefined>;
  
  // Discussion related methods
  createDiscussion(discussion: InsertDiscussion): Promise<Discussion>;
  getDiscussions(): Promise<Discussion[]>;
  
  // Event related methods
  createEvent(event: InsertEvent): Promise<Event>;
  getEvents(): Promise<Event[]>;
  
  // Achievement related methods
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getAchievements(): Promise<Achievement[]>;
  awardAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement>;
  getUserAchievements(userId: number): Promise<Achievement[]>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private content: Map<number, Content>;
  private prayerRequests: Map<number, PrayerRequest>;
  private discussions: Map<number, Discussion>;
  private events: Map<number, Event>;
  private achievements: Map<number, Achievement>;
  private userAchievements: Map<number, UserAchievement>;
  
  currentUserId: number;
  currentContentId: number;
  currentPrayerRequestId: number;
  currentDiscussionId: number;
  currentEventId: number;
  currentAchievementId: number;
  currentUserAchievementId: number;
  
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.content = new Map();
    this.prayerRequests = new Map();
    this.discussions = new Map();
    this.events = new Map();
    this.achievements = new Map();
    this.userAchievements = new Map();
    
    this.currentUserId = 1;
    this.currentContentId = 1;
    this.currentPrayerRequestId = 1;
    this.currentDiscussionId = 1;
    this.currentEventId = 1;
    this.currentAchievementId = 1;
    this.currentUserAchievementId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Initialize with some achievements
    this.initializeData();
  }
  
  private initializeData() {
    // Create achievements
    const scriptureReader: InsertAchievement = {
      name: "Scripture Reader",
      description: "Read at least 10 Bible passages",
      icon: "book",
      criteria: "Read 10 passages"
    };
    
    const communityBuilder: InsertAchievement = {
      name: "Community Builder",
      description: "Participate in at least 5 discussions",
      icon: "groups",
      criteria: "5 discussions"
    };
    
    const prayerWarrior: InsertAchievement = {
      name: "Prayer Warrior",
      description: "Pray for at least 20 prayer requests",
      icon: "volunteer_activism",
      criteria: "Pray 20 times"
    };
    
    this.createAchievement(scriptureReader);
    this.createAchievement(communityBuilder);
    this.createAchievement(prayerWarrior);
    
    // Create some events
    const sundayService: InsertEvent = {
      title: "Sunday Worship Service",
      description: "Join us for worship, prayer, and a message from Pastor Johnson on \"The Power of Community\".",
      date: new Date("2023-06-15"),
      startTime: "9:00 AM",
      endTime: "11:00 AM",
      location: "Main Sanctuary"
    };
    
    const bibleStudy: InsertEvent = {
      title: "Midweek Bible Study",
      description: "Dive deeper into the Word with our interactive Bible study on the Book of Acts.",
      date: new Date("2023-06-18"),
      startTime: "7:00 PM",
      endTime: "8:30 PM",
      location: "Fellowship Hall"
    };
    
    const outreach: InsertEvent = {
      title: "Community Outreach",
      description: "Join us as we serve our local community through the downtown food bank initiative.",
      date: new Date("2023-06-24"),
      startTime: "10:00 AM",
      endTime: "1:00 PM",
      location: "Downtown Community Center"
    };
    
    this.createEvent(sundayService);
    this.createEvent(bibleStudy);
    this.createEvent(outreach);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const timestamp = new Date();
    const user: User = { ...insertUser, id, level: 1, levelProgress: 0, createdAt: timestamp };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserProgress(id: number, levelProgress: number): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, levelProgress };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Content methods
  async createContent(contentItem: InsertContent): Promise<Content> {
    const id = this.currentContentId++;
    const timestamp = new Date();
    const newContent: Content = { ...contentItem, id, createdAt: timestamp };
    this.content.set(id, newContent);
    return newContent;
  }
  
  async getContent(id: number): Promise<Content | undefined> {
    return this.content.get(id);
  }
  
  async getContentByType(type: string): Promise<Content[]> {
    return Array.from(this.content.values()).filter(item => item.type === type);
  }
  
  async getAllContent(): Promise<Content[]> {
    return Array.from(this.content.values());
  }
  
  // Prayer request methods
  async createPrayerRequest(request: InsertPrayerRequest): Promise<PrayerRequest> {
    const id = this.currentPrayerRequestId++;
    const timestamp = new Date();
    const prayerRequest: PrayerRequest = { 
      ...request, 
      id, 
      createdAt: timestamp,
      prayerCount: 0,
      commentCount: 0
    };
    this.prayerRequests.set(id, prayerRequest);
    return prayerRequest;
  }
  
  async getPrayerRequests(): Promise<PrayerRequest[]> {
    return Array.from(this.prayerRequests.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async updatePrayerCount(id: number, count: number): Promise<PrayerRequest | undefined> {
    const prayerRequest = this.prayerRequests.get(id);
    if (!prayerRequest) return undefined;
    
    const updatedRequest = { ...prayerRequest, prayerCount: count };
    this.prayerRequests.set(id, updatedRequest);
    return updatedRequest;
  }
  
  // Discussion methods
  async createDiscussion(discussion: InsertDiscussion): Promise<Discussion> {
    const id = this.currentDiscussionId++;
    const timestamp = new Date();
    const newDiscussion: Discussion = { 
      ...discussion, 
      id, 
      createdAt: timestamp,
      replyCount: 0
    };
    this.discussions.set(id, newDiscussion);
    return newDiscussion;
  }
  
  async getDiscussions(): Promise<Discussion[]> {
    return Array.from(this.discussions.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  // Event methods
  async createEvent(event: InsertEvent): Promise<Event> {
    const id = this.currentEventId++;
    const newEvent: Event = { ...event, id };
    this.events.set(id, newEvent);
    return newEvent;
  }
  
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).sort((a, b) => 
      a.date.getTime() - b.date.getTime());
  }
  
  // Achievement methods
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const id = this.currentAchievementId++;
    const newAchievement: Achievement = { ...achievement, id };
    this.achievements.set(id, newAchievement);
    return newAchievement;
  }
  
  async getAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }
  
  async awardAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement> {
    const id = this.currentUserAchievementId++;
    const timestamp = new Date();
    const newUserAchievement: UserAchievement = { 
      ...userAchievement, 
      id, 
      dateEarned: timestamp 
    };
    this.userAchievements.set(id, newUserAchievement);
    return newUserAchievement;
  }
  
  async getUserAchievements(userId: number): Promise<Achievement[]> {
    const userAchievementIds = Array.from(this.userAchievements.values())
      .filter(ua => ua.userId === userId)
      .map(ua => ua.achievementId);
    
    return Array.from(this.achievements.values())
      .filter(achievement => userAchievementIds.includes(achievement.id));
  }
}

export const storage = new MemStorage();
