import { FormField } from "@/components/form-field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function FormStates() {
  return (
    <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
      <FormField
        id="styleguide-name"
        label="Default field"
        hint="Help text sits under the control and is announced with it."
      >
        <Input placeholder="Your name" />
      </FormField>

      <FormField
        id="styleguide-email"
        label="Error field"
        required
        error="Enter a valid email address."
      >
        <Input type="email" defaultValue="not-an-email" />
      </FormField>

      <FormField
        id="styleguide-focus"
        label="Focus, simulated with the focus ring"
      >
        <Input
          placeholder="Focused field"
          className="border-ring ring-2 ring-ring ring-offset-2 ring-offset-background"
        />
      </FormField>

      <FormField id="styleguide-disabled" label="Disabled field">
        <Input disabled placeholder="Unavailable" />
      </FormField>

      <FormField
        id="styleguide-message"
        label="Textarea"
        hint="Textareas share the input boundary and the same focus ring."
        className="md:col-span-2"
      >
        <Textarea placeholder="Tell me about the project" />
      </FormField>
    </div>
  )
}
