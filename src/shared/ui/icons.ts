/**
 * Material icons (outlined) used in the app, as SVG from @quasar/extras: no icon font,
 * works offline, only the icons listed here end up in the bundle.
 * Keys are Material icon names (FeatureEntry.icon uses them). Use with <q-icon :name="icon('savings')" />.
 */
import {
  outlinedAdd,
  outlinedAutoAwesome,
  outlinedBeachAccess,
  outlinedBubbleChart,
  outlinedCardGiftcard,
  outlinedCelebration,
  outlinedChecklist,
  outlinedChildCare,
  outlinedClose,
  outlinedConstruction,
  outlinedDirectionsCar,
  outlinedElderly,
  outlinedEvent,
  outlinedExpandLess,
  outlinedFavorite,
  outlinedFlight,
  outlinedHome,
  outlinedImage,
  outlinedLaptop,
  outlinedLuggage,
  outlinedMusicNote,
  outlinedPedalBike,
  outlinedPets,
  outlinedPhotoCamera,
  outlinedReceiptLong,
  outlinedSavings,
  outlinedSchool,
  outlinedSend,
  outlinedSmartphone,
  outlinedSportsSoccer,
  outlinedUmbrella,
  outlinedWeekend,
  outlinedAccountBalance,
  outlinedBolt,
  outlinedCheckroom,
  outlinedHealthAndSafety,
  outlinedHelpOutline,
  outlinedLiveTv,
  outlinedMedicalServices,
  outlinedRestaurant,
  outlinedShoppingBag,
  outlinedTrain,
} from '@quasar/extras/material-icons-outlined';

const icons: Record<string, string> = {
  add: outlinedAdd,
  auto_awesome: outlinedAutoAwesome,
  beach_access: outlinedBeachAccess,
  bubble_chart: outlinedBubbleChart,
  card_giftcard: outlinedCardGiftcard,
  celebration: outlinedCelebration,
  checklist: outlinedChecklist,
  child_care: outlinedChildCare,
  close: outlinedClose,
  construction: outlinedConstruction,
  directions_car: outlinedDirectionsCar,
  elderly: outlinedElderly,
  event: outlinedEvent,
  expand_less: outlinedExpandLess,
  favorite: outlinedFavorite,
  flight: outlinedFlight,
  home: outlinedHome,
  image: outlinedImage,
  laptop: outlinedLaptop,
  luggage: outlinedLuggage,
  music_note: outlinedMusicNote,
  pedal_bike: outlinedPedalBike,
  pets: outlinedPets,
  photo_camera: outlinedPhotoCamera,
  receipt_long: outlinedReceiptLong,
  savings: outlinedSavings,
  school: outlinedSchool,
  send: outlinedSend,
  smartphone: outlinedSmartphone,
  sports_soccer: outlinedSportsSoccer,
  umbrella: outlinedUmbrella,
  weekend: outlinedWeekend,
  // Spending categories (content/categories.json)
  account_balance: outlinedAccountBalance,
  bolt: outlinedBolt,
  checkroom: outlinedCheckroom,
  health_and_safety: outlinedHealthAndSafety,
  help_outline: outlinedHelpOutline,
  live_tv: outlinedLiveTv,
  medical_services: outlinedMedicalServices,
  restaurant: outlinedRestaurant,
  shopping_bag: outlinedShoppingBag,
  train: outlinedTrain,
};

export function icon(name: string): string {
  return icons[name] ?? outlinedImage;
}

export const hasIcon = (name: string): boolean => name in icons;

/**
 * Path data of an icon, for drawing it inside our own <svg> (24 × 24 units).
 * @quasar/extras stores an icon as "d@@style&&d@@style…"; the style part marks the invisible padding path.
 */
export function iconPaths(name: string): { d: string; hidden: boolean }[] {
  return icon(name)
    .split('|')[0]!
    .split('&&')
    .map((part) => {
      const [d = '', style = ''] = part.split('@@');
      return { d, hidden: style.includes('fill:none') };
    });
}
