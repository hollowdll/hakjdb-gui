export type GetStringPayload = {
  value: string;
  ok: boolean;
};

export type GetTypeOfKeyPayload = {
  keyType: string;
  ok: boolean;
};

export type GetAllHashMapFieldsAndValuesPayload = {
  fieldValueMap: Record<string, string>;
  ok: boolean;
};

export type DeleteHashMapFieldsPayload = {
  fieldsRemoved: number;
  ok: boolean;
};
