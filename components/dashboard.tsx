"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { EEGChart } from '@/components/eeg-chart';
import { HealthStatusCard } from '@/components/health-status-card';
import { PredictionHistory } from '@/components/prediction-history';
import { Navigation } from '@/components/navigation';
import { eegSimulator, EEGData, PredictionResult } from '@/lib/eeg-simulation';
import { useLanguage } from '@/components/language-provider';
import { Activity, Brain, Zap, TrendingUp, Play, Square } from 'lucide-react';

export function Dashboard() {
  const { t } = useLanguage();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentEEGData, setCurrentEEGData] = useState<EEGData | null>(null);
  const [eegHistory, setEEGHistory] = useState<EEGData[]>([]);
  const [currentPrediction, setCurrentPrediction] = useState<PredictionResult | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<PredictionResult[]>([]);
  const [sessionDuration, setSessionDuration] = useState(0);

  useEffect(() => {
    const handleEEGData = (data: EEGData) => {
      setCurrentEEGData(data);
      setEEGHistory(prev => [...prev.slice(-299), data]); // Keep last 300 points
    };

    const handlePrediction = (prediction: PredictionResult) => {
      setCurrentPrediction(prediction);
      setPredictionHistory(prev => [...prev.slice(-49), prediction]); // Keep last 50 predictions
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
    if (isSessionActive) {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive]);

  const handleStartSession = () => {
    setIsSessionActive(true);
    setSessionDuration(0);
    setEEGHistory([]);
    setPredictionHistory([]);
    eegSimulator.start();
  };

  const handleStopSession = () => {
    setIsSessionActive(false);
    eegSimulator.stop();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('dashboard.title')}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Session Controls */}
        <Card className="mb-6 border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{t('dashboard.realtime')}</CardTitle>
              </div>
              <div className="flex items-center gap-4">
                {isSessionActive && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                      {formatDuration(sessionDuration)}
                    </div>
                  </Badge>
                )}
                {isSessionActive ? (
                  <Button onClick={handleStopSession} variant="destructive" size="sm">
                    <Square className="h-4 w-4 mr-2" />
                    {t('dashboard.stop_session')}
                  </Button>
                ) : (
                  <Button onClick={handleStartSession} size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    {t('dashboard.start_session')}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* EEG Chart */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  EEG Brainwave Activity
                </CardTitle>
                <CardDescription>
                  Real-time brainwave monitoring across all frequency bands
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EEGChart data={eegHistory} isActive={isSessionActive} />
              </CardContent>
            </Card>
          </div>

          {/* Health Status */}
          <div>
            <HealthStatusCard prediction={currentPrediction} isActive={isSessionActive} />
          </div>
        </div>

        {/* EEG Metrics Cards */}
        {currentEEGData && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {[
              { name: 'Alpha', value: currentEEGData.alpha, color: 'bg-blue-500', range: '8-13 Hz' },
              { name: 'Beta', value: currentEEGData.beta, color: 'bg-green-500', range: '13-30 Hz' },
              { name: 'Theta', value: currentEEGData.theta, color: 'bg-yellow-500', range: '4-8 Hz' },
              { name: 'Delta', value: currentEEGData.delta, color: 'bg-purple-500', range: '0.5-4 Hz' },
              { name: 'Gamma', value: currentEEGData.gamma, color: 'bg-red-500', range: '30-100 Hz' }
            ].map((wave) => (
              <Card key={wave.name} className="relative overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {t(`eeg.${wave.name.toLowerCase()}`)}
                    </span>
                    <div className={`h-3 w-3 rounded-full ${wave.color} opacity-80`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {wave.value.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {wave.range}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
                    <div 
                      className={`h-full ${wave.color} transition-all duration-300`}
                      style={{ width: `${Math.min(100, (wave.value / 50) * 100)}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tabs for detailed views */}
        <Tabs defaultValue="predictions" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="predictions" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {t('dashboard.predictions')}
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              {t('dashboard.history')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="predictions">
            <PredictionHistory predictions={predictionHistory} />
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Historical EEG Data</CardTitle>
                <CardDescription>
                  Long-term trends and patterns in your brainwave activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {predictionHistory.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Total Predictions
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {predictionHistory.filter(p => p.label === 'normal').length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Normal States
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {predictionHistory.filter(p => p.label === 'cognitive_fatigue').length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Fatigue Detected
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {predictionHistory.length > 0 ? (predictionHistory.reduce((sum, p) => sum + p.confidence, 0) / predictionHistory.length * 100).toFixed(1) : 0}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Avg Confidence
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Disclaimer */}
        <Card className="mt-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <CardContent className="p-4">
            <p className="text-sm text-amber-800 dark:text-amber-200 text-center">
              ⚠️ {t('common.disclaimer')}
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}