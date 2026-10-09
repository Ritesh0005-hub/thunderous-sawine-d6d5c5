/** Submit a form to Netlify Forms. Posts to the static skeleton so the SSR function does not intercept it. */
export async function submitNetlifyForm(formName: string, data: Record<string, string>) {
  const body = new URLSearchParams({ 'form-name': formName, ...data }).toString()
  const res = await fetch('/__forms.html', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!res.ok) throw new Error(`Form submission failed (${res.status})`)
}
