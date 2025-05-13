import React, { useState } from "react";
import ReactPlayer from "react-player/youtube";
import { MainNav } from "@/components/navigation/MainNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type VideoItem = {
  id: string;
  title: string;
  isPlaylist?: boolean;
};

const videos: VideoItem[] = [
  { id: "_71ENYohRiE", title: "Array" },
  { id: "eeUUFDN0yyI", title: "LinkedList" },
  { id: "Dt6gzsNrghQ", title: "String" },
  { id: "jxTyXvCNkL4", title: "Stack" },
  { id: "BLE6FwwmlUQ", title: "Tree" },
  { id: "_et0UKwhozU", title: "Backtracking" },
  { id: "h30dpA8_rsQ", title: "Heap" },
  { id: "HBON-ooIygo", title: "Dynamic Programming" },
  { id: "TDjuWLwDPLQ", title: "Binary Search" },
  { id: "QdMUBiTC2bM", title: "Sorting" },
  { id: "Gl9u9LRXpMY", title: "Greedy Algorithm" },
  { id: "HiT28-kHW3A", title: "Maths for DSA" },
  { id: "RxAPGNpb6cc", title: "2D Programming" },
  { id: "NIqTEUeBXGE", title: "Recursion" },
  { id: "GLTR39VIAdc", title: "DSA Patterns" },
  
];

const YouTubeGalleryPage: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [search, setSearch] = useState("");

  const getThumbnailUrl = (videoId: string, isPlaylist = false) => {
    return isPlaylist
      ? `https://img.youtube.com/vi/${videoId.split(",")[0]}/0.jpg`
      : `https://img.youtube.com/vi/${videoId}/0.jpg`;
  };

  const buildUrl = (video: VideoItem) => {
    return video.isPlaylist
      ? `https://www.youtube.com/playlist?list=${video.id}`
      : `https://www.youtube.com/watch?v=${video.id}`;
  };

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 animate-fadeIn">
        <div className="max-w-4xl w-full">
          
          {!selectedVideo ? (
            <>
              <div className="mb-8 flex justify-center">
                <Input
                  type="text"
                  placeholder="Search videos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full max-w-md bg-card border border-border focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredVideos.length === 0 ? (
                  <div className="col-span-full text-center text-muted-foreground py-12">
                    No videos found.
                  </div>
                ) : (
                  filteredVideos.map((video) => (
                    <div
                      key={video.id}
                      className="cursor-pointer bg-card border hover:bg-card/80 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition flex flex-col"
                      onClick={() => setSelectedVideo(video)}
                    >
                      <img
                        src={getThumbnailUrl(video.id, video.isPlaylist)}
                        alt={video.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-3 text-center font-medium text-foreground">{video.title}</div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <Button
                variant="outline"
                className="mb-6"
                onClick={() => setSelectedVideo(null)}
              >
                ⬅ Back
              </Button>
              <div className="w-full max-w-3xl aspect-video rounded-lg overflow-hidden shadow-lg bg-card border">
                <ReactPlayer
                  url={buildUrl(selectedVideo)}
                  width="100%"
                  height="100%"
                  controls
                  playing
                  style={{ background: "black" }}
                />
              </div>
              <div className="mt-4 text-lg font-semibold text-center text-foreground">
                {selectedVideo.title}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YouTubeGalleryPage;