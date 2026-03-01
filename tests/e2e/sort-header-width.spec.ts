import { expect, test } from '@playwright/test'

const headerWidth = async (locator: ReturnType<import('@playwright/test').Page['locator']>) => {
  return locator.evaluate((element) => element.getBoundingClientRect().width)
}

test('sorting does not change header widths', async ({ page }) => {
  await page.goto('/')

  const headers = page.locator('table.data-table thead th')
  await expect(headers.first()).toBeVisible()

  const idHeader = page.getByRole('columnheader', { name: /^id/i })
  const snackHeader = page.getByRole('columnheader', { name: /^snack/i })
  const dateHeader = page.getByRole('columnheader', { name: /^date/i })

  const readWidths = async (): Promise<number[]> => {
    const count = await headers.count()
    const values: number[] = []
    for (let index = 0; index < count; index += 1) {
      values.push(await headerWidth(headers.nth(index)))
    }
    return values
  }

  const baseline = await readWidths()

  await snackHeader.click()
  await expect(snackHeader.locator('.sort-icon:not(.sort-icon--hidden)')).toHaveCount(1)
  const afterSnackSort = await readWidths()

  await dateHeader.click()
  await expect(dateHeader.locator('.sort-icon:not(.sort-icon--hidden)')).toHaveCount(1)
  const afterDateSort = await readWidths()

  await idHeader.click()
  await expect(idHeader.locator('.sort-icon:not(.sort-icon--hidden)')).toHaveCount(1)
  const afterIdSort = await readWidths()

  const snapshots = [afterSnackSort, afterDateSort, afterIdSort]
  snapshots.forEach((snapshot) => {
    expect(snapshot).toHaveLength(baseline.length)
    snapshot.forEach((width, index) => {
      const delta = Math.abs(width - baseline[index]!)
      expect(delta).toBeLessThanOrEqual(0.25)
    })
  })
})
