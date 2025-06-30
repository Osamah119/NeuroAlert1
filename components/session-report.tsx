"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/components/language-provider';
import { PDFGenerator } from '@/lib/pdf-generator';
import { SessionData } from '@/lib/eeg-simulation';
import { FileText, Download, Printer as Print, Share2, CheckCircle, AlertTriangle, Brain, Activity, Clock, TrendingUp, Heart, Eye, X, Calendar, User, Stethoscope } from 'lucide-react';

interface SessionReportProps {
  session: SessionData & { status: 'completed'; endTime: Date };
  onClose: () => void;
}

export function SessionReport({ session, onClose }: SessionReportProps) {
  const { t, language } = useLanguage();
  const [reportConfirmed, setReportConfirmed] = useState(false);

  const generatePDFReport = () => {
    const report = {
      userId: session.patientId,
      userName: 'John Doe',
      reportDate: new Date(),
      reportPeriod: {
        start: session.startTime,
        end: session.endTime
      },
      eegData: session.eegData,
      predictions: session.predictions,
      summary: {
        totalSessions: 1,
        averageConfidence: session.predictions.length > 0 
          ? session.predictions.reduce((sum, p) => sum + p.confidence, 0) / session.predictions.length
          : 0,
        dominantState: session.predictions.length > 0 
          ? session.predictions[session.predictions.length - 1].label
          : 'normal',
        recommendations: getRecommendations()
      }
    };

    PDFGenerator.generateHealthReport(report, language);
  };

  const getRecommendations = () => {
    const lastPrediction = session.predictions[session.predictions.length - 1];
    if (!lastPrediction) return [];

    const recommendations = {
      en: {
        normal: [
          'Continue maintaining healthy sleep patterns',
          'Regular physical exercise supports cognitive function',
          'Consider stress management techniques for optimal brain health'
        ],
        mild_anomaly: [
          'Monitor stress levels and consider relaxation techniques',
          'Ensure adequate sleep (7-9 hours per night)',
          'Consider follow-up assessment in 2-4 weeks'
        ],
        cognitive_fatigue: [
          'Prioritize rest and recovery',
          'Reduce cognitive workload temporarily',
          'Consider consultation with healthcare provider'
        ],
        early_risk: [
          'Immediate consultation with neurologist recommended',
          'Comprehensive medical evaluation advised',
          'Follow-up monitoring within 1-2 weeks'
        ]
      },
      ar: {
        normal: [
          'استمر في الحفاظ على أنماط نوم صحية',
          'التمارين البدنية المنتظمة تدعم الوظيفة المعرفية',
          'فكر في تقنيات إدارة التوتر للحصول على صحة دماغية مثلى'
        ],
        mild_anomaly: [
          'راقب مستويات التوتر وفكر في تقنيات الاسترخاء',
          'تأكد من النوم الكافي (7-9 ساعات في الليلة)',
          'فكر في تقييم المتابعة خلال 2-4 أسابيع'
        ],
        cognitive_fatigue: [
          'أعط الأولوية للراحة والتعافي',
          'قلل من العبء المعرفي مؤقتاً',
          'فكر في استشارة مقدم الرعاية الصحية'
        ],
        early_risk: [
          'يُنصح بالاستشارة الفورية مع طبيب الأعصاب',
          'يُنصح بالتقييم الطبي الشامل',
          'مراقبة المتابعة خلال 1-2 أسبوع'
        ]
      }
    };

    return recommendations[language][lastPrediction.label as keyof typeof recommendations[typeof language]] || [];
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getOverallAssessment = () => {
    if (session.predictions.length === 0) return { label: 'incomplete', confidence: 0 };
    
    const lastPrediction = session.predictions[session.predictions.length - 1];
    return {
      label: lastPrediction.label,
      confidence: lastPrediction.confidence
    };
  };

  const assessment = getOverallAssessment();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Diagnostic Session Report
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Session ID: {session.id}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close Report
          </Button>
        </div>

        {/* Report Actions */}
        <Card className="mb-6 border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              Report Actions
            </CardTitle>
            <CardDescription>
              Review, confirm, and export your diagnostic report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button onClick={generatePDFReport} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Print className="h-4 w-4" />
                Print Report
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share with Doctor
              </Button>
              <Button 
                variant={reportConfirmed ? "default" : "secondary"}
                onClick={() => setReportConfirmed(!reportConfirmed)}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                {reportConfirmed ? 'Report Confirmed' : 'Confirm Report'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Session Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {session.startTime.toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Session Date
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatDuration(session.duration)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Duration
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {session.eegData.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Data Points
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Brain className="h-8 w-8 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {session.predictions.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Predictions
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Report Content */}
        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="analysis">EEG Analysis</TabsTrigger>
            <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="technical">Technical Data</TabsTrigger>
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="summary">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Overall Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <Badge className={
                      assessment.label === 'normal' ? 'bg-green-100 text-green-800 text-lg px-4 py-2' :
                      assessment.label === 'mild_anomaly' ? 'bg-yellow-100 text-yellow-800 text-lg px-4 py-2' :
                      assessment.label === 'cognitive_fatigue' ? 'bg-orange-100 text-orange-800 text-lg px-4 py-2' :
                      'bg-red-100 text-red-800 text-lg px-4 py-2'
                    }>
                      {assessment.label === 'normal' && <CheckCircle className="h-5 w-5 mr-2" />}
                      {assessment.label !== 'normal' && <AlertTriangle className="h-5 w-5 mr-2" />}
                      {t(`health.${assessment.label}`)}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Confidence Level:</span>
                      <span className="text-xl font-bold text-primary">
                        {(assessment.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={assessment.confidence * 100} className="h-3" />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-semibold">Session Quality Metrics:</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-lg font-bold text-green-600">98.5%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">Signal Quality</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">95.2%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">Data Integrity</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Patient ID:</label>
                      <div className="font-medium">{session.patientId}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Session Type:</label>
                      <div className="font-medium capitalize">{session.sessionType}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Start Time:</label>
                      <div className="font-medium">{session.startTime.toLocaleTimeString()}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-300">End Time:</label>
                      <div className="font-medium">{session.endTime.toLocaleTimeString()}</div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 block">
                      Session Notes:
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                      Patient completed full diagnostic session without interruption. 
                      Signal quality remained excellent throughout the recording period. 
                      No artifacts or technical issues detected.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* EEG Analysis Tab */}
          <TabsContent value="analysis">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Brainwave Analysis
                </CardTitle>
                <CardDescription>
                  Detailed analysis of EEG frequency bands and patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                  {session.eegData.length > 0 && (() => {
                    const avgData = session.eegData.reduce((acc, curr) => ({
                      alpha: acc.alpha + curr.alpha,
                      beta: acc.beta + curr.beta,
                      theta: acc.theta + curr.theta,
                      delta: acc.delta + curr.delta,
                      gamma: acc.gamma + curr.gamma
                    }), { alpha: 0, beta: 0, theta: 0, delta: 0, gamma: 0 });

                    const count = session.eegData.length;
                    const waves = [
                      { name: 'Alpha', value: avgData.alpha / count, color: 'bg-blue-500', range: '8-13 Hz', normal: '8-12 Hz' },
                      { name: 'Beta', value: avgData.beta / count, color: 'bg-green-500', range: '13-30 Hz', normal: '13-25 Hz' },
                      { name: 'Theta', value: avgData.theta / count, color: 'bg-yellow-500', range: '4-8 Hz', normal: '4-7 Hz' },
                      { name: 'Delta', value: avgData.delta / count, color: 'bg-purple-500', range: '0.5-4 Hz', normal: '0.5-3 Hz' },
                      { name: 'Gamma', value: avgData.gamma / count, color: 'bg-red-500', range: '30-100 Hz', normal: '30-80 Hz' }
                    ];

                    return waves.map((wave) => (
                      <Card key={wave.name}>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className={`h-4 w-4 rounded-full ${wave.color} mx-auto mb-2`} />
                            <div className="font-medium text-gray-900 dark:text-white">
                              {wave.name}
                            </div>
                            <div className="text-2xl font-bold text-primary mb-1">
                              {wave.value.toFixed(1)} Hz
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Normal: {wave.normal}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Range: {wave.range}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ));
                  })()}
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Clinical Interpretation:</h4>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-sm leading-relaxed">
                      The EEG recording shows {assessment.label === 'normal' ? 'normal' : 'atypical'} brainwave patterns. 
                      {assessment.label === 'normal' 
                        ? ' Alpha waves are well-organized and present during relaxed wakefulness. Beta activity is appropriate for alert consciousness. No abnormal slow wave activity detected.'
                        : ' Some deviations from normal patterns were observed, requiring further clinical correlation.'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Predictions Tab */}
          <TabsContent value="predictions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Prediction Timeline
                </CardTitle>
                <CardDescription>
                  Real-time AI analysis and predictions during the session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {session.predictions.map((prediction, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0 w-16 text-center">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {Math.floor((index + 1) * 10)}s
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={
                            prediction.label === 'normal' ? 'bg-green-100 text-green-800' :
                            prediction.label === 'mild_anomaly' ? 'bg-yellow-100 text-yellow-800' :
                            prediction.label === 'cognitive_fatigue' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {t(`health.${prediction.label}`)}
                          </Badge>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {(prediction.confidence * 100).toFixed(1)}% confidence
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {prediction.explanation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Clinical Recommendations
                </CardTitle>
                <CardDescription>
                  Personalized recommendations based on your assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      <span className="font-medium text-amber-800 dark:text-amber-200">
                        Important Notice
                      </span>
                    </div>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      {t('common.disclaimer')}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Recommended Actions:</h4>
                    <div className="space-y-3">
                      {getRecommendations().map((rec, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <p className="text-sm">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Follow-up Schedule:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                          <div className="font-medium">Next Assessment</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {assessment.label === 'early_risk' ? '1-2 weeks' : 
                             assessment.label === 'cognitive_fatigue' ? '2-4 weeks' : '1-3 months'}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Eye className="h-8 w-8 mx-auto mb-2 text-green-600" />
                          <div className="font-medium">Monitoring</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            Daily self-assessment
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Stethoscope className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                          <div className="font-medium">Medical Review</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {assessment.label === 'early_risk' ? 'Immediate' : 'As needed'}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Technical Data Tab */}
          <TabsContent value="technical">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Technical Session Data
                </CardTitle>
                <CardDescription>
                  Detailed technical information about the recording session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4">Recording Parameters:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Sampling Rate:</span>
                        <span className="font-medium">256 Hz</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Filter Settings:</span>
                        <span className="font-medium">0.5-70 Hz</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Notch Filter:</span>
                        <span className="font-medium">50 Hz</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Electrode Count:</span>
                        <span className="font-medium">19 channels</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reference:</span>
                        <span className="font-medium">Average</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">Data Quality Metrics:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Signal-to-Noise Ratio:</span>
                        <span className="font-medium text-green-600">42.3 dB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Artifact Rejection:</span>
                        <span className="font-medium">2.1%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Impedance Check:</span>
                        <span className="font-medium text-green-600">Passed</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Data Completeness:</span>
                        <span className="font-medium text-green-600">99.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processing Time:</span>
                        <span className="font-medium">1.2s</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h4 className="font-semibold mb-4">AI Model Information:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="font-medium mb-1">Model Version</div>
                      <div className="text-gray-600 dark:text-gray-300">NeuroAlert v2.1.0</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="font-medium mb-1">Training Dataset</div>
                      <div className="text-gray-600 dark:text-gray-300">50,000+ EEG samples</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="font-medium mb-1">Validation Accuracy</div>
                      <div className="text-gray-600 dark:text-gray-300">94.2%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Report Confirmation */}
        {!reportConfirmed && (
          <Card className="mt-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
                <div>
                  <h4 className="font-semibold text-amber-800 dark:text-amber-200">
                    Report Confirmation Required
                  </h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    Please review all sections of this report and confirm its accuracy before proceeding with any medical decisions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}