import { Button } from '@/components/ui';

export const BoardError = ({ onRetry }: { onRetry: () => void }) => (
  <div
    role="alert"
    className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-xs"
  >
    <div className="w-1/4 min-w-60 text-center bg-card border border-red-200 rounded-xl px-6 py-16 shadow-2xl">
      <p className="text-destructive text-lg mb-2">Failed to load tasks</p>
      <Button
        type="button"
        variant="outline"
        onClick={() => onRetry()}
        className="text-lg text-blue-600"
      >
        Retry
      </Button>
    </div>
  </div>
);
