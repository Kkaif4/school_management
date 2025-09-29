import * as React from 'react';
import type { ToastActionElement, ToastProps } from '@/components/ui/toast';

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

// --- Toast types ---
export type ToastType = 'success' | 'info' | 'warning' | 'error';

export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  type?: ToastType;
};

// --- Action types ---
const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const;

type ActionType = typeof actionTypes;

type Action =
  | { type: ActionType['ADD_TOAST']; toast: ToasterToast }
  | {
      type: ActionType['UPDATE_TOAST'];
      toast: Partial<ToasterToast> & { id: string };
    }
  | { type: ActionType['DISMISS_TOAST']; toastId?: string }
  | { type: ActionType['REMOVE_TOAST']; toastId?: string };

interface State {
  toasts: ToasterToast[];
}

// --- ID generation ---
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

// --- Timeout management ---
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: 'REMOVE_TOAST', toastId });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

// --- Reducer ---
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case 'DISMISS_TOAST': {
      const { toastId } = action;
      if (toastId) addToRemoveQueue(toastId);
      else state.toasts.forEach((t) => addToRemoveQueue(t.id));

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          toastId === undefined || t.id === toastId ? { ...t, open: false } : t
        ),
      };
    }

    case 'REMOVE_TOAST':
      if (!action.toastId) return { ...state, toasts: [] };
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };

    default:
      return state;
  }
};

// --- Global state + listeners ---
const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

// --- Toast creation ---
type ToastOptions = Omit<ToasterToast, 'id' | 'open' | 'onOpenChange'>;

type ToastReturn = {
  id: string;
  dismiss: () => void;
  update: (props: Partial<ToasterToast>) => void;
};

type ToastFunction = {
  (props: ToastOptions): ToastReturn;
  error: (props: ToastOptions) => ToastReturn;
  success: (props: ToastOptions) => ToastReturn;
  info: (props: ToastOptions) => ToastReturn;
  warning: (props: ToastOptions) => ToastReturn;
};

const toast = ((props: ToastOptions) => {
  const id = genId();

  const update = (updateProps: Partial<ToasterToast>) =>
    dispatch({ type: 'UPDATE_TOAST', toast: { ...updateProps, id } });

  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return { id, dismiss, update };
}) as ToastFunction;

// --- React hook ---
function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  };
}

export { useToast, toast };
