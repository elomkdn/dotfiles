import type { ClientModule } from 'claude-code'

// A fish swimming back and forth in a small pond, with a bubble now and then
type Pond = { x: number; dir: 1 | -1; bubble: number }

const STEP_MS = 160

const Fish: ClientModule<null, { pond: Pond; t: number }> = (_props, s) => {
  const { Text } = s.elements

  if (s.state === undefined) {
    const pond: Pond = { x: 0, dir: 1, bubble: -1 }
    let t = 0
    s.every(STEP_MS, () => {
      const width = s.columns || 10
      pond.x += pond.dir
      if (pond.x >= width - 4 || pond.x <= 0) pond.dir = pond.dir === 1 ? -1 : 1
      pond.bubble = t % 9 === 0 ? pond.x + (pond.dir === 1 ? 3 : -1) : -1
      t += 1
      s.setState({ pond, t })
    })
    s.setState({ pond, t: 0 })
  }

  const pond = s.state?.pond ?? { x: 0, dir: 1, bubble: -1 }
  const width = s.columns || 10
  // Bowl's colors: a maroon tail, a peach body, rosewater bubbles
  const fish = pond.dir === 1 ? ['>', '<>'] : ['<>', '<']
  const cells = Array.from({ length: width }, () => ' ')
  if (pond.bubble >= 0 && pond.bubble < width) cells[pond.bubble] = '°'
  const before = cells.slice(0, pond.x).join('')
  const after = cells.slice(pond.x + 3, width).join('')

  return (
    <Text wrap="truncate">
      <Text color="#f5e0dc">{before}</Text>
      <Text color={pond.dir === 1 ? '#eba0ac' : '#fab387'}>{fish[0]}</Text>
      <Text color={pond.dir === 1 ? '#fab387' : '#eba0ac'}>{fish[1]}</Text>
      <Text color="#f5e0dc">{after}</Text>
    </Text>
  )
}

export default Fish
