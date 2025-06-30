"use client"

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PredictionResult } from '@/lib/eeg-simulation';
import { useLanguage } from '@/components/language-provider';
import { TrendingUp, Clock, CheckCircle, AlertTriangle, Brain } from 'lucide-react';

interface PredictionHistoryProps {
  predictions: PredictionResult[];
}

export function PredictionHistory({ predictions }: PredictionHistoryProps) {
  const { t } = useLanguage();

  const getStatusColor = (label: string) => {
    switch (label) {
      case 'normal':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'mild_anomaly':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'cognitive_fatigue':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'early_risk':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const getStatusIcon = (label: string) => {
    switch (label) {
      case 'normal':
        return <CheckCircle className="h-4 w-4" />;
      case 'mild_anomaly':
        return <Clock className="h-4 w-4" />;
      case 'cognitive_fatigue':
        return <Brain className="h-4 w-4" />;
      case 'early_risk':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (predictions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {t('dashboard.predictions')}
          </CardTitle>
          <CardDescription>
            AI-powered health predictions and analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-muted-foreground">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No predictions yet</p>
            <p className="text-sm">Start a session to begin receiving AI predictions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate statistics
  const totalPredictions = predictions.length;
  const normalCount = predictions.filter(p => p.label === 'normal').length;
  const averageConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / totalPredictions;
  const latestPrediction = predictions[predictions.length - 1];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          {t('dashboard.predictions')}
        </CardTitle>
        <CardDescription>
          AI-powered health predictions and analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {totalPredictions}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Total Predictions
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {((normalCount / totalPredictions) * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Normal States
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {(averageConfidence * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Avg Confidence
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Badge className={getStatusColor(latestPrediction.label)}>
              <div className="flex items-center gap-1">
                {getStatusIcon(latestPrediction.label)}
                {t(`health.${latestPrediction.label}`)}
              </div>
            </Badge>
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Current Status
            </div>
          </div>
        </div>

        {/* Predictions List */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            Recent Predictions
          </h4>
          <ScrollArea className="h-64 w-full border rounded-lg">
            <div className="p-4 space-y-3">
              {predictions.slice().reverse().map((prediction, index) => (
                <div 
                  key={prediction.timestamp} 
                  className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {getStatusIcon(prediction.label)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`${getStatusColor(prediction.label)} text-xs`}>
                        {t(`health.${prediction.label}`)}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {(prediction.confidence * 100).toFixed(1)}% confidence
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      {prediction.explanation}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(prediction.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}