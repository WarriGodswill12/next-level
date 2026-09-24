import * as Haptics from 'expo-haptics'
import { Platform } from 'react-native'

const native = Platform.OS === 'ios' || Platform.OS === 'android'

export const tap = () => {
  if (native) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {})
}

export const select = () => {
  if (native) Haptics.selectionAsync().catch(() => {})
}

export const success = () => {
  if (native) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {})
}

export const warn = () => {
  if (native) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {})
}
