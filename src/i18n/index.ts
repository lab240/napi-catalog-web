/*
 * SPDX-FileCopyrightText: 2024 Igor Kha.
 * SPDX-License-Identifier: MIT.
 */
import { createI18n } from 'vue-i18n'
import ru from './locales/ru-RU.json'
import en from './locales/en-GB.json'

export default createI18n({
  legacy: false,
  globalInjection: true,
  locale: window.navigator.language.substring(0, 2) || 'en',
  fallbackLocale: 'ru',
  runtimeOnly: false,
  messages: {
    ru,
    en
  }
})
