"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Loader2,
  Clapperboard,
  Folder,
  MessageSquare,
  FileText,
  Send,
  User,
  Sparkles,
  Edit,
  Check,
  Plus,
} from "lucide-react";

import { chatWithContext } from "@/ai/flows/chat-flow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import type { Video, Project } from "@/lib/types";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { fetchYoutubeVideos } from "@/services/youtube-service";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("AI Agents");
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());
  const [activeView, setActiveView] = useState<"search" | "project">("search");
  const [project, setProject] = useState<Project | null>(null);

  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  
  const [chatInput, setChatInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);


  const { toast } = useToast();

  const handleSearch = useCallback(async () => {
    if (!searchQuery) return;
    setIsLoadingVideos(true);
    setProject(null);
    setVideos([]);
    setSelectedVideos(new Set());
    setActiveView("search");
    try {
      const fetchedVideos = await fetchYoutubeVideos({ query: searchQuery });
      setVideos(fetchedVideos);
    } catch (error: any) {
      console.error("Failed to fetch videos:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unknown error occurred.",
      });
    } finally {
      setIsLoadingVideos(false);
    }
  }, [searchQuery, toast]);

  const handleToggleVideoSelection = (videoId: string) => {
    setSelectedVideos((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(videoId)) {
        newSelection.delete(videoId);
      } else {
        newSelection.add(videoId);
      }
      return newSelection;
    });
  };

  const handleCreateProject = () => {
    if (selectedVideos.size === 0) {
      toast({
        variant: "destructive",
        title: "No videos selected",
        description: "Please select at least one video to create a project.",
      });
      return;
    }
    const projectVideos = videos.filter((v) => selectedVideos.has(v.id));
    const newProject = {
      id: `proj-${Date.now()}`,
      name: `New Project - ${new Date().toLocaleDateString()}`,
      videos: projectVideos,
      chatHistory: [],
      notes: "",
    };
    setProject(newProject);
    setNewProjectName(newProject.name);
    setActiveView("project");
  };

  const handleRenameProject = () => {
    if (project && isRenaming) {
        setProject({...project, name: newProjectName});
        setIsRenaming(false);
        toast({
            title: "Project renamed",
            description: `Your project is now called "${newProjectName}".`,
        })
    } else {
        setIsRenaming(true);
    }
  }

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || !project) return;

    const userMessage = { role: 'user' as const, content: chatInput };
    const newHistory = [...project.chatHistory, userMessage];

    setProject({ ...project, chatHistory: newHistory });
    setChatInput("");
    setIsStreaming(true);

    console.log('Sending chat message:', {
        prompt: chatInput,
        videosCount: project.videos.length,
        firstVideoTitle: project.videos[0]?.title,
        firstVideoCommentsCount: project.videos[0]?.comments?.length
    });

    try {
        const response = await chatWithContext({ prompt: chatInput, videos: project.videos });

        console.log('Chat response received:', {
            responseLength: response?.length || 0,
            responsePreview: response?.substring(0, 100)
        });

        const modelMessage = { role: 'model' as const, content: response };
        setProject(prev => prev ? { ...prev, chatHistory: [...newHistory, modelMessage] } : null);

    } catch (error: any) {
        console.error("Chat error details:", {
            message: error?.message,
            stack: error?.stack,
            fullError: error
        });
        toast({
            variant: "destructive",
            title: "Chat Error",
            description: error?.message || "An error occurred while communicating with the AI.",
        });
        // Remove the user's message if the API call fails
        setProject(prev => prev ? { ...prev, chatHistory: project.chatHistory } : null);
    } finally {
        setIsStreaming(false);
    }
  };
  
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
    });
  }, [project?.chatHistory]);


  const videoListSkeletons = useMemo(
    () =>
      Array(4)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex items-center space-x-4 mb-4">
            <Skeleton className="h-[72px] w-[128px] rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        )),
    []
  );

  return (
    <div className="grid md:grid-cols-[450px_1fr] min-h-screen bg-background">
      <div className="flex flex-col border-r border-border">
        <header className="p-4 border-b border-border flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icons.logo className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Tube Insights
            </h1>
          </div>
        </header>

        <div className="p-4 space-y-4">
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter AI keywords (e.g. 'LLM')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="bg-card"
            />
            <Button onClick={handleSearch} disabled={isLoadingVideos}>
              {isLoadingVideos ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="sr-only">Search</span>
            </Button>
          </div>
          {videos.length > 0 && (
            <Button
              onClick={handleCreateProject}
              disabled={selectedVideos.size === 0}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Project ({selectedVideos.size})
            </Button>
          )}
        </div>

        <ScrollArea className="flex-1 px-4">
          <div className="pr-4">
            {isLoadingVideos
              ? videoListSkeletons
              : videos.map((video) => (
                  <Card
                    key={video.id}
                    className={cn(
                      "mb-3 transition-all duration-200 cursor-pointer hover:border-primary",
                      selectedVideos.has(video.id) &&
                        "border-primary shadow-lg shadow-primary/10"
                    )}
                    onClick={() => handleToggleVideoSelection(video.id)}
                  >
                    <CardContent className="p-3 flex items-start gap-4">
                      <Checkbox
                        checked={selectedVideos.has(video.id)}
                        onCheckedChange={() =>
                          handleToggleVideoSelection(video.id)
                        }
                        className="mt-1"
                        aria-label={`Select video ${video.title}`}
                      />
                      <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        width={128}
                        height={72}
                        className="rounded-md aspect-video object-cover"
                        data-ai-hint="ai technology"
                      />
                      <div>
                        <p className="font-semibold leading-snug line-clamp-2">
                          {video.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {video.channel}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </ScrollArea>
      </div>

      <main className="flex flex-col">
        <div className="flex-1 p-6">
          {activeView === "search" && !project && (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <Clapperboard className="mx-auto h-16 w-16 text-muted-foreground" />
                <h2 className="mt-4 text-2xl font-semibold">
                  Welcome to Tube Insights
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Search for videos and select them to start a new project.
                </p>
              </div>
            </div>
          )}

          {activeView === "project" && project && (
            <div className="max-w-4xl mx-auto h-full flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <Folder className="h-10 w-10 text-primary" />
                <div className="flex-1">
                  {isRenaming ? (
                     <div className="flex items-center gap-2">
                        <Input 
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRenameProject()}
                            className="text-2xl font-bold p-0 border-0 shadow-none focus-visible:ring-0 h-auto"
                        />
                        <Button size="icon" variant="ghost" onClick={handleRenameProject}>
                            <Check className="h-5 w-5"/>
                        </Button>
                     </div>
                  ) : (
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold">{project.name}</h2>
                        <Button size="icon" variant="ghost" onClick={handleRenameProject}>
                            <Edit className="h-5 w-5"/>
                        </Button>
                    </div>
                  )}
                  <p className="text-muted-foreground">
                    {project.videos.length} videos in this project
                  </p>
                </div>
              </div>

              <Tabs defaultValue="chat" className="w-full flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-3 bg-card border">
                  <TabsTrigger value="chat">
                    <MessageSquare className="mr-2" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="notes">
                    <FileText className="mr-2" />
                    Notes
                  </TabsTrigger>
                  <TabsTrigger value="videos">
                    <Clapperboard className="mr-2" />
                    Videos
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="chat" className="mt-4 flex-1 flex flex-col">
                  <Card className="bg-card/50 flex-1 flex flex-col">
                    <CardHeader>
                      <CardTitle>Chat with your videos</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-4">
                        <ScrollArea className="flex-1 pr-4" ref={chatContainerRef}>
                            <div className="space-y-6">
                                {project.chatHistory.map((msg, index) => (
                                    <div key={index} className={cn("flex items-start gap-3", msg.role === 'user' ? 'justify-end' : '')}>
                                        {msg.role === 'model' && (
                                            <Avatar className="w-8 h-8 border border-primary/20">
                                                <AvatarFallback><Sparkles className="w-4 h-4 text-primary"/></AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className={cn("rounded-lg px-4 py-3 max-w-[80%]", msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                        </div>
                                         {msg.role === 'user' && (
                                            <Avatar className="w-8 h-8">
                                                <AvatarFallback><User/></AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                ))}
                                {isStreaming && (
                                     <div className="flex items-start gap-3">
                                        <Avatar className="w-8 h-8 border border-primary/20">
                                            <AvatarFallback><Sparkles className="w-4 h-4 text-primary"/></AvatarFallback>
                                        </Avatar>
                                        <div className="rounded-lg px-4 py-3 bg-muted">
                                            <Loader2 className="h-5 w-5 animate-spin text-primary"/>
                                        </div>
                                     </div>
                                )}
                            </div>
                        </ScrollArea>
                        <div className="flex items-center gap-2 mt-auto pt-4 border-t">
                            <Input 
                                placeholder="Ask about the video comments..."
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !isStreaming && handleSendChatMessage()}
                                disabled={isStreaming}
                            />
                            <Button onClick={handleSendChatMessage} disabled={isStreaming || !chatInput.trim()}>
                                {isStreaming ? <Loader2 className="animate-spin" /> : <Send />}
                            </Button>
                        </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="notes" className="mt-4">
                  <Card className="bg-card/50">
                    <CardHeader>
                      <CardTitle>Project Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Start typing your notes here..."
                        className="min-h-[300px]"
                        value={project.notes}
                        onChange={(e) => setProject({...project, notes: e.target.value})}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="videos" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.videos.map((video) => (
                      <Card key={video.id} className="bg-card/50">
                        <CardContent className="p-3 flex items-start gap-4">
                          <Image
                            src={video.thumbnailUrl}
                            alt={video.title}
                            width={128}
                            height={72}
                            className="rounded-md aspect-video object-cover"
                            data-ai-hint="ai technology"
                          />
                          <div>
                            <p className="font-semibold leading-snug line-clamp-2">
                              {video.title}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {video.channel}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
