import { AlertCircle } from "lucide-react";

interface EmptyStateProps {
  message: string;
  title?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ 
  message, 
  title,
  icon 
}: EmptyStateProps) {
  return (
    <div className='flex flex-1 items-center justify-center'>
      <div className='text-center'>
        <div className='flex justify-center mb-4'>
          {icon || <AlertCircle className='h-12 w-12 text-muted-foreground' />}
        </div>
        {title && (
          <h2 className='text-xl font-semibold mb-2'>{title}</h2>
        )}
        <p className='text-muted-foreground'>
          {message}
        </p>
      </div>
    </div>
  );
}

