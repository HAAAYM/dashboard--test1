'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, MessageSquare, User, AlertCircle } from 'lucide-react';

export default function AIChatPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendQuestion = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);
    setAnswer('');

    try {
      // Call aiGatewayV1 Cloud Function
      const response = await fetch('https://us-central1-edu-mate-admin.cloudfunctions.net/aiGatewayV1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            userId: 'admin_user', // Mock admin user
            role: 'admin', // Mock admin role
            questionType: 'general',
            question: question.trim()
          }
        })
      });

      const result = await response.json();

      if (result.result && result.result.status === 'success') {
        setAnswer(result.result.data.answer);
      } else {
        setError(result.result?.message || 'Failed to get AI response');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('AI Gateway Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Assistant</h1>
          <p className="text-muted-foreground">
            Ask questions and get AI-powered assistance
          </p>
        </div>
        <Badge className="bg-green-100 text-green-800">
          <Bot className="h-3 w-3 mr-1" />
          V1 Gateway
        </Badge>
      </div>

      {/* Chat Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Ask AI Assistant
          </CardTitle>
          <CardDescription>
            Enter your question and get a response from the AI Gateway
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Question Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Question</label>
            <Textarea
              placeholder="Type your question here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Send Button */}
          <Button 
            onClick={handleSendQuestion}
            disabled={!question.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Question
              </>
            )}
          </Button>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* Answer Display */}
          {answer && (
            <div className="space-y-2">
              <label className="text-sm font-medium">AI Response</label>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Bot className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{answer}</p>
                    <div className="mt-2 text-xs text-blue-600">
                      Response from aiGatewayV1
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Gateway Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">
              Connected to aiGatewayV1 Cloud Function
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
