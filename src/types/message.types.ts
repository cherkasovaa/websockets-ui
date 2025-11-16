export const MSG_TYPE = {
  ERROR: 'error',
  MSG: 'msg',
} as const;

export type Message = (typeof MSG_TYPE)[keyof typeof MSG_TYPE];
