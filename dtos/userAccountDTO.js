import joi from 'joi';

const signupDTO = joi.object({
  firstName: joi.string().required().messages({
    'any.required': 'FirstName is required.',
    'string.base': 'FirstName must be a string.',
  }),
  lastName: joi.string().required().messages({
    'any.required': 'LastName is required.',
    'string.base': 'LastName must be a string.',
  }),
  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      tlds: {
        allow: true,
      },
    })
    .required()
    .messages({
      'any.required': 'Email is required',
      'string.email': 'Enter a valid email address',
      'string.base': 'Email must be a string',
    }),

  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/))
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long.',
      'string.max': 'Password must not be more than 30 characters long.',
      'any.required': 'Password is required.',
      'string.pattern.base': 'Provide a valid and secure password characters',
    }),
  role: joi.string().required().messages({
    'any.required': 'Role is required.',
    'string.base': 'Role must be a string.',
  }),
});

const loginDTO = joi.object({
  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      tlds: {
        allow: true,
      },
    })
    .required()
    .messages({
      'string.email': 'Please enter a valid email address.',
      'any.required': 'This field is required.',
    }),

  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/))
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long.',
      'string.max': 'Password must not be more than 30 characters long.',
      'any.required': 'Password is required.',
      'string.pattern.base': 'Provide a valid and secure password characters',
    }),
});

export { loginDTO, signupDTO };
