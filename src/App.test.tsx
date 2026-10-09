import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from './App'
import { StoreProvider } from './store'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <StoreProvider>
        <App />
      </StoreProvider>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  localStorage.clear()
  // No backend in tests: the client must fall back to on-device answers.
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
  window.scrollTo = vi.fn()
})

it('Ask screen routes a scam question and shows the tells', async () => {
  renderAt('/')
  fireEvent.change(screen.getByLabelText('Your question'), {
    target: { value: 'USPS: your package is on hold. Pay the fee within 24 hours at usps-help.top' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Send' }))
  // Wait for the final answer (the on-device card shows earlier, while Owly is thinking).
  expect(await screen.findByRole('button', { name: /open the message checker/i })).toBeInTheDocument()
  expect(screen.getByText('This is very likely a scam')).toBeInTheDocument()
  expect(screen.getByText('The link does not match who it claims to be')).toBeInTheDocument()
})

it('Ask screen chats, then routes when the topic fits', async () => {
  renderAt('/')
  const box = () => screen.getByLabelText('Your question')
  fireEvent.change(box(), { target: { value: 'Hello there' } })
  fireEvent.click(screen.getByRole('button', { name: 'Send' }))
  expect(await screen.findByText(/how is your day going/i)).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: /exercises|medicines|checker/i })).not.toBeInTheDocument()

  fireEvent.change(box(), { target: { value: 'My knee hurts when I walk' } })
  fireEvent.click(screen.getByRole('button', { name: 'Send' }))
  expect(await screen.findByRole('button', { name: /see exercises/i })).toBeInTheDocument()
  expect(screen.getByText('Hello there')).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: /start a new conversation/i }))
  expect(screen.queryByText('Hello there')).not.toBeInTheDocument()
})

it('Marks on-device answers as limited mode in the chat and the message checker', async () => {
  renderAt('/')
  fireEvent.change(screen.getByLabelText('Your question'), { target: { value: 'Hello there' } })
  fireEvent.click(screen.getByRole('button', { name: 'Send' }))
  expect(await screen.findByText(/limited mode/i)).toBeInTheDocument()
})

it('Message checker marks a fallback result as limited mode', async () => {
  renderAt('/scam')
  fireEvent.change(screen.getByLabelText('The message you got'), { target: { value: 'Send gift cards now' } })
  fireEvent.click(screen.getByRole('button', { name: 'Check this message' }))
  expect(await screen.findByText(/limited mode/i)).toBeInTheDocument()
})

it('Chat shows the on-device scam check while Owly is still thinking', async () => {
  vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})))
  renderAt('/')
  fireEvent.change(screen.getByLabelText('Your question'), {
    target: { value: 'USPS: your package is on hold. Pay the fee within 24 hours at usps-help.top' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Send' }))
  expect(screen.getByText('Owly is thinking…')).toBeInTheDocument()
  expect(screen.getByText('This is very likely a scam')).toBeInTheDocument()
})

it('Message checker explains each warning sign and offers to report', async () => {
  renderAt('/scam')
  fireEvent.change(screen.getByLabelText('The message you got'), {
    target: { value: "Grandma it's me, I need bail money. Don't tell mom. Send gift cards." },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Check this message' }))
  expect(await screen.findByText('It asks you to keep it secret')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /how to report it/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /add my person/i })).toBeInTheDocument()
})

it('Adding two interacting medicines shows a warning', async () => {
  renderAt('/meds/add?name=Warfarin')
  fireEvent.click(screen.getByRole('button', { name: /once, in the morning/i }))
  fireEvent.click(screen.getByRole('button', { name: /save warfarin/i }))
  expect(await screen.findByRole('heading', { name: 'My medicines' })).toBeInTheDocument()

  fireEvent.click(screen.getByRole('link', { name: /add a medicine/i }))
  fireEvent.change(screen.getByLabelText(/name on the bottle/i), { target: { value: 'advil' } })
  fireEvent.click(screen.getByRole('button', { name: 'Ibuprofen' }))
  fireEvent.click(screen.getByRole('button', { name: /once, at bedtime/i }))
  fireEvent.click(screen.getByRole('button', { name: /save ibuprofen/i }))

  const warnings = await screen.findByRole('region', { name: /medicine warnings/i })
  expect(within(warnings).getByText(/warfarin and ibuprofen/i)).toBeInTheDocument()
})

it('Mobility offers at most three routines and a rough day stays seated', () => {
  renderAt('/move')
  fireEvent.click(screen.getByRole('button', { name: /rough/i }))
  const starts = screen.getAllByRole('link', { name: /^start /i })
  expect(starts.length).toBeLessThanOrEqual(3)
  expect(starts.map((s) => s.textContent)).not.toContain('Start Standing Balance')
})
