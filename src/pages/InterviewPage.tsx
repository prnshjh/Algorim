import { useEffect, useState } from 'react';
import { useInterview } from '@/context/InterviewContext';
import { useInterviewFlow } from '@/hooks/useInterviewFlow';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Editor from '@monaco-editor/react';
import { MainNav } from '@/components/navigation/MainNav';
import { Loader2, Clock, RefreshCw } from 'lucide-react';

export default function InterviewPage() {
  const {
    currentQuestion,
    timer,
    code,
    evaluation,
    difficulty,
    topic,
    timeLimit,
    setCurrentQuestion,
    setTimer,
    setCode,
    setEvaluation,
    setDifficulty,
    setTopic,
    setTimeLimit,
  } = useInterview();

  const { generateQuestions, submitSolution, isLoading, error } = useInterviewFlow();
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!interviewStarted || timer <= 0) return;
  
    const interval = setInterval(() => {
      setTimer(timer - 1); // Directly calculate the new value
    }, 1000);
  
    return () => clearInterval(interval);
  }, [interviewStarted, timer]);
  

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startInterview = async () => {
    const questions = await generateQuestions(topic, difficulty);
    if (questions.length > 0) {
      setCurrentQuestion(questions[0]);
      setTimer(timeLimit * 60);
      setInterviewStarted(true);
      setShowResults(false);
      setCode('');
      setEvaluation(null);
    }
  };

  const handleSubmit = async () => {
    const result = await submitSolution(currentQuestion, code);
    setEvaluation(result);
    setShowResults(true);
    setInterviewStarted(false);
  };

  const handleNewQuestion = async () => {
    await startInterview();
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="container mx-auto p-6 max-w-4xl">
        {!interviewStarted && !showResults && (
          <Card className="p-6 mb-6 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6">Interview Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Topic</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  {['Arrays', 'Trees', 'Graphs', 'Dynamic Programming'].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  {['Easy', 'Medium', 'Hard'].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Time Limit (minutes)</label>
                <input
                  type="number"
                  value={timeLimit}
                  onChange={(e) =>
                    setTimeLimit(Math.max(10, Math.min(60, Number(e.target.value))))
                  }
                  className="w-full p-2 border rounded-md bg-background"
                  min="10"
                  max="60"
                />
              </div>

              <Button onClick={startInterview} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  'Start Interview'
                )}
              </Button>
            </div>
          </Card>
        )}

        {interviewStarted && (
          <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5" />
                <span>{formatTime(timer)}</span>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-accent text-sm">{difficulty}</span>
                <span className="px-3 py-1 rounded-full bg-accent text-sm">{topic}</span>
              </div>
            </div>

            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Question</h2>
              <p className="text-muted-foreground">
                {currentQuestion || 'Generating question...'}
              </p>
            </Card>

            <div className="border rounded-lg overflow-hidden mb-6">
              <Editor
                height="60vh"
                defaultLanguage="cpp"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setInterviewStarted(false)}>
                Exit
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  'Submit Code'
                )}
              </Button>
            </div>
          </div>
        )}

        {showResults && evaluation && (
          <Card className="p-6 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6">Results</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Correctness:</span>
                <span className="text-primary font-semibold">{evaluation.correctness}%</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Time Complexity:</span>
                <code className="bg-accent px-2 py-1 rounded">{evaluation.timeComplexity}</code>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Space Complexity:</span>
                <code className="bg-accent px-2 py-1 rounded">{evaluation.spaceComplexity}</code>
              </div>

              <div className="mt-4">
                <h3 className="font-medium mb-2">Feedback:</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {evaluation.feedback}
                </p>
              </div>

              <div className="flex gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={handleNewQuestion}
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Question
                </Button>
                <Button
                  onClick={() => {
                    setShowResults(false);
                    setInterviewStarted(false);
                  }}
                  className="flex-1"
                >
                  New Question
                </Button>
              </div>
            </div>
          </Card>
        )}

        {error && (
          <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}