import { defineConfig, devices } from '@playwright/test'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const resolveChromeExecutable = (): string | undefined => {
  const envOverride = process.env.PW_CHROME_PATH
  if (envOverride && existsSync(envOverride)) {
    return envOverride
  }

  if (process.platform === 'darwin') {
    const candidates = [
      '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      join(
        homedir(),
        'Applications',
        'Google Chrome Canary.app',
        'Contents',
        'MacOS',
        'Google Chrome Canary',
      ),
      join(homedir(), 'Applications', 'Google Chrome.app', 'Contents', 'MacOS', 'Google Chrome'),
    ]

    return candidates.find((path) => existsSync(path))
  }

  if (process.platform === 'win32') {
    const candidates = [
      process.env['PROGRAMFILES']
        ? join(process.env['PROGRAMFILES'], 'Google', 'Chrome', 'Application', 'chrome.exe')
        : '',
      process.env['PROGRAMFILES(X86)']
        ? join(process.env['PROGRAMFILES(X86)'], 'Google', 'Chrome', 'Application', 'chrome.exe')
        : '',
      process.env.LOCALAPPDATA
        ? join(process.env.LOCALAPPDATA, 'Google', 'Chrome', 'Application', 'chrome.exe')
        : '',
      process.env.LOCALAPPDATA
        ? join(process.env.LOCALAPPDATA, 'Google', 'Chrome SxS', 'Application', 'chrome.exe')
        : '',
    ].filter(Boolean)

    return candidates.find((path) => existsSync(path))
  }

  const linuxCandidates = [
    '/usr/bin/google-chrome-canary',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ]

  return linuxCandidates.find((path) => existsSync(path))
}

const chromeExecutablePath = resolveChromeExecutable()

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4173',
    port: 4173,
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chrome-local',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
        channel: chromeExecutablePath ? undefined : 'chrome',
        launchOptions: chromeExecutablePath
          ? {
              executablePath: chromeExecutablePath,
            }
          : undefined,
      },
    },
  ],
})
