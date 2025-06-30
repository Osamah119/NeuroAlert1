"use client"

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { EEGData } from '@/lib/eeg-simulation';
import { Card, CardContent } from '@/components/ui/card';

interface EEGChartProps {
  data: EEGData[];
  isActive: boolean;
}

export function EEGChart({ data, isActive }: EEGChartProps) {
  // Transform data for the chart
  const chartData = data.slice(-100).map((point, index) => ({
    time: index,
    alpha: point.alpha,
    beta: point.beta,
    theta: point.theta,
    delta: point.delta,
    gamma: point.gamma
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-3 shadow-lg border">
          <div className="text-sm font-medium mb-2">Time: {label}s</div>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="capitalize">{entry.dataKey}:</span>
              <span className="font-medium">{entry.value.toFixed(2)} Hz</span>
            </div>
          ))}
        </Card>
      );
    }
    return null;
  };

  if (!isActive) {
    return (
      <div className="h-96 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <div className="text-6xl mb-4">🧠</div>
          <div className="text-lg font-medium">Start a session to begin EEG monitoring</div>
          <div className="text-sm">Click "Start New Session" to begin real-time brainwave analysis</div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-lg font-medium text-primary">
            Initializing EEG sensors...
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            Waiting for brainwave data
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="time" 
            type="number"
            scale="linear"
            domain={['dataMin', 'dataMax']}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            label={{ value: 'Frequency (Hz)', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          <Line 
            type="monotone" 
            dataKey="alpha" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={false}
            name="Alpha (8-13 Hz)"
            className="eeg-line"
          />
          <Line 
            type="monotone" 
            dataKey="beta" 
            stroke="#10B981" 
            strokeWidth={2}
            dot={false}
            name="Beta (13-30 Hz)"
            className="eeg-line"
          />
          <Line 
            type="monotone" 
            dataKey="theta" 
            stroke="#F59E0B" 
            strokeWidth={2}
            dot={false}
            name="Theta (4-8 Hz)"
            className="eeg-line"
          />
          <Line 
            type="monotone" 
            dataKey="delta" 
            stroke="#8B5CF6" 
            strokeWidth={2}
            dot={false}
            name="Delta (0.5-4 Hz)"
            className="eeg-line"
          />
          <Line 
            type="monotone" 
            dataKey="gamma" 
            stroke="#EF4444" 
            strokeWidth={2}
            dot={false}
            name="Gamma (30-100 Hz)"
            className="eeg-line"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}