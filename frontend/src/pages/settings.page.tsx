/** biome-ignore-all lint/a11y/noLabelWithoutControl: used with radio buttons */
import {
  LaptopMinimal,
  LayoutPanelLeft,
  Moon,
  Sun,
  SunMoon,
  UserCircle2,
} from 'lucide-react';
import { type FC, type ReactNode, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  type ThemeModeType,
  useMode,
} from '@/components/app/logic/themes/mode';
import { type ThemeType, useTheme } from '@/components/app/logic/themes/theme';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { RegisterUserType } from '@/schema/auth.schema';
import useUser from '@/store/user.store';

type SettingsTabsKeysType = 'account' | 'preferences';

type SettingsTabsContentPropsType = {
  value: SettingsTabsKeysType;
  children: ReactNode;
};

const SettingsTabsContent: FC<SettingsTabsContentPropsType> = ({
  children,
  value,
}) => (
  <TabsContent
    className='flex flex-col items-center justify-center overflow-hidden'
    value={value}
  >
    {children}
  </TabsContent>
);

type SettingsTabsTriggerPropsType = {
  value: SettingsTabsKeysType;
  children: ReactNode;
  Icon: ReactNode;
};

const SettingsTabsTrigger: FC<SettingsTabsTriggerPropsType> = ({
  children,
  value,
  Icon,
}) => (
  <TabsTrigger
    className='flex items-center justify-center gap-1 py-2 px-4 rounded-sm text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground grow-0 cursor-pointer border-none'
    value={value}
  >
    {Icon}
    {children}
  </TabsTrigger>
);

const AccountSettingsTab: FC = () => {
  const [loading, setLoading] = useState(false);
  const user = useUser((state) => state.user);

  const form = useForm({
    defaultValues: {
      uname: user?.uname || '',
      email: user?.email || '',
    } satisfies Omit<RegisterUserType, 'password'>,
  });

  const handleSubmit = (props: Omit<RegisterUserType, 'password'>) => {
    const { email, uname } = props;
    if (!uname || !email) {
      toast.error('user name and email is required!');
      return;
    }

    if (!user) {
      return;
    }

    if (user.email === email && user.uname === uname) {
      toast.error('please enter something to update!');
      return;
    }

    toast.promise(
      () =>
        new Promise(async (res, _rej) => {
          try {
            setLoading(true);
            // simulate
            await new Promise((res2) => setTimeout(res2, 1500 * Math.random()));
            // const _data = await register(props);

            // if ("error" in _data) {
            //   return rej(_data.error as Error);
            // }

            // const {
            //   data: {
            //     token: { access, refresh },
            //     user,
            //   },
            // } = _data;

            // useUser.setState({
            //   user,
            //   refreshToken: refresh,
            //   token: access,
            // });
            res(null);
          } finally {
            setLoading(false);
          }
        }),
      {
        loading: 'Loading...',
        success: () => 'Account Update Success...',
        error: (e: Error) => e.message,
      }
    );
  };

  return (
    <SettingsTabsContent value='account'>
      <section className='w-[90%] max-w-3xl m-auto'>
        <h3 className='text-xl font-semibold capitalize'>My profile</h3>

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <FieldLegend className='capitalize'>my Account</FieldLegend>
            <Controller
              control={form.control}
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Button disabled={loading}>Update Account</Button>
          </FieldGroup>
        </form>
      </section>
    </SettingsTabsContent>
  );
};

type SettingsModeItemPropsType = {
  value: ThemeModeType;
  title: Capitalize<ThemeModeType | string>;
  Icon: FC<{
    className: string;
  }>;
};

const SettingsModeItem: FC<SettingsModeItemPropsType> = ({
  Icon,
  title,
  value,
}) => (
  <label className='cursor-pointer [&:has([data-state=checked])>div]:ring-primary [&:has([data-state=checked])>div]:ring-2 grow max-w-36'>
    <RadioGroupItem
      className='sr-only'
      value={value}
    />
    <span className='sr-only'>{title}</span>
    <div
      className='aspect-square shadow-2xl shadow-primary/50 rounded-md p-1 ring-1 ring-input'
      role='presentation'
    >
      <div
        className='h-full w-full p-6 rounded-sm'
        role='presentation'
      >
        <Icon className='h-full w-full stroke-2' />
      </div>
    </div>
  </label>
);

type SettingsThemeItemPropsType = {
  value: ThemeType;
  title: Capitalize<ThemeType | string>;
};

const SettingsThemeItem: FC<SettingsThemeItemPropsType> = ({
  title,
  value,
}) => (
  <label
    className={`cursor-pointer [&:has([data-state=checked])>div]:ring-primary [&:has([data-state=checked])>div]:ring-2 grow basis-1/3 max-w-36 ${value}`}
  >
    <RadioGroupItem
      className='sr-only'
      value={value}
    />
    <span className='sr-only'>{title}</span>
    <div
      className='aspect-square shadow-2xl shadow-primary/50 rounded-md p-1 ring-1 ring-accent-foreground dark:ring-accent flex gap-1'
      role='presentation'
    >
      <div
        className='border-r-2 flex flex-col gap-1 p-1 basis-1/3'
        role='presentation'
      >
        <div
          className='h-2 bg-primary/80'
          role='presentation'
        />
        <div
          className='h-2 bg-secondary/80'
          role='presentation'
        />
      </div>

      <div
        className='flex flex-col grow'
        role='presentation'
      >
        <div
          className='basis-1/5 border-b'
          role='presentation'
        />
        <div
          className='grow bg-primary p-3'
          role='presentation'
        >
          <LayoutPanelLeft className='h-full w-full stroke-2 text-background' />
        </div>
      </div>
    </div>
  </label>
);

const PreferencesSettingsTab: FC = () => {
  const { setMode, mode } = useMode();
  const { setTheme, theme } = useTheme();
  return (
    <SettingsTabsContent value='preferences'>
      <section className='w-[90%] max-w-4xl m-auto space-y-5 grow overflow-scroll'>
        <h3 className='text-xl font-semibold capitalize'>My preferences</h3>

        <FieldSet>
          <FieldLegend>Mode(Light/Dark)</FieldLegend>

          <RadioGroup
            className='flex justify-center items-center gap-4 p-2'
            defaultValue={mode}
            onValueChange={setMode}
          >
            <SettingsModeItem
              Icon={Moon}
              title='Dark'
              value='dark'
            />

            <SettingsModeItem
              Icon={Sun}
              title='Light'
              value='light'
            />

            <SettingsModeItem
              Icon={LaptopMinimal}
              title='System Default'
              value='system'
            />
          </RadioGroup>
        </FieldSet>

        <Separator />
        <FieldSet>
          <FieldLegend>Theme</FieldLegend>

          <RadioGroup
            className='flex justify-end items-center gap-4 pt-2 flex-wrap'
            defaultValue={theme}
            onValueChange={setTheme}
          >
            <SettingsThemeItem
              title='Default'
              value='default'
            />
            <SettingsThemeItem
              title='Rose'
              value='rose'
            />
            <SettingsThemeItem
              title='Blue'
              value='blue'
            />
            <SettingsThemeItem
              title='Green'
              value='green'
            />
            <SettingsThemeItem
              title='Violet'
              value='violet'
            />
          </RadioGroup>
        </FieldSet>
      </section>
    </SettingsTabsContent>
  );
};

const SettingsPage: FC = () => {
  return (
    <Tabs
      className='grow px-4 py-2 h-full overflow-hidden'
      defaultValue={'account' satisfies SettingsTabsKeysType}
    >
      <h2 className='text-2xl font-bold font-serif'>Settings</h2>

      <TabsList className='w-full rounded-none bg-transparent'>
        <SettingsTabsTrigger
          Icon={<UserCircle2 />}
          value='account'
        >
          My Profile
        </SettingsTabsTrigger>
        <SettingsTabsTrigger
          Icon={<SunMoon />}
          value='preferences'
        >
          Preferences
        </SettingsTabsTrigger>
      </TabsList>

      <AccountSettingsTab />
      <PreferencesSettingsTab />
    </Tabs>
  );
};

export default SettingsPage;
