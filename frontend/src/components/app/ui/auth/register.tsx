import type { BaseSyntheticEvent, ComponentProps, FC, ReactNode } from 'react';
import { type Control, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { RegisterUserType } from '@/schema/auth.schema';
import { Form } from './form';

type RegisterFormUIPropsType = {
  onSubmit: (
    e?: BaseSyntheticEvent<object, any, any> | undefined
  ) => Promise<void>;
  control: Control<RegisterUserType>;
  resetBtn: ComponentProps<'button'>;
  loginBtn: ComponentProps<'button'>;
  Illustration: ReactNode;
  disabled: boolean;
};

const RegisterFormUI: FC<RegisterFormUIPropsType> = ({
  onSubmit,
  control,
  loginBtn,
  resetBtn,
  Illustration,
  disabled,
}) => (
  <Form onSubmit={onSubmit}>
    <div className='grow'>
      <FieldGroup>
        <Controller
          control={control}
          name='uname'
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>User Name</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                id={field.name}
                placeholder='john'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={control}
          name='email'
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                id={field.name}
                placeholder='jhon@example.com'
                type='email'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={control}
          name='password'
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                id={field.name}
                placeholder={'*'.repeat(8)}
                type='password'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className='capitalize md:flex items-center justify-between'>
          <p>
            already have an account?{' '}
            <Button
              disabled={disabled}
              type='button'
              variant='link'
              {...loginBtn}
            >
              Login Here
            </Button>
          </p>
          <p>
            forget password?{' '}
            <Button
              type='button'
              variant='link'
              {...resetBtn}
              disabled
            >
              Reset Password
            </Button>
          </p>
        </div>

        <Button
          disabled={disabled}
          type='submit'
        >
          Register
        </Button>
      </FieldGroup>
    </div>
    {Illustration}
  </Form>
);

export { RegisterFormUI };
