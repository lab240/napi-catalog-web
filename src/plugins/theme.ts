/*
 * SPDX-FileCopyrightText: 2024 Igor Kha.
 * SPDX-License-Identifier: MIT.
 */

export function applyTheme() {
  if (
    localStorage.theme === 'app-dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: app-dark)').matches)
  ) {
    document.documentElement.classList.add('app-dark')
  } else {
    document.documentElement.classList.remove('app-dark')
  }
}

export function setLightMode() {
  localStorage.theme = 'app-light'
  applyTheme()
}

export function setDarkMode() {
  localStorage.theme = 'app-dark'
  applyTheme()
}

export function setOSPreference() {
  localStorage.removeItem('theme')
  applyTheme()
}

function handleSystemThemeChange(event: MediaQueryListEvent) {
  if (!localStorage.theme) {
    if (event.matches) {
      document.documentElement.classList.add('app-dark')
    } else {
      document.documentElement.classList.remove('app-dark')
    }
  }
}

window
  .matchMedia('(prefers-color-scheme: app-dark)')
  .addEventListener('change', handleSystemThemeChange)

// Apply theme on initial load
applyTheme()
