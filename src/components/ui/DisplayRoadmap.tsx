
import React from "react";
import { useQuestions } from "@/context/QuestionContext";
import { useTheme } from "@/context/ThemeContext";
import { MainNav } from "@/components/navigation/MainNav";
import { Progress } from "@/components/ui/progress";

const dsaRoadmap = [
  {
    level: "Level 1: Basics",
    topics: [
      "Time & Space Complexity",
      "Big O Notation",
      "Recursion",
      "Basic Math"
    ],
  },
  {
    level: "Level 2: Arrays",
    topics: ["Array"],
  },
  {
    level: "Level 3: Strings",
    topics: ["String"],
  },
  {
    level: "Level 4: Linked Lists & Stacks/Queues",
    topics: ["LinkedList", "Stacks & Queues"],
  },
  {
    level: "Level 5: Trees & Graphs",
    topics: ["Binary Trees", "Binary Search Trees", "Graph"],
  },
  {
    level: "Level 6: Searching & Sorting",
    topics: ["Searching & Sorting"],
  },
  {
    level: "Level 7: Dynamic Programming",
    topics: ["Dynamic Programming"],
  },
  {
    level: "Level 8: Advanced Topics",
    topics: ["Heap", "Greedy", "BackTracking", "Trie", "Matrix"],
  },
];

const DisplayRoadmap: React.FC = () => {
  const { getTopicStatistics } = useQuestions();
  const { theme } = useTheme();
  const topicStats = getTopicStatistics();

  const getTopicProgress = (topicName: string) => {
    const topic = topicStats.find(t => t.topic === topicName);
    return topic ? {
      completed: topic.completed,
      total: topic.total,
      progress: Math.round((topic.completed / topic.total) * 100) || 0
    } : { completed: 0, total: 0, progress: 0 };
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <MainNav />
      <div className="p-6 md:p-10 animate-fadeIn">
        <h1 className="text-4xl font-bold text-center mb-10 text-gradient bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          DSA Roadmap: Beginner to Advanced
        </h1>
        <div className="relative max-w-5xl mx-auto">
          <div className="absolute left-1/2 w-1 h-full bg-gradient-to-b from-blue-300 to-purple-500 dark:from-blue-900 dark:to-purple-900 transform -translate-x-1/2 rounded-full pointer-events-none" />
          <div className="space-y-14 relative z-10">
            {dsaRoadmap.map((section, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row items-center w-full ${isEven ? "" : "md:flex-row-reverse"} animate-fadeIn`}
                >
                  <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-card border-4 border-primary shadow-lg flex items-center justify-center z-20">
                    <span className="font-bold text-primary text-lg">{index + 1}</span>
                  </div>
                  <div className={`w-full md:w-1/2 p-4 ${isEven ? "md:pl-16 md:pr-8" : "md:pr-16 md:pl-8"}`}>
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-20 group-hover:opacity-40 transition-all duration-300 blur-sm pointer-events-none" />
                      <div className="relative modern-card p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-4 h-8 rounded-l-lg bg-gradient-to-b from-blue-500 to-purple-500 mr-4" />
                          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                            {section.level}
                          </h2>
                        </div>
                        <ul className="space-y-3 pl-8">
                          {section.topics.map((topic, i) => {
                            const progress = getTopicProgress(topic);
                            return (
                              <li
                                key={i}
                                className="relative text-foreground group/item"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center">
                                    <span className="absolute -left-5 text-primary text-xl">▹</span>
                                    <span className="ml-2 font-medium">{topic}</span>
                                  </div>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    {progress.completed}/{progress.total}
                                  </span>
                                </div>
                                <Progress
                                  value={progress.progress}
                                  className="h-2 mt-2 bg-muted"
                                />
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayRoadmap;