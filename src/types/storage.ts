export type GetStringPayload = {
  value: Uint8Array;
  ok: boolean;
};

export type GetKeyTypePayload = {
  keyType: string;
  ok: boolean;
};

export type GetAllHashMapFieldsAndValuesPayload = {
  fieldValueMap: Record<string, Uint8Array>;
  ok: boolean;
};

export type DeleteHashMapFieldsPayload = {
  fieldsRemovedCount: number;
  ok: boolean;
};

export type HashMapFieldValue = {
  value: Uint8Array;
  ok: boolean;
};

export type GetHashMapFieldValuesPayload = {
  fieldValueMap: Record<string, HashMapFieldValue>;
  ok: boolean;
};
