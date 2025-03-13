import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { MobileNav } from "@/components/ui/mobile-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Content, Event, User } from "@shared/schema";

export default function AdminPage() {
  const { user } = useAuth();
  const [isContentDialogOpen, setContentDialogOpen] = useState(false);
  const [isEventDialogOpen, setEventDialogOpen] = useState(false);
  
  // Redirect if not an admin
  if (user && user.role !== 'admin') {
    return <Redirect to="/" />;
  }
  
  const { data: content } = useQuery<Content[]>({
    queryKey: ["/api/content"],
  });
  
  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });
  
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
    queryFn: async () => {
      // Since this endpoint doesn't exist, we'll return an empty array
      // In a real app, this would be fetched from the backend
      return [];
    },
  });
  
  // Create content form
  const contentSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    type: z.string().min(1, "Please select a content type"),
    content: z.string().min(50, "Content must be at least 50 characters"),
    duration: z.number().min(1).optional(),
    parts: z.number().min(1).optional(),
    thumbnailUrl: z.string().url("Please enter a valid URL").optional(),
    tags: z.string().optional().transform(val => val ? val.split(',').map(tag => tag.trim()) : []),
  });
  
  type ContentFormValues = z.infer<typeof contentSchema>;
  
  const contentForm = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      content: "",
      thumbnailUrl: "",
      tags: "",
    },
  });
  
  const createContentMutation = useMutation({
    mutationFn: async (data: ContentFormValues) => {
      const formattedData = {
        ...data,
        authorId: user?.id || 1,
      };
      const res = await apiRequest("POST", "/api/content", formattedData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      contentForm.reset();
      setContentDialogOpen(false);
    },
  });
  
  // Create event form
  const eventSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    date: z.string().min(1, "Please select a date"),
    startTime: z.string().min(1, "Please enter a start time"),
    endTime: z.string().min(1, "Please enter an end time"),
    location: z.string().min(1, "Please enter a location"),
  });
  
  type EventFormValues = z.infer<typeof eventSchema>;
  
  const eventForm = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
    },
  });
  
  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormValues) => {
      const formattedData = {
        ...data,
        date: new Date(data.date),
      };
      const res = await apiRequest("POST", "/api/events", formattedData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      eventForm.reset();
      setEventDialogOpen(false);
    },
  });
  
  const onContentTypeChange = (value: string) => {
    if (value === "sermon" || value === "devotional") {
      contentForm.setValue("parts", undefined);
    } else if (value === "biblestudy") {
      contentForm.setValue("duration", undefined);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex-grow flex">
        <Sidebar />
        
        <main className="flex-grow p-4 md:p-6 overflow-y-auto pb-16 md:pb-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h1 className="font-merriweather text-2xl md:text-3xl font-bold mb-4">Admin Dashboard</h1>
              <p className="text-gray-600 mb-6">Manage content, events, and users for the DailyCross.com community.</p>
              
              <Tabs defaultValue="content">
                <TabsList className="mb-4">
                  <TabsTrigger value="content">Content Management</TabsTrigger>
                  <TabsTrigger value="events">Church Events</TabsTrigger>
                  <TabsTrigger value="users">User Management</TabsTrigger>
                </TabsList>
                
                {/* Content Management Tab */}
                <TabsContent value="content">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Spiritual Content</CardTitle>
                          <CardDescription>Manage sermons, Bible studies, and devotionals</CardDescription>
                        </div>
                        <Dialog open={isContentDialogOpen} onOpenChange={setContentDialogOpen}>
                          <DialogTrigger asChild>
                            <Button>
                              <span className="material-icons mr-1">add</span>
                              Add New Content
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Create New Content</DialogTitle>
                              <DialogDescription>
                                Add a new sermon, Bible study, or devotional for the community.
                              </DialogDescription>
                            </DialogHeader>
                            <Form {...contentForm}>
                              <form onSubmit={contentForm.handleSubmit((data) => createContentMutation.mutate(data))}>
                                <div className="grid gap-4 py-4">
                                  <FormField
                                    control={contentForm.control}
                                    name="title"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Enter content title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={contentForm.control}
                                    name="type"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Content Type</FormLabel>
                                        <Select 
                                          onValueChange={(value) => {
                                            field.onChange(value);
                                            onContentTypeChange(value);
                                          }}
                                          defaultValue={field.value}
                                        >
                                          <FormControl>
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select content type" />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            <SelectItem value="sermon">Sermon</SelectItem>
                                            <SelectItem value="biblestudy">Bible Study</SelectItem>
                                            <SelectItem value="devotional">Devotional</SelectItem>
                                          </SelectContent>
                                        </Select>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {contentForm.watch("type") !== "biblestudy" && (
                                      <FormField
                                        control={contentForm.control}
                                        name="duration"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Duration (minutes)</FormLabel>
                                            <FormControl>
                                              <Input 
                                                type="number" 
                                                min="1"
                                                placeholder="Duration in minutes" 
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    )}
                                    
                                    {contentForm.watch("type") === "biblestudy" && (
                                      <FormField
                                        control={contentForm.control}
                                        name="parts"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Number of Parts</FormLabel>
                                            <FormControl>
                                              <Input 
                                                type="number" 
                                                min="1"
                                                placeholder="Number of parts" 
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    )}
                                    
                                    <FormField
                                      control={contentForm.control}
                                      name="thumbnailUrl"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Thumbnail URL</FormLabel>
                                          <FormControl>
                                            <Input placeholder="https://example.com/image.jpg" {...field} />
                                          </FormControl>
                                          <FormDescription>
                                            Link to an image for this content
                                          </FormDescription>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  
                                  <FormField
                                    control={contentForm.control}
                                    name="description"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                          <Textarea 
                                            placeholder="Brief description of this content" 
                                            className="min-h-[80px]"
                                            {...field} 
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={contentForm.control}
                                    name="content"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Content Body</FormLabel>
                                        <FormControl>
                                          <Textarea 
                                            placeholder="Main content text" 
                                            className="min-h-[200px]"
                                            {...field} 
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={contentForm.control}
                                    name="tags"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Tags</FormLabel>
                                        <FormControl>
                                          <Input placeholder="faith, prayer, discipleship (comma separated)" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                          Add tags to help users find this content
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <DialogFooter>
                                  <Button 
                                    type="submit" 
                                    disabled={createContentMutation.isPending}
                                  >
                                    {createContentMutation.isPending ? "Publishing..." : "Publish Content"}
                                  </Button>
                                </DialogFooter>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {content && content.length > 0 ? (
                            content.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.title}</TableCell>
                                <TableCell>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    item.type === 'sermon' 
                                      ? 'bg-accent/10 text-accent'
                                      : item.type === 'biblestudy'
                                        ? 'bg-secondary/10 text-secondary'
                                        : 'bg-success/10 text-success'
                                  }`}>
                                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                  </span>
                                </TableCell>
                                <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="sm">
                                    <span className="material-icons text-sm">edit</span>
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <span className="material-icons text-sm">delete</span>
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                                No content available. Click "Add New Content" to create some.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Events Tab */}
                <TabsContent value="events">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Church Events</CardTitle>
                          <CardDescription>Manage upcoming church events and activities</CardDescription>
                        </div>
                        <Dialog open={isEventDialogOpen} onOpenChange={setEventDialogOpen}>
                          <DialogTrigger asChild>
                            <Button>
                              <span className="material-icons mr-1">add</span>
                              Add New Event
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Create New Event</DialogTitle>
                              <DialogDescription>
                                Add a new church event to the calendar.
                              </DialogDescription>
                            </DialogHeader>
                            <Form {...eventForm}>
                              <form onSubmit={eventForm.handleSubmit((data) => createEventMutation.mutate(data))}>
                                <div className="grid gap-4 py-4">
                                  <FormField
                                    control={eventForm.control}
                                    name="title"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Event Title</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Enter event title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={eventForm.control}
                                    name="description"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                          <Textarea 
                                            placeholder="Event description" 
                                            className="min-h-[80px]"
                                            {...field} 
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                      control={eventForm.control}
                                      name="date"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Date</FormLabel>
                                          <FormControl>
                                            <Input type="date" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    
                                    <FormField
                                      control={eventForm.control}
                                      name="location"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Location</FormLabel>
                                          <FormControl>
                                            <Input placeholder="Event location" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                      control={eventForm.control}
                                      name="startTime"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Start Time</FormLabel>
                                          <FormControl>
                                            <Input placeholder="e.g. 9:00 AM" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    
                                    <FormField
                                      control={eventForm.control}
                                      name="endTime"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>End Time</FormLabel>
                                          <FormControl>
                                            <Input placeholder="e.g. 11:00 AM" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button 
                                    type="submit" 
                                    disabled={createEventMutation.isPending}
                                  >
                                    {createEventMutation.isPending ? "Creating..." : "Create Event"}
                                  </Button>
                                </DialogFooter>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Event</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {events && events.length > 0 ? (
                            events.map((event) => (
                              <TableRow key={event.id}>
                                <TableCell className="font-medium">{event.title}</TableCell>
                                <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                                <TableCell>{`${event.startTime} - ${event.endTime}`}</TableCell>
                                <TableCell>{event.location}</TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="sm">
                                    <span className="material-icons text-sm">edit</span>
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <span className="material-icons text-sm">delete</span>
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                                No events available. Click "Add New Event" to create some.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Users Tab */}
                <TabsContent value="users">
                  <Card>
                    <CardHeader>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>View and manage community members</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Church</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users && users.length > 0 ? (
                            users.map((user) => (
                              <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.displayName}</TableCell>
                                <TableCell>{user.church || "Not specified"}</TableCell>
                                <TableCell>{user.level}</TableCell>
                                <TableCell>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    user.role === 'admin' 
                                      ? 'bg-secondary/10 text-secondary'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                  </span>
                                </TableCell>
                                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="sm">
                                    <span className="material-icons text-sm">edit</span>
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                                No users available yet.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
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
