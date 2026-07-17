/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `search-docs` command */
  export type SearchDocs = ExtensionPreferences & {}
  /** Preferences accessible in the `search-classes` command */
  export type SearchClasses = ExtensionPreferences & {}
  /** Preferences accessible in the `search-tokens` command */
  export type SearchTokens = ExtensionPreferences & {}
  /** Preferences accessible in the `search-snippets` command */
  export type SearchSnippets = ExtensionPreferences & {}
  /** Preferences accessible in the `update-data` command */
  export type UpdateData = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `search-docs` command */
  export type SearchDocs = {}
  /** Arguments passed to the `search-classes` command */
  export type SearchClasses = {}
  /** Arguments passed to the `search-tokens` command */
  export type SearchTokens = {}
  /** Arguments passed to the `search-snippets` command */
  export type SearchSnippets = {}
  /** Arguments passed to the `update-data` command */
  export type UpdateData = {}
}
