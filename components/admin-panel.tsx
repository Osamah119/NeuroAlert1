"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navigation } from '@/components/navigation';
import { useLanguage } from '@/components/language-provider';
import { 
  Shield, 
  Users, 
  Activity, 
  Server, 
  BarChart3, 
  Database,
  Cpu,
  HardDrive,
  Network,
  Brain,
  Settings,
  RefreshCw
} from 'lucide-react';

export function AdminPanel() {
  const { t } = useLanguage();
  const [systemStatus, setSystemStatus] = useState({
    eegSimulator: 'running',
    aiEngine: 'running',
    database: 'connected',
    apiServer: 'healthy'
  });

  const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', sessions: 24, lastActive: '2024-01-15', status: 'active' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', sessions: 18, lastActive: '2024-01-14', status: 'active' },
    { id: 3, name: 'Ahmed Al-Rahman', email: 'ahmed@example.com', sessions: 32, lastActive: '2024-01-13', status: 'inactive' },
    { id: 4, name: 'Maria Garcia', email: 'maria@example.com', sessions: 12, lastActive: '2024-01-12', status: 'active' },
  ];

  const mockSessions = [
    { id: 1, userId: 1, userName: 'John Doe', duration: '00:15:32', status: 'active', prediction: 'normal' },
    { id: 2, userId: 2, userName: 'Sarah Smith', duration: '00:08:45', status: 'active', prediction: 'cognitive_fatigue' },
    { id: 3, userId: 4, userName: 'Maria Garcia', duration: '00:22:18', status: 'completed', prediction: 'normal' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
      case 'connected':
      case 'healthy':
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'error':
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const refreshSystemStatus = () => {
    // Simulate system check
    setSystemStatus({
      eegSimulator: Math.random() > 0.1 ? 'running' : 'error',
      aiEngine: Math.random() > 0.05 ? 'running' : 'warning',
      database: Math.random() > 0.02 ? 'connected' : 'error',
      apiServer: Math.random() > 0.03 ? 'healthy' : 'warning'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('admin.title')}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            System management and monitoring dashboard
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mockUsers.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Total Users
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mockSessions.filter(s => s.status === 'active').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Active Sessions
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Brain className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    1,247
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Total Predictions
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Server className="h-8 w-8 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    99.8%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    System Uptime
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('admin.users')}
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              {t('admin.sessions')}
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              {t('admin.system')}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {t('admin.analytics')}
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.users')}</CardTitle>
                <CardDescription>
                  Manage and monitor user accounts and activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.sessions}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-300">
                            Sessions
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.lastActive}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-300">
                            Last Active
                          </div>
                        </div>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.sessions')}</CardTitle>
                <CardDescription>
                  Monitor active and recent EEG monitoring sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {session.userName}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            Session ID: {session.id}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {session.duration}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-300">
                            Duration
                          </div>
                        </div>
                        <Badge className={getStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                        <Badge className={getStatusColor(session.prediction === 'normal' ? 'active' : 'warning')}>
                          {t(`health.${session.prediction}`)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Server className="h-5 w-5" />
                      System Components
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={refreshSystemStatus}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Brain className="h-5 w-5 text-primary" />
                      <span className="font-medium">EEG Simulator</span>
                    </div>
                    <Badge className={getStatusColor(systemStatus.eegSimulator)}>
                      {systemStatus.eegSimulator}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Cpu className="h-5 w-5 text-primary" />
                      <span className="font-medium">AI Engine</span>
                    </div>
                    <Badge className={getStatusColor(systemStatus.aiEngine)}>
                      {systemStatus.aiEngine}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-primary" />
                      <span className="font-medium">Database</span>
                    </div>
                    <Badge className={getStatusColor(systemStatus.database)}>
                      {systemStatus.database}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Network className="h-5 w-5 text-primary" />
                      <span className="font-medium">API Server</span>
                    </div>
                    <Badge className={getStatusColor(systemStatus.apiServer)}>
                      {systemStatus.apiServer}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5" />
                    Resource Usage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU Usage</span>
                      <span className="font-medium">24%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage</span>
                      <span className="font-medium">68%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Storage Usage</span>
                      <span className="font-medium">42%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Network I/O</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Prediction Accuracy</CardTitle>
                  <CardDescription>
                    AI model performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Overall Accuracy</span>
                      <span className="text-2xl font-bold text-green-600">94.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Precision</span>
                      <span className="text-xl font-bold">91.8%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Recall</span>
                      <span className="text-xl font-bold">93.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">F1 Score</span>
                      <span className="text-xl font-bold">92.6%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usage Statistics</CardTitle>
                  <CardDescription>
                    Platform usage over the last 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Sessions</span>
                      <span className="text-2xl font-bold text-blue-600">1,247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Avg Session Duration</span>
                      <span className="text-xl font-bold">18:42</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Active Users</span>
                      <span className="text-xl font-bold">186</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Anomalies Detected</span>
                      <span className="text-xl font-bold text-red-600">23</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}