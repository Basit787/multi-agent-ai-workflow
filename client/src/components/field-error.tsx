export function FieldError({ errors }: { errors: unknown[] }) {
  const message = errors
    .map((e) => (e as { message?: string } | undefined)?.message)
    .find(Boolean);
  return message ? <p className="text-sm text-destructive">{message}</p> : null;
}
