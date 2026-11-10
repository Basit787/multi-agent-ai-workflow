import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs";
import type { AuthMode } from "../types";

export function AuthModeTabs({
  mode,
  onChange,
}: {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
}) {
  return (
    <Tabs value={mode} onValueChange={(value) => onChange(value as AuthMode)}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Sign in</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
