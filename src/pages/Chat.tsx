import { useEffect, useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Bot, User, Loader2, BotMessageSquare } from "lucide-react";

import "highlight.js/styles/github-dark.css";

import { MainNav } from "@/components/navigation/MainNav";
import { useTheme } from "@/context/ThemeContext";

const API_KEY = import.meta.env.VITE_GEMENI_AI_API;
const genAI = new GoogleGenerativeAI(API_KEY);

interface Message {
  role: "user" | "model";
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (messages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


  const formatPrompt = (question: string): string => {
    const isCode = /#include|int\s+main|class\s+\w+|def\s+\w+|function\s*\(/i.test(question);

    if (isCode) {
      return `
  You are a helpful and precise coding assistant.
  
  The user has submitted some code that may have issues (compilation errors, logic bugs, or inefficiencies). Your job is to:
  
  1. Identify and **fix the issues** in the code.
  2. **Apply only minimal necessary changes** to make it correct and efficient.
  3. Explain briefly what was wrong and how you fixed it.
  4. Return the corrected code in C++ with proper comments.
  
  Here is the code to fix:
  
  \`\`\`cpp
  ${question}
  \`\`\`
      `;
    } else {
      return `
  You are a highly skilled DSA (Data Structures and Algorithms) tutor. When given a question, follow these instructions carefully:
  
  1. **Understand the Problem**: Rephrase the question in simple terms so it's easy to understand.
  2. **Brute-force Solution**:
     - Explain the naive/brute-force logic step-by-step.
     - Then provide the C++ code with comments.
     - Include time and space complexity.
  3. **Optimized Solution**:
     - First explain the optimized approach **step-by-step**, clearly describing how and why it's better.
     - Then provide the optimized C++ code with comments.
     - Include time and space complexity.
  4. **Edge Cases** (if any): Mention common pitfalls or tricky scenarios to consider.
  5. Ensure that all code is **well-commented**, and explanations are **beginner-friendly**.
  
  Now solve this DSA question:
  
  "${question}"
      `;
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(formatPrompt(input));
      const response = await result.response.text();

      setMessages((prev) => [...prev, { role: "model", content: response }]);
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "❌ Failed to get a response. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        }`}
    >
      <MainNav />
      <div className="container mx-auto py-8 px-4 animate-fadeIn">
        <div className="flex justify-center items-center mb-6">
          <BotMessageSquare className="w-20 h-20 py-6 text-primary" />
          <h1 className="text-3xl font-bold text-gradient">AlgoGPT</h1>
        </div>
        <main className="flex-grow min-h-[70vh] overflow-y-auto px-4 py-6 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 space-y-6">
              <div>
                <p className="text-xl font-semibold">I can help with explanations, code fixes, and optimizations.</p>
                
                

                <p className="text-sm">Just ask me a question or try one of these examples:</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  "Find the longest palindromic substring.",
                  "What is the time complexity of binary search?",
                  "Implement a min-heap in C++.",
                  "Detect cycle in a directed graph.",
                  "Sort an array using merge sort."
                ].map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(example);
                      setTimeout(() => {
                      
                        handleSubmit({
                          preventDefault: () => {},
                        } as React.FormEvent);
                      }, 100);
                    }}
                    
                    
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg shadow transition"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}




          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              {msg.role === "model" && (
                <div className="p-2 bg-blue-600 rounded-full">
                  <Bot size={18} />
                </div>
              )}
              <div
                className={`whitespace-pre-wrap p-4 rounded-2xl shadow ${msg.role === "user"
                  ? "bg-blue-700 text-white rounded-br-none max-w-xl"
                  : "bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded-bl-none w-full sm:max-w-full"
                  }`}
              >
                {msg.role === "model" ? (
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown
                      children={msg.content}
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                      components={{
                        pre({ children }) {
                          const [copied, setCopied] = useState(false);

                          const child = children as React.ReactElement;

                          const getCodeText = (node: any): string => {
                            if (typeof node === "string") return node;
                            if (Array.isArray(node)) return node.map(getCodeText).join("");
                            if (node?.props?.children) return getCodeText(node.props.children);
                            return "";
                          };

                          const codeText = getCodeText(child);

                          const handleCopy = async () => {
                            try {
                              await navigator.clipboard.writeText(codeText);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 1500);
                            } catch (err) {
                              console.error("Copy failed:", err);
                            }
                          };

                          return (
                            <div className="relative bg-gray-900 text-white text-sm rounded-lg overflow-auto my-4">
                              <button
                                onClick={handleCopy}
                                className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded z-10"
                              >
                                {copied ? "✅ Copied!" : "Copy"}
                              </button>
                              <pre className="p-4">{child}</pre>
                            </div>
                          );
                        },

                        code({
                          node,
                          inline,
                          className,
                          children,
                          ...props
                        }: {
                          node: any;
                          inline?: boolean;
                          className?: string;
                          children: React.ReactNode;
                        }) {
                          return inline ? (
                            <code
                              className="bg-gray-800 text-white px-1 py-0.5 rounded text-sm"
                              {...props}
                            >
                              {children}
                            </code>
                          ) : (
                            <code className={`text-sm ${className ?? ""}`} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    />
                  </div>
                ) : (
                  msg.content
                )}
              </div>
              {msg.role === "user" && (
                <div className="p-2 bg-gray-600 rounded-full">
                  <User size={18} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Loader2 className="animate-spin" size={20} />
              Thinking...
            </div>
          )}

          <div ref={chatEndRef} />
        </main>

        <form
          onSubmit={handleSubmit}
          className={`sticky bottom-0 px-4 py-4 flex items-center gap-3 ${theme === "dark"
            ? "bg-gray-900 border-t border-gray-700"
            : "bg-gray-100 border-t border-gray-300"
            }`}
        >

          <textarea
            rows={1}
            className={`flex-1 max-h-40 px-4 py-3 rounded-lg resize-none overflow-y-auto focus:outline-none focus:ring-2 transition-all duration-200 ${theme === "dark"
              ? "bg-gray-800 text-white focus:ring-blue-500"
              : "bg-gray-200 text-gray-900 focus:ring-blue-500"
              }`}
            placeholder="Ask a DSA question or paste code..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`; // 160px = ~6 lines
            }}
          />


          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg text-white font-semibold disabled:opacity-50"
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}


