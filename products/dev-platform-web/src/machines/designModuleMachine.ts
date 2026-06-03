import { setup, assign } from 'xstate'
import type { PreviewMode, PreviewVars, StyleSelection, StyleTab } from '../types/style-preset'

export type DesignModuleContext = {
  activeTab: StyleTab
  selection: StyleSelection | null
  previewMode: PreviewMode
  previewVars: PreviewVars | null
  supplementNotes: string
  exportResult: { outputDir: string; files: string[] } | null
  error: string | null
  loadingPreview: boolean
  exporting: boolean
}

export type DesignModuleEvent =
  | { type: 'SWITCH_TAB'; tab: StyleTab }
  | { type: 'SELECT_STYLE'; selection: StyleSelection }
  | { type: 'PREVIEW_LOADED'; vars: PreviewVars }
  | { type: 'PREVIEW_FAILED'; message: string }
  | { type: 'APPLY_TO_PRODUCT' }
  | { type: 'BACK_TO_SAMPLE' }
  | { type: 'EDIT_NOTES'; value: string }
  | { type: 'CONFIRM' }
  | { type: 'EXPORT_DONE'; result: { outputDir: string; files: string[] } }
  | { type: 'EXPORT_FAILED'; message: string }
  | { type: 'DISMISS_ERROR' }

export const designModuleMachine = setup({
  types: {} as { context: DesignModuleContext; events: DesignModuleEvent },
  guards: {
    hasSelection: ({ context }) => context.selection !== null
  },
  actions: {
    setTab: assign(({ context, event }) =>
      event.type === 'SWITCH_TAB'
        ? {
            activeTab: event.tab,
            selection: null,
            previewVars: null,
            previewMode: 'sample' as PreviewMode
          }
        : context
    ),
    setSelection: assign(({ event }) =>
      event.type === 'SELECT_STYLE'
        ? {
            selection: event.selection,
            previewMode: 'sample' as PreviewMode,
            previewVars: null,
            loadingPreview: true,
            error: null
          }
        : {}
    ),
    setPreview: assign(({ event }) =>
      event.type === 'PREVIEW_LOADED'
        ? {
            previewVars: event.vars,
            loadingPreview: false,
            error: null
          }
        : {}
    ),
    setPreviewError: assign(({ event }) =>
      event.type === 'PREVIEW_FAILED'
        ? { loadingPreview: false, error: event.message, previewVars: null }
        : {}
    ),
    applyToProduct: assign({ previewMode: 'product' as PreviewMode }),
    backToSample: assign({ previewMode: 'sample' as PreviewMode }),
    setNotes: assign(({ context, event }) =>
      event.type === 'EDIT_NOTES' ? { supplementNotes: event.value } : context
    ),
    startExport: assign({ exporting: true, error: null }),
    finishExport: assign(({ event }) =>
      event.type === 'EXPORT_DONE'
        ? { exporting: false, exportResult: event.result, error: null }
        : {}
    ),
    failExport: assign(({ event }) =>
      event.type === 'EXPORT_FAILED' ? { exporting: false, error: event.message } : {}
    ),
    dismissError: assign({ error: null })
  }
}).createMachine({
  id: 'designModule',
  initial: 'browsing',
  context: {
    activeTab: 'aesthetic',
    selection: null,
    previewMode: 'sample',
    previewVars: null,
    supplementNotes: '',
    exportResult: null,
    error: null,
    loadingPreview: false,
    exporting: false
  },
  states: {
    browsing: {
      on: {
        SWITCH_TAB: { actions: 'setTab' },
        SELECT_STYLE: { actions: 'setSelection' },
        PREVIEW_LOADED: { actions: 'setPreview' },
        PREVIEW_FAILED: { actions: 'setPreviewError' },
        APPLY_TO_PRODUCT: { actions: 'applyToProduct', guard: 'hasSelection' },
        BACK_TO_SAMPLE: { actions: 'backToSample' },
        EDIT_NOTES: { actions: 'setNotes' },
        CONFIRM: { target: 'exporting', guard: 'hasSelection' },
        DISMISS_ERROR: { actions: 'dismissError' }
      }
    },
    exporting: {
      entry: 'startExport',
      on: {
        EXPORT_DONE: { target: 'complete', actions: 'finishExport' },
        EXPORT_FAILED: { target: 'browsing', actions: 'failExport' }
      }
    },
    complete: {
      on: {
        SELECT_STYLE: { target: 'browsing', actions: 'setSelection' },
        SWITCH_TAB: { target: 'browsing', actions: 'setTab' },
        DISMISS_ERROR: { actions: 'dismissError' }
      }
    }
  }
})

export type DesignModuleMachine = typeof designModuleMachine
