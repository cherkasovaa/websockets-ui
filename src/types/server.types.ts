export const SERVER_TYPES = {
  REG: 'reg',
} as const;

export type ServerTypes = (typeof SERVER_TYPES)[keyof typeof SERVER_TYPES];

export type RegRequestData = {
  name: string;
  password: string;
};

export type RegResponseData = {
  name: string;
  index: number | string;
  error: boolean;
  errorText: string;
};

export type RegRequest = {
  type: ServerTypes;
  data: string;
  id: number;
};

export type RegResponse = {
  type: ServerTypes;
  data: string;
  id: number;
};
