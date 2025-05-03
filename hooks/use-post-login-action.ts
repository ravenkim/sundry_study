import { useEffect } from "react";

export type PostLoginAction =
  | "SAVE_THEME"
  | "AI_GENERATE"
  | "SAVE_THEME_FOR_SHARE"
  | null;
type PostLoginHandler = () => void | Promise<void>;

const handlers: Map<PostLoginAction, PostLoginHandler[]> = new Map();
const readyActions: Set<PostLoginAction> = new Set();
let pendingAction: PostLoginAction = null;

export function usePostLoginAction(
  action: PostLoginAction,
  handler: PostLoginHandler
) {
  useEffect(() => {
    if (!action) return;

    if (!handlers.has(action)) {
      handlers.set(action, []);
    }
    handlers.get(action)!.push(handler);

    // Signal this action type is ready to be executed if needed
    readyActions.add(action);

    // If there's a pending action that matches this one, execute it
    if (pendingAction === action) {
      executePostLoginActionInternal(action);
      pendingAction = null;
    }

    return () => {
      const actionHandlers = handlers.get(action);
      if (actionHandlers) {
        const index = actionHandlers.indexOf(handler);
        if (index > -1) {
          actionHandlers.splice(index, 1);
        }

        // If no more handlers for this action, remove from ready set
        if (actionHandlers.length === 0) {
          readyActions.delete(action);
        }
      }
    };
  }, [action, handler]);
}

// Internal function to actually execute handlers
async function executePostLoginActionInternal(action: PostLoginAction) {
  if (!action) return;

  const actionHandlers = handlers.get(action);
  if (actionHandlers && actionHandlers.length > 0) {
    for (const handler of actionHandlers) {
      await handler();
    }
  }
}

// This function should be called when a user successfully logs in
export async function executePostLoginAction(action: PostLoginAction) {
  if (!action) return;

  // If handlers for this action type are ready, execute immediately
  if (readyActions.has(action)) {
    await executePostLoginActionInternal(action);
  } else {
    // Otherwise, set as pending to be executed when handlers are registered
    pendingAction = action;
  }
}
