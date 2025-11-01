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
import type { LoginUserType } from '@/schema/auth.schema';
import { Form } from './form';

type LoginFormUIPropsType = {
  onSubmit: (
    e?: BaseSyntheticEvent<object, any, any> | undefined
  ) => Promise<void>;
  control: Control<LoginUserType>;
  registerBtn: ComponentProps<'button'>;
  Illustration: ReactNode;
  disabled: boolean;
};

const LoginFormUI: FC<LoginFormUIPropsType> = ({
  control,
  onSubmit,
  registerBtn,
  Illustration,
  disabled,
}) => (
  <Form onSubmit={onSubmit}>
    {Illustration}
    <div className='grow'>
      <FieldGroup>
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
            don't have account?{' '}
            <Button
              disabled={disabled}
              type='button'
              variant='link'
              {...registerBtn}
            >
              Register Here
            </Button>
          </p>
        </div>

        <Button
          disabled={disabled}
          type='submit'
        >
          Login
        </Button>
      </FieldGroup>
    </div>
  </Form>
);

export { LoginFormUI };
