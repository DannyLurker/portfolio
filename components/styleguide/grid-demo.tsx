import { Grid } from "@/components/layout/grid"
import { GridItem } from "@/components/layout/grid-item"

export function GridDemo() {
  return (
    <div className="flex flex-col gap-md">
      <Grid className="gap-y-md">
        {Array.from({ length: 12 }, (_, index) => (
          <GridItem
            key={index}
            span={1}
            spanMd={2}
            spanLg={1}
            className="flex h-16 items-center justify-center rounded border border-border bg-popover type-mono-code text-muted-foreground"
          >
            {index + 1}
          </GridItem>
        ))}
      </Grid>
      <p className="type-body-sm text-muted-foreground">
        Twelve columns at 1024px and up, eight columns from 768px to 1023px,
        four columns below 768px. Gutters are 24px, 20px and 16px. Each cell is
        one column below 768px and two columns from 768px.
      </p>
    </div>
  )
}
