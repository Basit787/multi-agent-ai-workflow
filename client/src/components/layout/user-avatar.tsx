import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { cn } from "#/lib/utils";

export function UserAvatar({
  email,
  className,
}: {
  email: string;
  className?: string;
}) {
  return (
    <Avatar className={cn("size-8", className)}>
      <AvatarFallback className="bg-primary text-sm font-medium text-primary-foreground">
        {email.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
