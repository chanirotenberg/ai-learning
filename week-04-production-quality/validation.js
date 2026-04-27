import Joi from "joi";

export const documentIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

export function validateParams(schema, params) {
  const { error, value } = schema.validate(params, {
    abortEarly: false,
    convert: true,
  });

  if (error) {
    const message = error.details.map((detail) => detail.message).join(", ");
    const validationError = new Error(message);
    validationError.statusCode = 400;
    throw validationError;
  }

  return value;
}