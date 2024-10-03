/*
 * SPDX-FileCopyrightText: 2024 Igor Kha.
 * SPDX-License-Identifier: MIT.
 */
export function applyTheme() {
  if (
    localStorage.theme === 'app-dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('app-dark')
    document.documentElement.classList.remove('app-light')
  } else if (localStorage.theme === 'app-light') {
    document.documentElement.classList.add('app-light')
    document.documentElement.classList.remove('app-dark')
  } else {
    document.documentElement.classList.remove('app-dark')
    document.documentElement.classList.remove('app-light')
  }
}

export function setDarkMode() {
  localStorage.theme = 'app-dark'
  applyTheme()
}

export function setLightMode() {
  localStorage.theme = 'app-light'
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
      document.documentElement.classList.remove('app-light')
    } else {
      document.documentElement.classList.remove('app-dark')
      document.documentElement.classList.add('app-light')
    }
  }
}

window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', handleSystemThemeChange)

// Apply theme on initial load
applyTheme()
