/**
 * Unit tests for the action's entrypoint, src/index.ts
 */

import { run } from '../src/main'

// Mock the action's entrypoint

describe('index', () => {
  test.concurrent(
    'calls run when imported',
    async () => {
      await run()
    },
    1000000
  )
})
