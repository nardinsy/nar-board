import { SignOutBtn } from '@/features/auth/components/SignOutbtn';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { UserProfileBtn } from '@/features/auth/components/UserProfileBtn';
import { capitalize } from '@/utils/helpers';
import { Board } from '../types';
import { ThemeToggle } from '@/components/ThemeToggle';

export const BoardHeader = ({ board }: { board: Board }) => {
  const user = useAuthStore((state) => state.user);
  if (!user) return null;

  return (
    <header className="flex justify-between items-center p-4 border-b-2 shadow-2xs bg-background]">
      <h3 className="font-semibold text-lg text-foreground">{board?.title}</h3>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserProfileBtn />
        <div className="text-primary">{capitalize(user.role)}</div>
        <SignOutBtn />
      </div>
    </header>
  );
};
