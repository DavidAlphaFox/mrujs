// Shamelessly stolen from Turbo. Makes the submit event listenable from Safari.
// https://github.com/hotwired/turbo/blob/main/src/polyfills/submit-event.ts

type FormSubmitter = HTMLElement & { form?: HTMLFormElement, type?: string }

const submittersByForm: WeakMap<HTMLFormElement, HTMLElement> = new WeakMap()

function findSubmitterFromClickTarget (target: EventTarget | null): FormSubmitter | null {
  const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null
  const candidate = (element != null) ? element.closest('input, button') as FormSubmitter : null

  if ((candidate != null) && candidate.type === 'submit') {
    return candidate
  }

  return null
}

function clickCaptured (event: Event): void {
  const submitter = findSubmitterFromClickTarget(event.target)

  if (submitter?.form != null) {
    submittersByForm.set(submitter.form, submitter)
  }
}

(function () {
  // No need to continue, polyfill not needed.
  if ('SubmitEvent' in window) return

  addEventListener('click', clickCaptured, true)

  Object.defineProperty(Event.prototype, 'submitter', {
    get (): HTMLElement | undefined {
      if (this.type === 'submit' && this.target instanceof HTMLFormElement) {
        return submittersByForm.get(this.target)
      }

      return undefined
    }
  })
})()