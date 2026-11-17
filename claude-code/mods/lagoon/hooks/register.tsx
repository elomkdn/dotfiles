import type { Register } from 'claude-code'

// Past-tense words for the line that closes a turn ("Drifted for 12s")
const PAST = ['Drifted', 'Snorkeled', 'Paddled', 'Floated', 'Swam', 'Waded', 'Sailed', 'Dove', 'Rippled', 'Surfed']

// Catppuccin Mocha, as in Lagoon, and the fish of the Bowl widget
const C = {
  teal: '#94e2d5',
  sky: '#89dceb',
  red: '#f38ba8',
  overlay: '#6c7086',
  subtext: '#a6adc8',
  peach: '#fab387',
  maroon: '#eba0ac',
  rosewater: '#f5e0dc',
  deepTeal: '#5fb3a6',
  foam: '#b9ece4',
  eye: '#11111b',
}

// Bowl's fish in Lagoon's teal, 5 dots by 3, drawn twice as big, with two bubbles rising ahead of it
const FISH: readonly string[] = ['f.f..', '.bbeb', 'f.bb.']
const DOTS: (string | undefined)[][] = (() => {
  const grid: (string | undefined)[][] = Array.from({ length: 6 }, () => Array.from({ length: 14 }, () => undefined))
  const paint: Record<string, string> = { f: C.deepTeal, b: C.teal, e: C.eye }
  FISH.forEach((row, y) =>
    [...row].forEach((d, x) => {
      const color = paint[d]
      if (!color) return
      for (const [dy, dx] of [[0, 0], [0, 1], [1, 0], [1, 1]] as const) {
        const line = grid[y * 2 + dy]
        if (line) line[x * 2 + dx] = color
      }
    }),
  )
  const put = (x: number, y: number) => {
    const line = grid[y]
    if (line) line[x] = C.foam
  }
  put(11, 2)
  put(13, 0)
  return grid
})()

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    void $.ui.place({ id: 'welcome' })

    return next(e)
  })

  // A fish swims in its pond beside the spinner, which keeps its time and tokens. The
  // spinner's block opens on an empty row: the pond starts one row down, on the spinner's text
  on('ui.render', { component: 'Spinner' }, async ($, e, next) => {
    if (e.surface !== 'terminal') return next(e)
    const { Box, Client } = $.ui.resolve(e)
    const line = await next(e)

    return (
      <Box flexDirection="row">
        <Box marginTop={1} flexShrink={0}>
          <Client key="fish" module="./fish.tsx" width={10} height={1} />
        </Box>
        {line}
      </Box>
    )
  })

  // The welcome banner at the top of the session: Bowl's fish, in half blocks
  on('ui.render', { component: 'Placed' }, ($, e, next) => {
    if (e.props.plugin !== 'lagoon' || e.props.id !== 'welcome') return next(e)
    const { Box, Text } = $.ui.resolve(e)
    const beside = [
      null,
      <Text color={C.teal} bold>
        Lagoon
      </Text>,
      <Text color={C.subtext} italic>
        calm waters, clear code
      </Text>,
    ]

    return (
      <Box flexDirection="column" paddingLeft={1} paddingY={1}>
        {[0, 1, 2].map(row => (
          <Box key={`row-${row}`} flexDirection="row">
            <Text>
              {(DOTS[row * 2] ?? []).map((top, x) => {
                const bottom = DOTS[row * 2 + 1]?.[x]
                const key = String(x)
                if (!top && !bottom) return <Text key={key}> </Text>
                if (top && !bottom) return <Text key={key} color={top}>▀</Text>
                if (!top && bottom) return <Text key={key} color={bottom}>▄</Text>
                if (top === bottom) return <Text key={key} color={top}>█</Text>
                return <Text key={key} color={top} backgroundColor={bottom}>▀</Text>
              })}
            </Text>
            <Text>{'   '}</Text>
            {beside[row]}
          </Box>
        ))}
      </Box>
    )
  })

  // A bubble beside each tool call: rising while it runs, teal once done
  on('ui.render', { component: 'ToolUse' }, async ($, e, next) => {
    if (e.surface !== 'terminal') return next(e)
    const { Box, Text } = $.ui.resolve(e)
    const p = e.props
    const [glyph, color] = p.isInterrupted
      ? ['·', C.overlay]
      : p.isErrored
        ? ['×', C.red]
        : p.isRunning
          ? ['o', C.sky]
          : ['°', C.teal]
    const row = await next(e)

    return (
      <Box flexDirection="row">
        <Text color={color}>{glyph} </Text>
        <Box flexDirection="column" flexGrow={1}>
          {row}
        </Box>
      </Box>
    )
  })

  // One word per line, stable across redraws
  on('ui.render', { component: 'TurnDuration' }, ($, e, next) => {
    const word = PAST[Math.floor(e.props.durationMs / 1000) % PAST.length] ?? 'Drifted'

    return next({ ...e, props: { ...e.props, word } })
  })
}
