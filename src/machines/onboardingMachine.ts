/**
 * onboardingMachine — second canonical multi-step flow (≥3 transitions).
 *
 * Demonstrates the same pattern as loginMachine: framework-agnostic actor,
 * consumed in Vue via useMachine. Paste into https://stately.ai to visualize.
 */
import { setup, assign } from 'xstate';

type OnboardingContext = {
  displayName: string;
  themeChoice: 'light' | 'dark' | null;
};

type OnboardingEvent =
  | { type: 'EDIT_NAME'; value: string }
  | { type: 'PICK_THEME'; value: 'light' | 'dark' }
  | { type: 'CONTINUE' }
  | { type: 'BACK' }
  | { type: 'FINISH' };

export const onboardingMachine = setup({
  types: {} as { context: OnboardingContext; events: OnboardingEvent },
  guards: {
    hasName: ({ context }) => context.displayName.trim().length >= 2,
    hasTheme: ({ context }) => context.themeChoice !== null
  },
  actions: {
    setName: assign(({ context, event }) =>
      event.type === 'EDIT_NAME' ? { displayName: event.value } : context
    ),
    setTheme: assign(({ context, event }) =>
      event.type === 'PICK_THEME' ? { themeChoice: event.value } : context
    )
  }
}).createMachine({
  id: 'onboarding',
  initial: 'welcome',
  context: { displayName: '', themeChoice: null },
  states: {
    welcome: {
      on: {
        EDIT_NAME: { actions: 'setName' },
        CONTINUE: { target: 'choosingTheme', guard: 'hasName' }
      }
    },
    choosingTheme: {
      on: {
        PICK_THEME: { actions: 'setTheme' },
        BACK: 'welcome',
        CONTINUE: { target: 'complete', guard: 'hasTheme' }
      }
    },
    complete: {
      type: 'final',
      on: { FINISH: 'welcome' }
    }
  }
});

export type OnboardingMachine = typeof onboardingMachine;
