'use client';

import { useForm, FormProvider, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/domains/auth/application/useLogin';
import { Button } from '@/design-system/ui/atoms/buttons/Button';
import { Input } from '@/design-system/ui/atoms/inputs/Input';
import { colors } from '@/presentation/design-system/domain/theme';

interface LoginFormInputs {
  email: string;
  password: string;
}

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading, error } = useLogin();
  const formMethods = useForm<LoginFormInputs>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormInputs) => {
    const user = await login(data.email, data.password);
    if(user) {
      router.push('/dashboard');
    }
  };

  return (
    <FormProvider {...formMethods}>
    <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-4">
    <Controller
      control={formMethods.control}
      name="email"
      rules={{
        required: 'El email es requerido',
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Correo electrónico inválido'
        }
      }}
      render={({ field }) => (
        <Input
          label="Email"
          error={!!formMethods.formState.errors.email}
          helperText={formMethods.formState.errors.email?.message}
          {...field}
        />
      )} />
      <Controller
        control={formMethods.control}
        name="password"
        rules={{
          required: 'La contraseña es requerida',
        }}
        render={({ field }) => (
          <Input
            label="Password"
            type="password"
            error={!!formMethods.formState.errors.password}
            helperText={formMethods.formState.errors.password?.message}
            {...field}
          />
        )}
      />
      <div className="flex justify-center">
        <Button
          type="submit"
          disabled={!formMethods.formState.isValid || isLoading}
          isLoading={isLoading}
          variant="primary"
        >
          Login
        </Button>
      </div>

      {error && (
        <div className="flex justify-center text-center" style={{ color: colors.status.error.DEFAULT }}>
          {error}
        </div>
      )}
    </form>

    </FormProvider>
  );
} 