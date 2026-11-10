import { LogOut, Moon } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "#/components/common/confirm-dialog";
import { UserAvatar } from "#/components/layout/user-avatar";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "#/components/ui/hover-card";
import { Label } from "#/components/ui/label";
import { Separator } from "#/components/ui/separator";
import { Switch } from "#/components/ui/switch";
import { useTheme } from "#/hooks/use-theme";

export function UserMenu({
  user,
  onSignOut,
  isSigningOut,
}: {
  user: { email: string; role: string };
  onSignOut: () => void;
  isSigningOut: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { isDark, setDark } = useTheme();

  return (
    <>
      <HoverCard
        open={open}
        onOpenChange={setOpen}
        openDelay={100}
        closeDelay={200}
      >
        <HoverCardTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Account"
            onClick={() => setOpen((value) => !value)}
          >
            <UserAvatar email={user.email} />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent align="end" className="w-72 p-0">
          <div className="flex items-center gap-3 p-4">
            <UserAvatar email={user.email} className="size-10" />
            <div className="min-w-0 space-y-1">
              <p className="truncate text-sm font-medium">{user.email}</p>
              <Badge variant="secondary" className="capitalize">
                {user.role}
              </Badge>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between px-4 py-3">
            <Label htmlFor="dark-mode" className="font-normal">
              <Moon className="size-4 text-muted-foreground" />
              Dark mode
            </Label>
            <Switch id="dark-mode" checked={isDark} onCheckedChange={setDark} />
          </div>
          <Separator />
          <div className="p-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => {
                setOpen(false);
                setConfirmOpen(true);
              }}
            >
              <LogOut />
              Log out
            </Button>
          </div>
        </HoverCardContent>
      </HoverCard>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Log out?"
        description="You'll need to sign in again to see your workflows. Runs in progress keep going."
        confirmLabel="Log out"
        icon={LogOut}
        loading={isSigningOut}
        onConfirm={onSignOut}
      />
    </>
  );
}
