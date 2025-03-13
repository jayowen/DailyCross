import {
  users, type User, type InsertUser,
  content, type Content, type InsertContent,
  prayerRequests, type PrayerRequest, type InsertPrayerRequest,
  discussions, type Discussion, type InsertDiscussion,
  events, type Event, type InsertEvent,
  achievements, type Achievement, type InsertAchievement,
  userAchievements, type UserAchievement, type InsertUserAchievement,
  churches, type Church, type InsertChurch,
  campuses, type Campus, type InsertCampus
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
  
  // Church related methods
  createChurch(church: InsertChurch): Promise<Church>;
  getChurch(id: number): Promise<Church | undefined>;
  getAllChurches(): Promise<Church[]>;
  createCampus(campus: InsertCampus): Promise<Campus>;
  getCampuses(churchId: number): Promise<Campus[]>;
  
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
  private churches: Map<number, Church>;
  private campuses: Map<number, Campus>;
  
  currentUserId: number;
  currentContentId: number;
  currentPrayerRequestId: number;
  currentDiscussionId: number;
  currentEventId: number;
  currentAchievementId: number;
  currentUserAchievementId: number;
  currentChurchId: number;
  currentCampusId: number;
  
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.content = new Map();
    this.prayerRequests = new Map();
    this.discussions = new Map();
    this.events = new Map();
    this.achievements = new Map();
    this.userAchievements = new Map();
    this.churches = new Map();
    this.campuses = new Map();
    
    this.currentUserId = 1;
    this.currentContentId = 1;
    this.currentPrayerRequestId = 1;
    this.currentDiscussionId = 1;
    this.currentEventId = 1;
    this.currentAchievementId = 1;
    this.currentUserAchievementId = 1;
    this.currentChurchId = 1;
    this.currentCampusId = 1;
    
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
    
    // Create some churches
    const graceChurch: InsertChurch = {
      name: "Grace Community Church",
      description: "A vibrant community of believers dedicated to sharing the love of Christ through worship, teaching, and community service.",
      location: "Atlanta, GA",
      logoUrl: "https://placehold.co/400x400/333/FFF?text=GCC",
      websiteUrl: "https://www.gracecommunity.church",
      denomination: "Non-denominational",
      numberOfCampuses: 3,
      leadPastorName: "Dr. Michael Johnson",
      leadPastorBio: "Dr. Johnson has been leading Grace Community Church for over 15 years. He holds a doctorate in Biblical Theology and is dedicated to teaching God's Word with clarity and relevance.",
      leadPastorImageUrl: "https://placehold.co/400x400/333/FFF?text=MJ",
      streamingUrl: "https://www.gracecommunity.church/live",
      streamingDays: ["Sunday"],
      streamingTimes: ["9:00 AM", "11:00 AM", "6:00 PM"]
    };
    
    const livingWaters: InsertChurch = {
      name: "Living Waters Fellowship",
      description: "A family-focused church committed to helping people grow in their faith journey through Bible-based teaching and discipleship.",
      location: "Nashville, TN",
      logoUrl: "https://placehold.co/400x400/333/FFF?text=LWF",
      websiteUrl: "https://www.livingwatersfellowship.org",
      denomination: "Baptist",
      numberOfCampuses: 1,
      leadPastorName: "Pastor James Wilson",
      leadPastorBio: "Pastor Wilson founded Living Waters Fellowship in 2005 with a vision to create a church that feels like family. His practical teaching style makes the Bible accessible to people of all backgrounds.",
      leadPastorImageUrl: "https://placehold.co/400x400/333/FFF?text=JW",
      streamingUrl: "https://www.livingwatersfellowship.org/livestream",
      streamingDays: ["Sunday", "Wednesday"],
      streamingTimes: ["10:30 AM", "7:00 PM"]
    };
    
    const newLifeChurch: InsertChurch = {
      name: "New Life Church",
      description: "A multicultural church with a passion for worship, community engagement, and global missions.",
      location: "Houston, TX",
      logoUrl: "https://placehold.co/400x400/333/FFF?text=NLC",
      websiteUrl: "https://www.newlifechurch.com",
      denomination: "Evangelical",
      numberOfCampuses: 5,
      leadPastorName: "Pastor Sarah Reynolds",
      leadPastorBio: "Pastor Sarah has led New Life Church for 10 years, bringing a fresh perspective to biblical teaching. Her heart for social justice and community transformation has inspired the church's numerous outreach programs.",
      leadPastorImageUrl: "https://placehold.co/400x400/333/FFF?text=SR",
      streamingUrl: "https://www.newlifechurch.com/watch",
      streamingDays: ["Sunday", "Tuesday", "Thursday"],
      streamingTimes: ["8:00 AM", "10:30 AM", "7:00 PM"]
    };
    
    const church1 = this.createChurch(graceChurch);
    const church2 = this.createChurch(livingWaters);
    const church3 = this.createChurch(newLifeChurch);
    
    // Add campuses for Grace Community Church
    this.createCampus({
      churchId: 1,
      name: "Downtown Campus",
      address: "123 Main Street",
      city: "Atlanta",
      state: "GA",
      zipCode: "30303",
      serviceSchedule: ["Sunday 9:00 AM", "Sunday 11:00 AM", "Wednesday 7:00 PM"]
    });
    
    this.createCampus({
      churchId: 1,
      name: "North Campus",
      address: "456 Northridge Pkwy",
      city: "Roswell",
      state: "GA",
      zipCode: "30076",
      serviceSchedule: ["Sunday 9:30 AM", "Sunday 11:30 AM"]
    });
    
    this.createCampus({
      churchId: 1,
      name: "East Campus",
      address: "789 Eastlake Blvd",
      city: "Decatur",
      state: "GA",
      zipCode: "30030",
      serviceSchedule: ["Sunday 10:00 AM", "Thursday 7:00 PM"]
    });
    
    // Add campus for Living Waters
    this.createCampus({
      churchId: 2,
      name: "Main Campus",
      address: "321 Riverfront Ave",
      city: "Nashville",
      state: "TN",
      zipCode: "37203",
      serviceSchedule: ["Sunday 10:30 AM", "Wednesday 7:00 PM"]
    });
    
    // Add campuses for New Life Church
    this.createCampus({
      churchId: 3,
      name: "Central Campus",
      address: "555 New Life Way",
      city: "Houston",
      state: "TX",
      zipCode: "77002",
      serviceSchedule: ["Sunday 8:00 AM", "Sunday 10:30 AM", "Tuesday 7:00 PM"]
    });
    
    this.createCampus({
      churchId: 3,
      name: "West Campus",
      address: "888 Westheimer Rd",
      city: "Houston",
      state: "TX",
      zipCode: "77056",
      serviceSchedule: ["Sunday 9:00 AM", "Sunday 11:00 AM", "Thursday 7:00 PM"]
    });
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
  
  // Church methods
  async createChurch(church: InsertChurch): Promise<Church> {
    const id = this.currentChurchId++;
    const timestamp = new Date();
    const newChurch: Church = { ...church, id, createdAt: timestamp };
    this.churches.set(id, newChurch);
    return newChurch;
  }
  
  async getChurch(id: number): Promise<Church | undefined> {
    return this.churches.get(id);
  }
  
  async getAllChurches(): Promise<Church[]> {
    return Array.from(this.churches.values());
  }
  
  async createCampus(campus: InsertCampus): Promise<Campus> {
    const id = this.currentCampusId++;
    const newCampus: Campus = { ...campus, id };
    this.campuses.set(id, newCampus);
    return newCampus;
  }
  
  async getCampuses(churchId: number): Promise<Campus[]> {
    return Array.from(this.campuses.values())
      .filter(campus => campus.churchId === churchId);
  }
}

export const storage = new MemStorage();
