/*
 * SPDX-License-Identifier: MIT
 * Author: Igor Kha
 */
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
