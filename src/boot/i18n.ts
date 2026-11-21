import { defineBoot } from '#q-app';
import { Lang, type QuasarLanguage } from 'quasar';
import quasarAr from 'quasar/lang/ar';
import quasarDe from 'quasar/lang/de-CH';
import quasarEn from 'quasar/lang/en-US';
import quasarFr from 'quasar/lang/fr';
import quasarIt from 'quasar/lang/it';
import quasarUk from 'quasar/lang/uk';
import { watch, type Ref } from 'vue';
import { createI18n } from 'vue-i18n';
import messages from '../i18n';
import { applyLocaleToDocument, loadLocale, saveLocale } from '../i18n/savedLocale';

export type MessageLanguages = keyof typeof messages;
export type MessageSchema = (typeof messages)['en-US'];

// Quasar's own language pack per app language: component labels and rtl (slider drag direction etc.).
const quasarPacks: Record<string, QuasarLanguage> = {
  'en-US': quasarEn,
  de: quasarDe,
  fr: quasarFr,
  it: quasarIt,
  ar: quasarAr,
  uk: quasarUk,
};

/* eslint-disable @typescript-eslint/no-empty-object-type */
declare module 'vue-i18n' {
  export interface DefineLocaleMessage extends MessageSchema {}
  export interface DefineDateTimeFormat {}
  export interface DefineNumberFormat {}
}
/* eslint-enable @typescript-eslint/no-empty-object-type */

export default defineBoot(({ app }) => {
  const i18n = createI18n<{ message: MessageSchema }, MessageLanguages>({
    locale: loadLocale(),
    fallbackLocale: 'en-US',
    legacy: false,
    messages,
  });
  app.use(i18n);

  // Remember the language and flip the page for right-to-left languages.
  // Composition mode (legacy: false): global.locale is a ref at runtime.
  const locale = (i18n.global as unknown as { locale: Ref<string> }).locale;
  const apply = (code: string) => {
    // Cast: Quasar's QuasarLanguage and Lang.set() types disagree under exactOptionalPropertyTypes.
    Lang.set((quasarPacks[code] ?? quasarEn) as Parameters<typeof Lang.set>[0]);
    applyLocaleToDocument(code);
  };
  apply(locale.value);
  watch(locale, (code) => {
    saveLocale(code);
    apply(code);
  });
});
