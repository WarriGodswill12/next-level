import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { fontAssets } from '@/design/typography'
import { ChatProvider } from '@/state/chat'
import { SessionProvider } from '@/state/session'
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider'

SplashScreen.preventAutoHideAsync().catch(() => {})

function ThemedStack() {
  const { scheme, colors } = useTheme()
  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'none' }} />
        <Stack.Screen name="(auth)/welcome" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade', gestureEnabled: false }} />
      </Stack>
    </>
  )
}

export default function RootLayout() {
  const [loaded, error] = useFonts(fontAssets)

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync().catch(() => {})
  }, [loaded, error])

  // Keep the native splash up until the brand fonts are ready.
  if (!loaded && !error) return null

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SessionProvider>
          <ChatProvider>
            <ThemedStack />
          </ChatProvider>
        </SessionProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
