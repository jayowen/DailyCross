import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { MobileNav } from "@/components/ui/mobile-nav";
import { PrayerRequest } from "@/components/dashboard/prayer-request";
import { DiscussionItem } from "@/components/dashboard/discussion-item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PrayerRequest as PrayerRequestType, Discussion as DiscussionType } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function CommunityPage() {
  const { user } = useAuth();
  const [isPrayerDialogOpen, setPrayerDialogOpen] = useState(false);
  const [isDiscussionDialogOpen, setDiscussionDialogOpen] = useState(false);
  
  const { data: prayerRequests } = useQuery<PrayerRequestType[]>({
    queryKey: ["/api/prayer-requests"],
  });

  const { data: discussions } = useQuery<DiscussionType[]>({
    queryKey: ["/api/discussions"],
  });

  // Create prayer request form
  const prayerRequestSchema = z.object({
    content: z.string().min(5, "Prayer request must be at least 5 characters"),
  });

  const prayerRequestForm = useForm<z.infer<typeof prayerRequestSchema>>({
    resolver: zodResolver(prayerRequestSchema),
    defaultValues: {
      content: "",
    },
  });

  const createPrayerRequestMutation = useMutation({
    mutationFn: async (data: z.infer<typeof prayerRequestSchema>) => {
      const res = await apiRequest("POST", "/api/prayer-requests", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prayer-requests"] });
      prayerRequestForm.reset();
      setPrayerDialogOpen(false);
    },
  });

  // Create discussion form
  const discussionSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    category: z.string().min(1, "Please select a category"),
  });

  const discussionForm = useForm<z.infer<typeof discussionSchema>>({
    resolver: zodResolver(discussionSchema),
    defaultValues: {
      title: "",
      category: "",
    },
  });

  const createDiscussionMutation = useMutation({
    mutationFn: async (data: z.infer<typeof discussionSchema>) => {
      const res = await apiRequest("POST", "/api/discussions", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/discussions"] });
      discussionForm.reset();
      setDiscussionDialogOpen(false);
    },
  });

  // Function to format time ago
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  // Get user from a userId (mock data since we don't have a full user list)
  const getUserName = (userId: number) => {
    const mockUsers = [
      { id: 1, name: "Sarah Mitchell", initials: "SM" },
      { id: 2, name: "James Thompson", initials: "JT" },
      { id: 3, name: "Lisa Johnson", initials: "LJ" },
      { id: 4, name: "Pastor Mike", initials: "PM" },
      { id: 5, name: "Robert Chen", initials: "RC" },
    ];
    
    const mockUser = mockUsers.find(u => u.id === userId) || 
                    { name: user?.displayName || "Unknown User", initials: "UN" };
    
    return mockUser;
  };

  // Get category label and color for discussions
  const getCategoryInfo = (category: string) => {
    const categories = {
      "Spiritual Disciplines": { color: "accent" as const, label: "Spiritual Disciplines" },
      "Sermon Discussion": { color: "secondary" as const, label: "Sermon Discussion" },
      "Resources": { color: "success" as const, label: "Resources" },
    };
    
    return categories[category as keyof typeof categories] || 
          { color: "accent" as const, label: category };
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex-grow flex">
        <Sidebar />
        
        <main className="flex-grow p-4 md:p-6 overflow-y-auto pb-16 md:pb-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h1 className="font-merriweather text-2xl md:text-3xl font-bold mb-4">Community</h1>
              <p className="text-gray-600 mb-4">Connect with other believers through prayer requests and discussions.</p>
              
              <Tabs defaultValue="prayer">
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="prayer">Prayer Requests</TabsTrigger>
                    <TabsTrigger value="discussions">Discussions</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="prayer" className="mt-0">
                    <Dialog open={isPrayerDialogOpen} onOpenChange={setPrayerDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="text-white bg-secondary rounded-full px-3 py-1 text-sm font-medium hover:bg-opacity-90 transition-colors flex items-center">
                          <span className="material-icons text-sm mr-1">add</span>
                          New Prayer Request
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create a Prayer Request</DialogTitle>
                          <DialogDescription>
                            Share your prayer needs with the community.
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...prayerRequestForm}>
                          <form onSubmit={prayerRequestForm.handleSubmit((data) => createPrayerRequestMutation.mutate(data))}>
                            <FormField
                              control={prayerRequestForm.control}
                              name="content"
                              render={({ field }) => (
                                <FormItem className="mb-4">
                                  <FormLabel>Your prayer request</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Share what you'd like the community to pray for..." 
                                      className="min-h-[100px]"
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <DialogFooter>
                              <Button 
                                type="submit" 
                                className="bg-secondary"
                                disabled={createPrayerRequestMutation.isPending}
                              >
                                {createPrayerRequestMutation.isPending ? "Submitting..." : "Submit Request"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </TabsContent>
                  
                  <TabsContent value="discussions" className="mt-0">
                    <Dialog open={isDiscussionDialogOpen} onOpenChange={setDiscussionDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="text-white bg-secondary rounded-full px-3 py-1 text-sm font-medium hover:bg-opacity-90 transition-colors flex items-center">
                          <span className="material-icons text-sm mr-1">add</span>
                          New Discussion
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Start a Discussion</DialogTitle>
                          <DialogDescription>
                            Create a new topic to discuss with the community.
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...discussionForm}>
                          <form onSubmit={discussionForm.handleSubmit((data) => createDiscussionMutation.mutate(data))}>
                            <FormField
                              control={discussionForm.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem className="mb-4">
                                  <FormLabel>Topic Title</FormLabel>
                                  <FormControl>
                                    <Input placeholder="What would you like to discuss?" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={discussionForm.control}
                              name="category"
                              render={({ field }) => (
                                <FormItem className="mb-4">
                                  <FormLabel>Category</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Spiritual Disciplines">Spiritual Disciplines</SelectItem>
                                      <SelectItem value="Sermon Discussion">Sermon Discussion</SelectItem>
                                      <SelectItem value="Resources">Resources</SelectItem>
                                      <SelectItem value="Bible Questions">Bible Questions</SelectItem>
                                      <SelectItem value="Christian Living">Christian Living</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <DialogFooter>
                              <Button 
                                type="submit" 
                                className="bg-secondary"
                                disabled={createDiscussionMutation.isPending}
                              >
                                {createDiscussionMutation.isPending ? "Creating..." : "Create Discussion"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </TabsContent>
                </div>
                
                <TabsContent value="prayer">
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="space-y-3">
                      {prayerRequests && prayerRequests.length > 0 ? (
                        prayerRequests.map((request) => {
                          const userInfo = getUserName(request.userId);
                          return (
                            <PrayerRequest
                              key={request.id}
                              id={request.id}
                              userId={request.userId}
                              userName={userInfo.name}
                              userInitials={userInfo.initials}
                              content={request.content}
                              timeAgo={getTimeAgo(request.createdAt)}
                              prayerCount={request.prayerCount}
                              commentCount={request.commentCount}
                            />
                          );
                        })
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          No prayer requests yet. Be the first to share one!
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="discussions">
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="space-y-3">
                      {discussions && discussions.length > 0 ? (
                        discussions.map((discussion) => {
                          const userInfo = getUserName(discussion.userId);
                          const categoryInfo = getCategoryInfo(discussion.category);
                          return (
                            <DiscussionItem
                              key={discussion.id}
                              title={discussion.title}
                              category={categoryInfo.label}
                              categoryColor={categoryInfo.color}
                              replyCount={discussion.replyCount}
                              author={userInfo.name}
                              timeAgo={getTimeAgo(discussion.createdAt)}
                            />
                          );
                        })
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          No discussions yet. Start the first conversation!
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
}
