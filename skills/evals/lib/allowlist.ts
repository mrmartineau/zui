/**
 * Documented exceptions to the skill evals.
 *
 * Every entry needs a reason. If you can't write one, fix the skill instead.
 */

/** Classes referenced by a skill that intentionally have no CSS rule. */
export const ALLOWED_MISSING_CLASSES: Record<string, string> = {}

/** Custom properties in a ZUI namespace that intentionally don't exist. */
export const ALLOWED_MISSING_TOKENS: Record<string, string> = {
  '--space-4-5':
    'Anti-example: migrate-to-zui tells you not to invent tokens like this to preserve old pixel values.',
  '--zui-button':
    'Anti-example: using-zui calls out that the button uses the abbreviated `--zui-btn-*` prefix, not `--zui-button-*`.',
}

/**
 * Components exported by the library that `using-zui` deliberately doesn't
 * document (internal parts, or covered only via a parent component).
 */
export const UNDOCUMENTED_COMPONENTS: Record<string, string> = {}

/**
 * CSS component files with no public class of their own, so there is nothing
 * for a skill to document.
 */
export const INTERNAL_CSS_COMPONENTS: Record<string, string> = {
  'drawer-slide':
    'Internal primitive. Its public surface is `zui-dialog-position-*` and `zui-app-shell-sidebar`, both documented.',
}

/** `zui-theme` exports the docs skill deliberately doesn't document. */
export const UNDOCUMENTED_THEME_EXPORTS: Record<string, string> = {}
