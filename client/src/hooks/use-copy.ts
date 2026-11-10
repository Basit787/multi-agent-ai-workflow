import { useToast } from "#/hooks/use-toast";

export function useCopy() {
  const { showSuccessToast, showErrorToast } = useToast();
  return (text: string, label: string) =>
    navigator.clipboard
      .writeText(text)
      .then(() => showSuccessToast(`${label} copied`))
      .catch(() => showErrorToast(new Error("Couldn't copy to the clipboard")));
}
