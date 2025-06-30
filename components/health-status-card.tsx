"use client"

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PredictionResult } from '@/lib/eeg-simulation';
import { useLanguage } from '@/components/language-provider';
import { Heart, Brain, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface HealthStatusCardProps {
  prediction: PredictionResult | null;
  isActive: boolean;
}

export function HealthStatusCard({ prediction, isActive }: HealthStatusCardProps) {
  const { t } = useLanguage();

  const getStatusColor = (label: string) => {
    switch (label) {
      case 'normal':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100';
      case 'mild_anomaly':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100';
      case 'cognitive_fatigue':
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-100';
      case 'early_risk':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const getStatusIcon = (label: string) => {
    switch (label) {
      case 'normal':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'mild_anomaly':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'cognitive_fatigue':
        return <Brain className="h-5 w-5 text-orange-600" />;
      case 'early_risk':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Heart className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRecommendation = (label: string): string => {
    const recommendations = {
      normal: 'Continue your current healthy lifestyle patterns.',
      mild_anomaly: 'Consider taking short breaks and monitoring stress levels.',
      cognitive_fatigue: 'Rest recommended. Consider meditation or relaxation techniques.',
      early_risk: 'Consult with a healthcare professional for further evaluation.'
    };

    return recommendations[label as keyof typeof recommendations] || 'Monitor your condition regularly.';
  };

  if (!isActive) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            {t('dashboard.status')}
          </CardTitle>
          <CardDescription>
            Current health assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-muted-foreground">
            <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No active session</p>
            <p className="text-sm">Start monitoring to see health status</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!prediction) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            {t('dashboard.status')}
          </CardTitle>
          <CardDescription>
            Current health assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-lg font-medium">Analyzing...</p>
            <p className="text-sm text-muted-foreground">Processing brainwave patterns</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          {t('dashboard.status')}
        </CardTitle>
        <CardDescription>
          Current health assessment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Badge */}
        <div className="text-center">
          <Badge 
            className={`${getStatusColor(prediction.label)} px-4 py-2 text-lg font-medium border`}
          >
            <div className="flex items-center gap-2">
              {getStatusIcon(prediction.label)}
              {t(`health.${prediction.label}`)}
            </div>
          </Badge>
        </div>

        {/* Confidence Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {t('health.confidence')}
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {(prediction.confidence * 100).toFixed(1)}%
            </span>
          </div>
          <Progress 
            value={prediction.confidence * 100} 
            className="h-3"
          />
        </div>

        {/* Explanation */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 dark:text-white">Analysis</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {prediction.explanation}
          </p>
        </div>

        {/* Recommendation */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 dark:text-white">
            {t('health.recommendation')}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {getRecommendation(prediction.label)}
          </p>
        </div>

        {/* Timestamp */}
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-4 border-t">
          Last updated: {new Date(prediction.timestamp).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}