export interface EEGData {
  timestamp: number;
  alpha: number;
  beta: number;
  theta: number;
  delta: number;
  gamma: number;
  composite: number;
}

export interface PredictionResult {
  label: 'normal' | 'mild_anomaly' | 'cognitive_fatigue' | 'early_risk';
  confidence: number;
  explanation: string;
  timestamp: number;
}

export interface SessionData {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  eegData: EEGData[];
  predictions: PredictionResult[];
  patientId: string;
  sessionType: 'diagnostic' | 'monitoring' | 'screening';
  status: 'active' | 'paused' | 'completed' | 'terminated';
}

export class EEGSimulator {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;
  private callbacks: ((data: EEGData) => void)[] = [];
  private predictionCallbacks: ((prediction: PredictionResult) => void)[] = [];
  private currentState: 'normal' | 'stress' | 'fatigue' | 'anomaly' = 'normal';
  private stateChangeCounter = 0;
  private dataHistory: EEGData[] = [];

  constructor() {
    // Initialize with normal state
    this.currentState = 'normal';
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.intervalId = setInterval(() => {
      const data = this.generateEEGData();
      this.dataHistory.push(data);
      
      // Keep only last 1000 data points
      if (this.dataHistory.length > 1000) {
        this.dataHistory = this.dataHistory.slice(-1000);
      }
      
      this.callbacks.forEach(callback => callback(data));
      
      // Generate prediction every 10 data points (every 2 seconds)
      this.stateChangeCounter++;
      if (this.stateChangeCounter >= 10) {
        this.stateChangeCounter = 0;
        this.updateState();
        const prediction = this.generatePrediction(data);
        this.predictionCallbacks.forEach(callback => callback(prediction));
      }
    }, 200); // Generate data every 200ms
  }

  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  onData(callback: (data: EEGData) => void) {
    this.callbacks.push(callback);
  }

  onPrediction(callback: (prediction: PredictionResult) => void) {
    this.predictionCallbacks.push(callback);
  }

  removeDataListener(callback: (data: EEGData) => void) {
    this.callbacks = this.callbacks.filter(cb => cb !== callback);
  }

  removePredictionListener(callback: (prediction: PredictionResult) => void) {
    this.predictionCallbacks = this.predictionCallbacks.filter(cb => cb !== callback);
  }

  private updateState() {
    // Randomly change state to simulate different conditions
    const rand = Math.random();
    if (rand < 0.7) {
      this.currentState = 'normal';
    } else if (rand < 0.85) {
      this.currentState = 'stress';
    } else if (rand < 0.95) {
      this.currentState = 'fatigue';
    } else {
      this.currentState = 'anomaly';
    }
  }

  private generateEEGData(): EEGData {
    const timestamp = Date.now();
    const baseNoise = () => (Math.random() - 0.5) * 0.1;
    
    let alpha, beta, theta, delta, gamma;
    
    switch (this.currentState) {
      case 'normal':
        alpha = 10 + Math.sin(timestamp / 1000) * 2 + baseNoise();
        beta = 15 + Math.sin(timestamp / 800) * 3 + baseNoise();
        theta = 6 + Math.sin(timestamp / 1200) * 1 + baseNoise();
        delta = 2 + Math.sin(timestamp / 1500) * 0.5 + baseNoise();
        gamma = 35 + Math.sin(timestamp / 600) * 5 + baseNoise();
        break;
        
      case 'stress':
        alpha = 8 + Math.sin(timestamp / 1000) * 1.5 + baseNoise();
        beta = 25 + Math.sin(timestamp / 600) * 5 + baseNoise(); // Elevated beta
        theta = 7 + Math.sin(timestamp / 1200) * 1.5 + baseNoise();
        delta = 1.5 + Math.sin(timestamp / 1500) * 0.3 + baseNoise();
        gamma = 40 + Math.sin(timestamp / 500) * 8 + baseNoise(); // Elevated gamma
        break;
        
      case 'fatigue':
        alpha = 7 + Math.sin(timestamp / 1000) * 1 + baseNoise(); // Reduced alpha
        beta = 10 + Math.sin(timestamp / 800) * 2 + baseNoise(); // Reduced beta
        theta = 12 + Math.sin(timestamp / 1000) * 3 + baseNoise(); // Elevated theta
        delta = 4 + Math.sin(timestamp / 1200) * 1 + baseNoise(); // Elevated delta
        gamma = 25 + Math.sin(timestamp / 700) * 3 + baseNoise(); // Reduced gamma
        break;
        
      case 'anomaly':
        alpha = 15 + Math.sin(timestamp / 500) * 8 + baseNoise(); // Irregular alpha
        beta = 30 + Math.sin(timestamp / 300) * 15 + baseNoise(); // Very high beta
        theta = 15 + Math.sin(timestamp / 800) * 5 + baseNoise(); // High theta
        delta = 6 + Math.sin(timestamp / 1000) * 2 + baseNoise(); // High delta
        gamma = 50 + Math.sin(timestamp / 200) * 20 + baseNoise(); // Very high gamma
        break;
        
      default:
        alpha = beta = theta = delta = gamma = 0;
    }

    // Ensure non-negative values
    alpha = Math.max(0, alpha);
    beta = Math.max(0, beta);
    theta = Math.max(0, theta);
    delta = Math.max(0, delta);
    gamma = Math.max(0, gamma);

    // Calculate composite signal
    const composite = (alpha + beta + theta + delta + gamma) / 5;

    return {
      timestamp,
      alpha,
      beta,
      theta,
      delta,
      gamma,
      composite
    };
  }

  private generatePrediction(data: EEGData): PredictionResult {
    // Simple neural network-like classification based on EEG patterns
    const features = [
      data.alpha / 15,  // Normalized alpha
      data.beta / 25,   // Normalized beta
      data.theta / 10,  // Normalized theta
      data.delta / 5,   // Normalized delta
      data.gamma / 40   // Normalized gamma
    ];

    // Simple decision tree based on medical knowledge
    let label: PredictionResult['label'];
    let confidence: number;
    let explanation: string;

    if (this.currentState === 'normal') {
      label = 'normal';
      confidence = 0.85 + Math.random() * 0.13;
      explanation = 'Balanced brainwave activity indicates healthy cognitive state';
    } else if (this.currentState === 'stress') {
      if (data.beta > 20 && data.gamma > 35) {
        label = 'mild_anomaly';
        confidence = 0.75 + Math.random() * 0.2;
        explanation = 'Elevated beta and gamma waves suggest increased stress levels';
      } else {
        label = 'normal';
        confidence = 0.65 + Math.random() * 0.2;
        explanation = 'Slight elevation in high-frequency activity';
      }
    } else if (this.currentState === 'fatigue') {
      label = 'cognitive_fatigue';
      confidence = 0.80 + Math.random() * 0.15;
      explanation = 'Increased theta and delta activity with reduced beta waves indicate cognitive fatigue';
    } else { // anomaly
      label = 'early_risk';
      confidence = 0.70 + Math.random() * 0.25;
      explanation = 'Irregular brainwave patterns detected - monitoring recommended';
    }

    return {
      label,
      confidence: Math.min(0.99, confidence),
      explanation,
      timestamp: Date.now()
    };
  }

  getHistoricalData(minutes: number = 5): EEGData[] {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    return this.dataHistory.filter(data => data.timestamp >= cutoff);
  }

  getCurrentState() {
    return this.currentState;
  }

  isActive() {
    return this.isRunning;
  }
}

// Singleton instance
export const eegSimulator = new EEGSimulator();