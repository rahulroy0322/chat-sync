type DefaultModelType = {
  createdAt: string;
  updatedAt: string;
};

type ModelType<T extends Record<string, unknown>> = T & DefaultModelType;
export type { DefaultModelType, ModelType };
