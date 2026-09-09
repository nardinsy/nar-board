import { Spinner } from '@/components/ui/spinner';
import { useLogout } from '../hooks/useLogout';
import { Button } from '@/components/ui';

export const SignOutBtn = () => {
  const { mutate: logout, isPending } = useLogout();
  return (
    <Button type="button" variant="outline" onClick={() => logout()} disabled={isPending}>
      {isPending ? <Spinner /> : 'Sign out'}
    </Button>
  );
};
