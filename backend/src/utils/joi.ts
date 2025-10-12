import type {
  ArraySchema,
  ObjectSchema,
  StringSchema,
  ValidationError,
  ValidationResult,
} from "joi";

const formatJoiError = (e: ValidationError) =>
  e.details.reduce((acc, { message, path: paths }) => {
    paths.forEach((path) => {
      let _val = acc[path];

      if (!_val) {
        _val = acc[path] = [];
      }

      _val?.push(message);
    });

    return acc;
  }, {} as Record<string, string[]>);

const validateJoi = <T>(
  schema: ObjectSchema<T> | ArraySchema<T> | StringSchema<T>,
  data: unknown
): ValidationResult<T> =>
  schema.validate(data || {}, {
    stripUnknown: true,
    allowUnknown: false,
    abortEarly: false,
  });

export { formatJoiError, validateJoi };
