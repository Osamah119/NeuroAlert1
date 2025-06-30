"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navigation } from '@/components/navigation';
import { SessionReport } from '@/components/session-report';
import { useLanguage } from '@/components/language-provider';
import { eegSimulator, EEGData, PredictionResult, SessionData } from '@/lib/eeg-simulation';
import { 
  Play, 
  Square, 
  Pause, 
  Activity, 
  Clock, 
  Brain, 
  Heart,
  AlertTriangle,
  CheckCircle,
  FileText,
  Settings
} from 'lucide-react';

export default function SessionPage() {
  const { t } = useLanguage();
  const [sessionState, setSessionState] = useState<'idle' | 'active' | 'paused' | 'completed'>('idle');
  const [currentSession, setCurrentSession] = useState<SessionData | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [eegData, setEegData] = useState<EEGData[]>([]);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [showReport, setShowReport] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [targetDuration] = useState(300); // 5 minutes default session

  useEffect(() => {
    const handleEEGData = (data: EEGData) => {
      setEegData(prev => [...prev.slice(-299), data]);
    };

    const handlePrediction = (prediction: PredictionResult) => {
      setPredictions(prev => [...prev.slice(-49), prediction]);
    };

    eegSimulator.onData(handleEEGData);
    eegSimulator.onPrediction(handlePrediction);

    return () => {
      eegSimulator.removeDataListener(handleEEGData);
      eegSimulator.removePredictionListener(handlePrediction);
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionState === 'active') {
      interval = setInterval(() => {
        setSessionDuration(prev => {
          const newDuration = prev + 1;
          setSessionProgress((newDuration / targetDuration) * 100);
          
          // Auto-complete session after target duration
          if (newDuration >= targetDuration) {
            handleCompleteSession();
          }
          
          return newDuration;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionState, targetDuration]);

  const handleStartSession = () => {
    const newSession: SessionData = {
      id: `session_${Date.now()}`,
      startTime: new Date(),
      duration: 0,
      eegData: [],
      predictions: [],
      patientId: 'patient_001',
      sessionType: 'diagnostic',
      status: 'active'
    };

    setCurrentSession(newSession);
    setSessionState('active');
    setSessionDuration(0);
    setEegData([]);
    setPredictions([]);
    setSessionProgress(0);
    eegSimulator.start();
  };

  const handlePauseSession = () => {
    setSessionState('paused');
    eegSimulator.stop();
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        status: 'paused'
      });
    }
  };

  const handleResumeSession = () => {
    setSessionState('active');
    eegSimulator.start();
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        status: 'active'
      });
    }
  };

  const handleCompleteSession = () => {
    setSessionState('completed');
    eegSimulator.stop();
    
    if (currentSession) {
      const completedSession: SessionData = {
        ...currentSession,
        endTime: new Date(),
        duration: sessionDuration,
        eegData: eegData,
        predictions: predictions,
        status: 'completed'
      };
      
      setCurrentSession(completedSession);
      setShowReport(true);
    }
  };

  const handleTerminateSession = () => {
    setSessionState('idle');
    eegSimulator.stop();
    setCurrentSession(null);
    setSessionDuration(0);
    setEegData([]);
    setPredictions([]);
    setSessionProgress(0);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getSessionStatusColor = () => {
    switch (sessionState) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  if (showReport && currentSession) {
    return <SessionReport session={currentSession as SessionData & { status: 'completed'; endTime: Date }} onClose={() => setShowReport(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              EEG Diagnostic Session
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Professional neurological assessment and monitoring
          </p>
        </div>

        {/* Session Control Panel */}
        <Card className="mb-6 border-l-4 border-l-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle className="text-xl">Session Control</CardTitle>
                  <CardDescription>
                    {currentSession ? `Session ID: ${currentSession.id}` : 'No active session'}
                  </CardDescription>
                </div>
              </div>
              <Badge className={getSessionStatusColor()}>
                <div className="flex items-center gap-2">
                  {sessionState === 'active' && <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />}
                  {sessionState.charAt(0).toUpperCase() + sessionState.slice(1)}
                </div>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Session Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium">Duration:</span>
                  <span className="text-lg font-bold text-primary">
                    {formatDuration(sessionDuration)}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.min(100, sessionProgress).toFixed(0)}%</span>
                  </div>
                  <Progress value={Math.min(100, sessionProgress)} className="h-2" />
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap gap-2">
                {sessionState === 'idle' && (
                  <Button onClick={handleStartSession} className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Start Session
                  </Button>
                )}
                {sessionState === 'active' && (
                  <>
                    <Button onClick={handlePauseSession} variant="outline" className="flex items-center gap-2">
                      <Pause className="h-4 w-4" />
                      Pause
                    </Button>
                    <Button onClick={handleCompleteSession} variant="default" className="flex items-center gap-2">
                      <Square className="h-4 w-4" />
                      Complete
                    </Button>
                  </>
                )}
                {sessionState === 'paused' && (
                  <>
                    <Button onClick={handleResumeSession} className="flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      Resume
                    </Button>
                    <Button onClick={handleCompleteSession} variant="default" className="flex items-center gap-2">
                      <Square className="h-4 w-4" />
                      Complete
                    </Button>
                  </>
                )}
                {sessionState !== 'idle' && (
                  <Button onClick={handleTerminateSession} variant="destructive" className="flex items-center gap-2">
                    <Square className="h-4 w-4" />
                    Terminate
                  </Button>
                )}
              </div>

              {/* Real-time Stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Data Points:</span>
                  <span className="font-medium">{eegData.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Predictions:</span>
                  <span className="font-medium">{predictions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Signal Quality:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Excellent
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Monitoring */}
        {sessionState !== 'idle' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Real-time EEG Display */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Live EEG Monitoring
                  </CardTitle>
                  <CardDescription>
                    Real-time brainwave activity across all frequency bands
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Activity className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
                      <p className="text-lg font-medium">Live EEG Stream</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {eegData.length} data points collected
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Status */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Current Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {predictions.length > 0 ? (
                    <div className="space-y-4">
                      {(() => {
                        const latest = predictions[predictions.length - 1];
                        return (
                          <>
                            <div className="text-center">
                              <Badge className={
                                latest.label === 'normal' ? 'bg-green-100 text-green-800' :
                                latest.label === 'mild_anomaly' ? 'bg-yellow-100 text-yellow-800' :
                                latest.label === 'cognitive_fatigue' ? 'bg-orange-100 text-orange-800' :
                                'bg-red-100 text-red-800'
                              }>
                                {latest.label === 'normal' && <CheckCircle className="h-4 w-4 mr-1" />}
                                {latest.label !== 'normal' && <AlertTriangle className="h-4 w-4 mr-1" />}
                                {t(`health.${latest.label}`)}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">Confidence:</span>
                                <span className="font-medium">{(latest.confidence * 100).toFixed(1)}%</span>
                              </div>
                              <Progress value={latest.confidence * 100} className="h-2" />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {latest.explanation}
                            </p>
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <Brain className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Analyzing...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Session History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Session History
            </CardTitle>
            <CardDescription>
              Previous diagnostic sessions and reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mock session history */}
              {[
                { id: 'session_001', date: '2024-01-15', duration: '15:32', status: 'completed', result: 'Normal' },
                { id: 'session_002', date: '2024-01-14', duration: '12:45', status: 'completed', result: 'Mild Anomaly' },
                { id: 'session_003', date: '2024-01-13', duration: '18:20', status: 'completed', result: 'Normal' },
              ].map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{session.id}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{session.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm font-medium">{session.duration}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">Duration</div>
                    </div>
                    <Badge className={session.result === 'Normal' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {session.result}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Report
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}