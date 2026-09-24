import { Tabs } from 'expo-router/js-tabs'
import { TabBar } from '@/components/TabBar'
import { useChat } from '@/state/chat'
import { useThemeColors } from '@/theme/ThemeProvider'

export default function TabsLayout() {
  const c = useThemeColors()
  const unread = useChat().totalUnread

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: c.background } }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="discover" options={{ title: 'Discover' }} />
      <Tabs.Screen name="messages" options={{ title: 'Messages', tabBarBadge: unread || undefined }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  )
}
