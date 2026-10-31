import * as React from "react";
import { cn } from "@/lib/utils";

function CodePanel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-panel"
      className={cn(
        "overflow-hidden rounded-lg border border-border-strong bg-popover",
        className,
      )}
      {...props}
    />
  );
}

export { CodePanel };
