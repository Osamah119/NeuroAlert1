"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/components/language-provider';
import { 
  Brain, 
  Home, 
  Settings, 
  FileText, 
  Shield, 
  Moon, 
  Sun, 
  Languages,
  Download,
  Activity,
  Zap
} from 'lucide-react';
import { PDFGenerator } from '@/lib/pdf-generator';

export function Navigation() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const generateSampleReport = () => {
    const sampleReport = {
      userId: 'user123',
      userName: 'John Doe',
      reportDate: new Date(),
      reportPeriod: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date()
      },
      eegData: [],
      predictions: [],
      summary: {
        totalSessions: 24,
        averageConfidence: 0.87,
        dominantState: 'normal',
        recommendations: [
          language === 'ar' 
            ? 'حافظ على نمط نوم منتظم للحصول على صحة دماغية مثلى'
            : 'Maintain regular sleep patterns for optimal brain health',
          language === 'ar'
            ? 'اعتبر تمارين التأمل لتقليل التوتر'
            : 'Consider meditation exercises to reduce stress levels',
          language === 'ar'
            ? 'ابق نشطًا بدنيًا لتحسين الوظيفة المعرفية'
            : 'Stay physically active to improve cognitive function'
        ]
      }
    };

    PDFGenerator.generateHealthReport(sampleReport, language);
  };

  const navItems = [
    { href: '/', label: t('nav.dashboard'), icon: Home },
    { href: '/session', label: 'EEG Session', icon: Activity },
    { href: '/devices', label: 'Devices', icon: Zap },
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/admin', label: t('nav.admin'), icon: Shield },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-primary" />
            <div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                NeuroAlert
              </span>
              <Badge variant="secondary" className="ml-2 text-xs">
                v1.0
              </Badge>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                    pathname === item.href
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            {/* Generate Report Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={generateSampleReport}
              className="hidden sm:flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {t('reports.generate')}
            </Button>

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Languages className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">
                    {language === 'ar' ? 'العربية' : 'English'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  <span className="mr-2">🇺🇸</span>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('ar')}>
                  <span className="mr-2">🇸🇦</span>
                  العربية
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <Settings className="mr-2 h-4 w-4" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}