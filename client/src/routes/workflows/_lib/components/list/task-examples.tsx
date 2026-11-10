import { Button } from "#/components/ui/button";

const EXAMPLES = [
  "Plan a three-day trip to Lisbon on a mid-range budget",
  "Write a launch announcement for a note-taking app",
  "Compare PostgreSQL and MongoDB for a small SaaS",
];

export function TaskExamples({ onPick }: { onPick: (task: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {EXAMPLES.map((example) => (
        <Button
          key={example}
          type="button"
          variant="outline"
          size="xs"
          className="rounded-full font-normal text-muted-foreground"
          onClick={() => onPick(example)}
        >
          {example}
        </Button>
      ))}
    </div>
  );
}
