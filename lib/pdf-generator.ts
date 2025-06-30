import jsPDF from 'jspdf';
import { EEGData, PredictionResult } from './eeg-simulation';

export interface HealthReport {
  userId: string;
  userName: string;
  reportDate: Date;
  reportPeriod: { start: Date; end: Date };
  eegData: EEGData[];
  predictions: PredictionResult[];
  summary: {
    totalSessions: number;
    averageConfidence: number;
    dominantState: string;
    recommendations: string[];
  };
}

export class PDFGenerator {
  static generateHealthReport(report: HealthReport, language: 'en' | 'ar' = 'en'): void {
    try {
      const pdf = new jsPDF();
      const isRTL = language === 'ar';
      
      let yPosition = 20;
      const lineHeight = 7;
      const pageWidth = pdf.internal.pageSize.width;
      const margin = 20;

      // Title
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      const title = language === 'ar' ? 'تقرير صحة الدماغ - نيوروألرت' : 'NeuroAlert Health Report';
      pdf.text(title, isRTL ? pageWidth - margin : margin, yPosition, { align: isRTL ? 'right' : 'left' });
      yPosition += lineHeight * 2;

      // Patient info
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      const patientLabel = language === 'ar' ? 'المريض:' : 'Patient:';
      const dateLabel = language === 'ar' ? 'تاريخ التقرير:' : 'Report Date:';
      const periodLabel = language === 'ar' ? 'فترة التقرير:' : 'Report Period:';
      
      pdf.text(`${patientLabel} ${report.userName}`, isRTL ? pageWidth - margin : margin, yPosition, { align: isRTL ? 'right' : 'left' });
      yPosition += lineHeight;
      
      pdf.text(`${dateLabel} ${report.reportDate.toLocaleDateString()}`, isRTL ? pageWidth - margin : margin, yPosition, { align: isRTL ? 'right' : 'left' });
      yPosition += lineHeight;
      
      pdf.text(
        `${periodLabel} ${report.reportPeriod.start.toLocaleDateString()} - ${report.reportPeriod.end.toLocaleDateString()}`,
        isRTL ? pageWidth - margin : margin,
        yPosition,
        { align: isRTL ? 'right' : 'left' }
      );
      yPosition += lineHeight * 2;

      // Summary section
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      const summaryTitle = language === 'ar' ? 'ملخص الصحة' : 'Health Summary';
      pdf.text(summaryTitle, isRTL ? pageWidth - margin : margin, yPosition, { align: isRTL ? 'right' : 'left' });
      yPosition += lineHeight * 1.5;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      const sessionsLabel = language === 'ar' ? 'إجمالي الجلسات:' : 'Total Sessions:';
      const confidenceLabel = language === 'ar' ? 'متوسط الثقة:' : 'Average Confidence:';
      const stateLabel = language === 'ar' ? 'الحالة الغالبة:' : 'Dominant State:';
      
      pdf.text(`${sessionsLabel} ${report.summary.totalSessions}`, isRTL ? pageWidth - margin : margin, yPosition, { align: isRTL ? 'right' : 'left' });
      yPosition += lineHeight;
      
      pdf.text(`${confidenceLabel} ${(report.summary.averageConfidence * 100).toFixed(1)}%`, isRTL ? pageWidth - margin : margin, yPosition, { align: isRTL ? 'right' : 'left' });
      yPosition += lineHeight;
      
      pdf.text(`${stateLabel} ${this.translateState(report.summary.dominantState, language)}`, isRTL ? pageWidth - margin : margin, yPosition, { align: isRTL ? 'right' : 'left' });
      yPosition += lineHeight * 2;

      // EEG Analysis
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      const eegTitle = language === 'ar' ? 'تحليل الموجات الدماغية' : 'EEG Analysis';
      pdf.text(eegTitle, isRTL ? pageWidth - margin : margin, yPosition, { align: isRTL ? 'right' : 'left' });
      yPosition += lineHeight * 1.5;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);

      if (report.eegData.length > 0) {
        const avgData = this.calculateAverages(report.eegData);
        
        const waveLabels = language === 'ar' ? {
          alpha: 'موجات ألفا:',
          beta: 'موجات بيتا:',
          theta: 'موجات ثيتا:',
          delta: 'موجات دلتا:',
          gamma: 'موجات جاما:'
        } : {
          alpha: 'Alpha Waves:',
          beta: 'Beta Waves:',
          theta: 'Theta Waves:',
          delta: 'Delta Waves:',
          gamma: 'Gamma Waves:'
        };

        Object.entries(avgData).forEach(([wave, value]) => {
          if (wave !== 'composite' && wave !== 'timestamp') {
            const label = waveLabels[wave as keyof typeof waveLabels];
            pdf.text(`${label} ${value.toFixed(2)} Hz`, isRTL ? pageWidth - margin : margin, yPosition, { align: isRTL ? 'right' : 'left' });
            yPosition += lineHeight;
          }
        });
      }

      yPosition += lineHeight;

      // Recommendations
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      const recTitle = language === 'ar' ? 'التوصيات' : 'Recommendations';
      pdf.text(recTitle, isRTL ? pageWidth - margin : margin, yPosition, { align: isRTL ? 'right' : 'left' });
      yPosition += lineHeight * 1.5;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);

      report.summary.recommendations.forEach((rec, index) => {
        const bullet = '•';
        pdf.text(`${bullet} ${rec}`, isRTL ? pageWidth - margin : margin, yPosition, { align: isRTL ? 'right' : 'left' });
        yPosition += lineHeight;
      });

      yPosition += lineHeight * 2;

      // Disclaimer
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(9);
      const disclaimer = language === 'ar' 
        ? 'نيوروألرت هو مساعد صحي تنبؤي. وهو ليس أداة تشخيصية أو علاجية. يرجى استشارة طبيب مختص للحصول على المشورة الطبية.'
        : 'NeuroAlert is a predictive health assistant. It is not a diagnostic or therapeutic tool. Please consult a qualified healthcare professional for medical advice.';
      
      const lines = pdf.splitTextToSize(disclaimer, pageWidth - 2 * margin);
      pdf.text(lines, isRTL ? pageWidth - margin : margin, yPosition, { align: isRTL ? 'right' : 'left' });

      // Save the PDF
      const filename = `neuroalert-report-${report.reportDate.toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback: create a simple text-based report
      const reportText = `NeuroAlert Health Report\n\nPatient: ${report.userName}\nDate: ${report.reportDate.toLocaleDateString()}\n\nThis report could not be generated as PDF. Please contact support.`;
      const blob = new Blob([reportText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `neuroalert-report-${report.reportDate.toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  private static translateState(state: string, language: 'en' | 'ar'): string {
    const translations = {
      en: {
        normal: 'Normal',
        mild_anomaly: 'Mild Anomaly',
        cognitive_fatigue: 'Cognitive Fatigue',
        early_risk: 'Early Risk'
      },
      ar: {
        normal: 'طبيعي',
        mild_anomaly: 'شذوذ طفيف',
        cognitive_fatigue: 'إرهاق معرفي',
        early_risk: 'خطر مبكر'
      }
    };

    return translations[language][state as keyof typeof translations[typeof language]] || state;
  }

  private static calculateAverages(data: EEGData[]): Omit<EEGData, 'timestamp'> {
    if (data.length === 0) {
      return { alpha: 0, beta: 0, theta: 0, delta: 0, gamma: 0, composite: 0 };
    }

    const sums = data.reduce((acc, curr) => ({
      alpha: acc.alpha + curr.alpha,
      beta: acc.beta + curr.beta,
      theta: acc.theta + curr.theta,
      delta: acc.delta + curr.delta,
      gamma: acc.gamma + curr.gamma,
      composite: acc.composite + curr.composite
    }), { alpha: 0, beta: 0, theta: 0, delta: 0, gamma: 0, composite: 0 });

    const count = data.length;
    return {
      alpha: sums.alpha / count,
      beta: sums.beta / count,
      theta: sums.theta / count,
      delta: sums.delta / count,
      gamma: sums.gamma / count,
      composite: sums.composite / count
    };
  }
}