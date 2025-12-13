import { View, ViewProps } from "react-native";
import { ReactNode } from "react";

interface GlassCardProps extends ViewProps {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({ children, className = "", style, ...props }: GlassCardProps) {
  return (
    <View
      className={`bg-card rounded-2xl border border-card-border ${className}`}
      style={[
        {
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          borderColor: "rgba(255, 255, 255, 0.1)",
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
