"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Navigation } from '@/components/navigation';
import { useLanguage } from '@/components/language-provider';
import { 
  Bluetooth, 
  Wifi, 
  Usb, 
  Brain, 
  Activity, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  Zap,
  Signal,
  Battery,
  Headphones,
  Monitor,
  Smartphone,
  Laptop
} from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: 'eeg' | 'ecg' | 'pulse' | 'temperature';
  brand: string;
  model: string;
  connection: 'bluetooth' | 'wifi' | 'usb' | 'serial';
  status: 'connected' | 'disconnected' | 'pairing' | 'error';
  batteryLevel?: number;
  signalQuality?: number;
  lastSeen?: Date;
  firmware?: string;
  channels?: number;
}

export default function DevicesPage() {
  const { t } = useLanguage();
  const [devices, setDevices] = useState<Device[]>([
    {
      id: 'muse-001',
      name: 'Muse 2 Headband',
      type: 'eeg',
      brand: 'Muse',
      model: 'Muse 2',
      connection: 'bluetooth',
      status: 'connected',
      batteryLevel: 78,
      signalQuality: 92,
      lastSeen: new Date(),
      firmware: '2.1.4',
      channels: 4
    },
    {
      id: 'emotiv-001',
      name: 'EMOTIV EPOC X',
      type: 'eeg',
      brand: 'EMOTIV',
      model: 'EPOC X',
      connection: 'wifi',
      status: 'disconnected',
      batteryLevel: 45,
      signalQuality: 0,
      lastSeen: new Date(Date.now() - 300000),
      firmware: '1.8.2',
      channels: 14
    },
    {
      id: 'openbci-001',
      name: 'OpenBCI Cyton',
      type: 'eeg',
      brand: 'OpenBCI',
      model: 'Cyton',
      connection: 'usb',
      status: 'pairing',
      signalQuality: 0,
      firmware: '3.1.0',
      channels: 8
    }
  ]);

  const [scanningDevices, setScanningDevices] = useState(false);
  const [autoConnect, setAutoConnect] = useState(true);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'pairing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'disconnected':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const getConnectionIcon = (connection: string) => {
    switch (connection) {
      case 'bluetooth':
        return <Bluetooth className="h-4 w-4" />;
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      case 'usb':
        return <Usb className="h-4 w-4" />;
      default:
        return <Signal className="h-4 w-4" />;
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'eeg':
        return <Brain className="h-6 w-6" />;
      case 'ecg':
        return <Activity className="h-6 w-6" />;
      default:
        return <Monitor className="h-6 w-6" />;
    }
  };

  const handleScanDevices = () => {
    setScanningDevices(true);
    setTimeout(() => {
      setScanningDevices(false);
      // Simulate finding a new device
      const newDevice: Device = {
        id: 'new-device-' + Date.now(),
        name: 'NeuroSky MindWave',
        type: 'eeg',
        brand: 'NeuroSky',
        model: 'MindWave Mobile 2',
        connection: 'bluetooth',
        status: 'disconnected',
        batteryLevel: 89,
        signalQuality: 0,
        firmware: '1.2.3',
        channels: 1
      };
      setDevices(prev => [...prev, newDevice]);
    }, 3000);
  };

  const handleConnectDevice = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, status: 'pairing' }
        : device
    ));

    setTimeout(() => {
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { 
              ...device, 
              status: 'connected', 
              signalQuality: 85 + Math.random() * 15,
              lastSeen: new Date()
            }
          : device
      ));
    }, 2000);
  };

  const handleDisconnectDevice = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, status: 'disconnected', signalQuality: 0 }
        : device
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Device Management
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Connect and manage your EEG and biometric devices
          </p>
        </div>

        {/* Quick Actions */}
        <Card className="mb-6 border-l-4 border-l-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Device Controls
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Auto-connect:</span>
                  <Switch checked={autoConnect} onCheckedChange={setAutoConnect} />
                </div>
                <Button 
                  onClick={handleScanDevices} 
                  disabled={scanningDevices}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${scanningDevices ? 'animate-spin' : ''}`} />
                  {scanningDevices ? 'Scanning...' : 'Scan for Devices'}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Device Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {devices.filter(d => d.status === 'connected').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Connected
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {devices.filter(d => d.status === 'disconnected').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Available
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
                    {devices.filter(d => d.type === 'eeg').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    EEG Devices
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Signal className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(devices.filter(d => d.status === 'connected').reduce((sum, d) => sum + (d.signalQuality || 0), 0) / devices.filter(d => d.status === 'connected').length) || 0}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Avg Signal Quality
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="devices" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="devices">Connected Devices</TabsTrigger>
            <TabsTrigger value="supported">Supported Hardware</TabsTrigger>
            <TabsTrigger value="settings">Connection Settings</TabsTrigger>
            <TabsTrigger value="troubleshoot">Troubleshooting</TabsTrigger>
          </TabsList>

          {/* Connected Devices Tab */}
          <TabsContent value="devices">
            <div className="space-y-4">
              {devices.map((device) => (
                <Card key={device.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          {getDeviceIcon(device.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{device.name}</h3>
                            <Badge className={getStatusColor(device.status)}>
                              {device.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {device.brand} {device.model} • {device.channels} channels
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              {getConnectionIcon(device.connection)}
                              <span className="capitalize">{device.connection}</span>
                            </div>
                            <div>Firmware: {device.firmware}</div>
                            {device.lastSeen && (
                              <div>Last seen: {device.lastSeen.toLocaleTimeString()}</div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {/* Battery Level */}
                        {device.batteryLevel !== undefined && (
                          <div className="text-center">
                            <div className="flex items-center gap-2 mb-1">
                              <Battery className="h-4 w-4" />
                              <span className="text-sm font-medium">{device.batteryLevel}%</span>
                            </div>
                            <Progress value={device.batteryLevel} className="w-20 h-2" />
                          </div>
                        )}

                        {/* Signal Quality */}
                        {device.status === 'connected' && device.signalQuality !== undefined && (
                          <div className="text-center">
                            <div className="flex items-center gap-2 mb-1">
                              <Signal className="h-4 w-4" />
                              <span className="text-sm font-medium">{Math.round(device.signalQuality)}%</span>
                            </div>
                            <Progress value={device.signalQuality} className="w-20 h-2" />
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          {device.status === 'connected' ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDisconnectDevice(device.id)}
                            >
                              Disconnect
                            </Button>
                          ) : (
                            <Button 
                              size="sm"
                              onClick={() => handleConnectDevice(device.id)}
                              disabled={device.status === 'pairing'}
                            >
                              {device.status === 'pairing' ? 'Connecting...' : 'Connect'}
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Supported Hardware Tab */}
          <TabsContent value="supported">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: 'Muse Headband Series',
                  models: ['Muse 2', 'Muse S'],
                  channels: '4-5 EEG channels',
                  connection: 'Bluetooth',
                  status: 'Fully Supported',
                  icon: <Headphones className="h-8 w-8" />
                },
                {
                  name: 'EMOTIV EPOC Series',
                  models: ['EPOC X', 'EPOC+', 'INSIGHT'],
                  channels: '5-14 EEG channels',
                  connection: 'Bluetooth/WiFi',
                  status: 'Fully Supported',
                  icon: <Brain className="h-8 w-8" />
                },
                {
                  name: 'OpenBCI Boards',
                  models: ['Cyton', 'Ganglion', 'GUI'],
                  channels: '4-16 EEG channels',
                  connection: 'USB/Bluetooth',
                  status: 'Fully Supported',
                  icon: <Monitor className="h-8 w-8" />
                },
                {
                  name: 'NeuroSky Devices',
                  models: ['MindWave', 'ThinkGear'],
                  channels: '1 EEG channel',
                  connection: 'Bluetooth',
                  status: 'Basic Support',
                  icon: <Smartphone className="h-8 w-8" />
                },
                {
                  name: 'g.tec Medical',
                  models: ['g.USBamp', 'g.HIamp'],
                  channels: '16-256 channels',
                  connection: 'USB',
                  status: 'Professional',
                  icon: <Laptop className="h-8 w-8" />
                },
                {
                  name: 'ANT Neuro',
                  models: ['eego mylab', 'NOVA'],
                  channels: '32-128 channels',
                  connection: 'USB/Ethernet',
                  status: 'Enterprise',
                  icon: <Activity className="h-8 w-8" />
                }
              ].map((hardware, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        {hardware.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{hardware.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {hardware.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                          Supported Models:
                        </div>
                        <div className="text-sm">
                          {hardware.models.join(', ')}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                          Channels:
                        </div>
                        <div className="text-sm">{hardware.channels}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                          Connection:
                        </div>
                        <div className="text-sm">{hardware.connection}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Connection Settings Tab */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bluetooth Settings</CardTitle>
                  <CardDescription>
                    Configure Bluetooth connection preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Auto-discovery</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Automatically scan for nearby devices
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Auto-connect</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Connect to known devices automatically
                      </div>
                    </div>
                    <Switch checked={autoConnect} onCheckedChange={setAutoConnect} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Low energy mode</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Optimize for battery life
                      </div>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Acquisition</CardTitle>
                  <CardDescription>
                    Configure data collection parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Sampling Rate</label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option>256 Hz (Recommended)</option>
                      <option>512 Hz</option>
                      <option>1024 Hz</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Filter Settings</label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option>0.5-70 Hz (Standard)</option>
                      <option>1-50 Hz (Clean)</option>
                      <option>0.1-100 Hz (Wide)</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Notch filter (50/60 Hz)</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Remove power line interference
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quality Control</CardTitle>
                  <CardDescription>
                    Signal quality and validation settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Minimum Signal Quality</label>
                    <div className="mt-2">
                      <Progress value={75} className="h-2" />
                      <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">75%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Artifact rejection</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Automatically remove artifacts
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Real-time validation</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Validate data during acquisition
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Advanced Options</CardTitle>
                  <CardDescription>
                    Expert-level configuration options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Buffer Size</label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option>1 second</option>
                      <option>2 seconds (Recommended)</option>
                      <option>5 seconds</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Debug logging</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Enable detailed connection logs
                      </div>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Raw data export</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Save unprocessed EEG data
                      </div>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Troubleshooting Tab */}
          <TabsContent value="troubleshoot">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Common Issues</CardTitle>
                  <CardDescription>
                    Solutions for frequently encountered problems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      {
                        issue: "Device not found during scan",
                        solutions: [
                          "Ensure device is in pairing mode",
                          "Check device battery level",
                          "Move closer to the device (within 3 meters)",
                          "Restart Bluetooth on your computer",
                          "Clear Bluetooth cache and retry"
                        ]
                      },
                      {
                        issue: "Poor signal quality",
                        solutions: [
                          "Clean electrode contacts with alcohol",
                          "Ensure proper electrode placement",
                          "Check for loose connections",
                          "Minimize movement during recording",
                          "Remove nearby electronic interference"
                        ]
                      },
                      {
                        issue: "Frequent disconnections",
                        solutions: [
                          "Check device battery level",
                          "Reduce distance between device and computer",
                          "Update device firmware",
                          "Disable power saving mode",
                          "Check for interference from other devices"
                        ]
                      },
                      {
                        issue: "Data acquisition errors",
                        solutions: [
                          "Restart the application",
                          "Check USB cable connections",
                          "Update device drivers",
                          "Verify sampling rate compatibility",
                          "Check available system memory"
                        ]
                      }
                    ].map((item, index) => (
                      <div key={index} className="border-l-4 border-l-primary pl-4">
                        <h4 className="font-semibold text-lg mb-2">{item.issue}</h4>
                        <ul className="space-y-1">
                          {item.solutions.map((solution, sIndex) => (
                            <li key={sIndex} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              {solution}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Diagnostics</CardTitle>
                  <CardDescription>
                    Run diagnostic tests to identify issues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                      <Bluetooth className="h-6 w-6" />
                      <span>Test Bluetooth</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                      <Wifi className="h-6 w-6" />
                      <span>Test WiFi</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                      <Usb className="h-6 w-6" />
                      <span>Test USB Ports</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                      <Signal className="h-6 w-6" />
                      <span>Signal Test</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>
                    Get help from our technical support team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Email Support</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        Get detailed help via email
                      </p>
                      <Button variant="outline" size="sm">
                        Send Email
                      </Button>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Live Chat</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        Chat with support agents
                      </p>
                      <Button variant="outline" size="sm">
                        Start Chat
                      </Button>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Documentation</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        Browse help articles
                      </p>
                      <Button variant="outline" size="sm">
                        View Docs
                      </Button>
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