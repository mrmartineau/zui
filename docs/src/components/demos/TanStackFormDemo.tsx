/** @jsxImportSource react */
import { useForm } from '@tanstack/react-form'
import {
  Button,
  Checkbox,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
  Input,
  Label,
  Radio,
  Textarea,
} from '@mrmartineau/zui/react'
import { useState } from 'react'

interface SignupValues {
  email: string
  username: string
  bio: string
  plan: 'free' | 'pro' | 'team'
  newsletter: boolean
  terms: boolean
}

const PLANS: { value: SignupValues['plan']; label: string }[] = [
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' },
  { value: 'team', label: 'Team' },
]

/** First validation message for a field, only once it has been touched. */
function errorText(meta: { isTouched: boolean; errors: unknown[] }) {
  if (!meta.isTouched) return undefined
  const first = meta.errors.find(Boolean)
  return typeof first === 'string' ? first : undefined
}

export default function TanStackFormDemo() {
  const [submitted, setSubmitted] = useState<SignupValues | null>(null)

  const form = useForm({
    defaultValues: {
      email: '',
      username: '',
      bio: '',
      plan: 'free',
      newsletter: true,
      terms: false,
    } as SignupValues,
    onSubmit: ({ value }) => {
      setSubmitted(value)
    },
  })

  return (
    <form
      style={{ width: '100%' }}
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) =>
              !value
                ? 'Email is required'
                : !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
                  ? 'Enter a valid email address'
                  : undefined,
          }}
        >
          {(field) => {
            const error = errorText(field.state.meta)
            return (
              <Field invalid={Boolean(error)}>
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  placeholder="you@example.com"
                  value={field.state.value}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${field.name}-error` : undefined}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                {error ? (
                  <FieldError id={`${field.name}-error`}>{error}</FieldError>
                ) : (
                  <FieldDescription>
                    We&rsquo;ll only use this to sign you in.
                  </FieldDescription>
                )}
              </Field>
            )
          }}
        </form.Field>

        <form.Field
          name="username"
          validators={{
            onChange: ({ value }) =>
              value.length < 3
                ? 'Username must be at least 3 characters'
                : undefined,
          }}
        >
          {(field) => {
            const error = errorText(field.state.meta)
            return (
              <Field invalid={Boolean(error)}>
                <Label htmlFor={field.name}>Username</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${field.name}-error` : undefined}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                {error && (
                  <FieldError id={`${field.name}-error`}>{error}</FieldError>
                )}
              </Field>
            )
          }}
        </form.Field>

        <form.Field
          name="bio"
          validators={{
            onChange: ({ value }) =>
              value.length > 160 ? 'Keep your bio under 160 characters' : undefined,
          }}
        >
          {(field) => {
            const error = errorText(field.state.meta)
            return (
              <Field invalid={Boolean(error)}>
                <Label htmlFor={field.name}>Bio</Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  rows={3}
                  placeholder="Tell us a little about yourself"
                  value={field.state.value}
                  aria-invalid={Boolean(error)}
                  aria-describedby={`${field.name}-desc`}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                {error ? (
                  <FieldError id={`${field.name}-desc`}>{error}</FieldError>
                ) : (
                  <FieldDescription id={`${field.name}-desc`}>
                    {field.state.value.length}/160 characters
                  </FieldDescription>
                )}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="plan">
          {(field) => (
            <FieldSet>
              <FieldLegend variant="label">Plan</FieldLegend>
              <div className="zui-radio-list">
                {PLANS.map((plan) => (
                  <Radio
                    key={plan.value}
                    name={field.name}
                    value={plan.value}
                    checked={field.state.value === plan.value}
                    onChange={(event) =>
                      field.handleChange(
                        event.target.value as SignupValues['plan'],
                      )
                    }
                  >
                    {plan.label}
                  </Radio>
                ))}
              </div>
            </FieldSet>
          )}
        </form.Field>

        <form.Field name="newsletter">
          {(field) => (
            <Field>
              <Checkbox
                name={field.name}
                checked={field.state.value}
                onChange={(event) => field.handleChange(event.target.checked)}
              >
                Send me product updates
              </Checkbox>
            </Field>
          )}
        </form.Field>

        <form.Field
          name="terms"
          validators={{
            onChange: ({ value }) =>
              value ? undefined : 'You must accept the terms to continue',
          }}
        >
          {(field) => {
            const error = errorText(field.state.meta)
            return (
              <Field invalid={Boolean(error)}>
                <Checkbox
                  name={field.name}
                  checked={field.state.value}
                  aria-invalid={Boolean(error)}
                  onChange={(event) => field.handleChange(event.target.checked)}
                >
                  I accept the terms and conditions
                </Checkbox>
                {error && <FieldError>{error}</FieldError>}
              </Field>
            )
          }}
        </form.Field>

        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
        >
          {({ canSubmit, isSubmitting }) => (
            <div style={{ display: 'flex', gap: 'var(--space-2xs)' }}>
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting ? 'Creating account…' : 'Create account'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset()
                  setSubmitted(null)
                }}
              >
                Reset
              </Button>
            </div>
          )}
        </form.Subscribe>
      </FieldGroup>

      {submitted && (
        <pre
          style={{
            marginTop: 'var(--space-sm)',
            padding: 'var(--space-xs)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            overflowX: 'auto',
            fontSize: 'var(--step--1)',
          }}
        >
          {JSON.stringify(submitted, null, 2)}
        </pre>
      )}
    </form>
  )
}
