import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { loginSchema, LoginFormData } from '../schemas';
import { useLogin } from '../hooks/useLogin';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DottedSeparator } from '@/components/DottedSeparator';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/router/routes';

export const LogInCard = () => {
  const { mutate, isPending, error } = useLogin();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = (values) => {
    mutate(values, {
      onSuccess: () => navigate(ROUTES.ROOT),
    });
  };

  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none py-2">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Welcome back!</CardTitle>
      </CardHeader>

      <CardContent className="p-7">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input type="email" {...register('email')} placeholder="Enter your email" />
            {errors.email && <span className="text-destructive p-1">{errors.email.message}</span>}
          </div>

          <div>
            <Input type="password" {...register('password')} placeholder="Enter your password" />
            {errors.password && (
              <span className="text-destructive p-1">{errors.password.message}</span>
            )}
          </div>

          <Button className="w-full" disabled={isPending} size="lg">
            {isPending ? 'Signing in...' : 'Login'}
          </Button>
          {error && <div className="text-destructive text-sm">{(error as Error).message}</div>}
        </form>
      </CardContent>

      <div className="px-7">
        <DottedSeparator color="gray" />
      </div>

      <CardContent className="p-7 flex items-center justify-center">
        <p>
          Don&apos;t have an account?{' '}
          <Link to="/sign-up">
            <span className="text-blue-700">Sign Up</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
