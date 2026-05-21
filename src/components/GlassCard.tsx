import React from 'react';
import { ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  intensity?: number;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  intensity = 30, 
  className = '', 
  ...props 
}) => {
  return (
    <BlurView 
      intensity={intensity} 
      tint="dark" 
      className={`overflow-hidden rounded-2xl border border-border/50 bg-card/40 ${className}`}
      {...props}
    >
      {children}
    </BlurView>
  );
};
