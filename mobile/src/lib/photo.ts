import * as ImagePicker from 'expo-image-picker'

/** Square-cropped photo from the library, or undefined if cancelled. */
export async function pickProfilePhoto() {
  const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 })
  return res.canceled ? undefined : res.assets[0]?.uri
}
