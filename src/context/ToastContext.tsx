import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

type ToastType = 'info' | 'success' | 'error';

interface ToastMessage {
  text: string;
  type: ToastType;
}

interface ToastContextValue {
  show: (text: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ show: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const TYPE_COLORS: Record<ToastType, { bg: string; border: string; text: string }> = {
  info:    { bg: '#1C2060', border: '#4361EE', text: '#7B9EFF' },
  success: { bg: '#0A2A14', border: '#1A6B35', text: '#00E676' },
  error:   { bg: '#2A0008', border: '#FF1744', text: '#FF8A80' },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const translateY = useRef(new Animated.Value(-80)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((text: string, type: ToastType = 'info') => {
    if (hideTimer.current) clearTimeout(hideTimer.current);

    setToast({ text, type });

    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, damping: 18, stiffness: 200 }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    hideTimer.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, { toValue: -80, duration: 250, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start(() => setToast(null));
    }, 3000);
  }, [translateY, opacity]);

  const colors = toast ? TYPE_COLORS[toast.type] : TYPE_COLORS.info;

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && (
        <Animated.View
          style={[
            styles.toast,
            { backgroundColor: colors.bg, borderColor: colors.border },
            { transform: [{ translateY }], opacity },
          ]}
          pointerEvents="none"
        >
          <View style={[styles.dot, { backgroundColor: colors.border }]} />
          <Text style={[styles.text, { color: colors.text }]}>{toast.text}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  text: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
});
