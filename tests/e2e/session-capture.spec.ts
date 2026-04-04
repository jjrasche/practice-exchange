import { test, expect } from '@playwright/test'

test.describe('Session capture flow', () => {

  test('full happy path: 3 photos with narration and tap-to-point', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'practice.exchange' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Log a session' })).toBeVisible()

    // Start session creation
    await page.getByRole('button', { name: 'Log a session' }).click()
    await expect(page.getByRole('heading', { name: 'Log a session' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Open camera' })).toBeVisible()

    // Capture 3 photos, each with narration
    for (let slideNumber = 1; slideNumber <= 3; slideNumber++) {
      await captureSlide(page, slideNumber)
    }

    // Should see "Done — review session" after 3 slides
    await expect(page.getByRole('button', { name: /review session/i })).toBeVisible()
    await page.getByRole('button', { name: /review session/i }).click()

    // Review screen
    await expect(page.getByRole('heading', { name: 'Review your session' })).toBeVisible()
    await expect(page.getByText('3 slides')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Approve' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Discard' })).toBeVisible()

    // Approve
    await page.getByRole('button', { name: 'Approve' }).click()

    // Back to home
    await expect(page.getByRole('heading', { name: 'practice.exchange' })).toBeVisible()
  })

  test('discard session returns to home', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Log a session' }).click()

    // Capture 3 slides
    for (let slideNumber = 1; slideNumber <= 3; slideNumber++) {
      await captureSlide(page, slideNumber)
    }

    await page.getByRole('button', { name: /review session/i }).click()
    await page.getByRole('button', { name: 'Discard' }).click()

    await expect(page.getByRole('heading', { name: 'practice.exchange' })).toBeVisible()
  })

  test('camera error shows message when unavailable', async ({ browser }) => {
    // Launch a context WITHOUT fake media stream flags — camera will fail
    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
    })
    const page = await context.newPage()

    // Override getUserMedia to reject
    await page.addInitScript(() => {
      navigator.mediaDevices.getUserMedia = async () => {
        throw new DOMException('Permission denied', 'NotAllowedError')
      }
    })

    await page.goto('/')
    await page.getByRole('button', { name: 'Log a session' }).click()
    await page.getByRole('button', { name: 'Open camera' }).click()

    await expect(page.getByText('Camera permission denied')).toBeVisible()
    await context.close()
  })
})

async function captureSlide(page: import('@playwright/test').Page, slideNumber: number) {
  // Open camera if not already open
  const openCameraButton = page.getByRole('button', { name: 'Open camera' })
  if (await openCameraButton.isVisible()) {
    await openCameraButton.click()
  }

  // Wait for camera to be ready (video element with non-zero dimensions)
  await page.waitForFunction(() => {
    const video = document.querySelector('video')
    return video && video.videoWidth > 0 && video.readyState >= 2
  }, { timeout: 10_000 })

  // Capture photo
  await page.getByRole('button', { name: 'Capture photo' }).click()

  // Should transition to PhotoNarrator
  await expect(page.getByText(`Photo ${slideNumber}`)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Start talking' })).toBeVisible()

  // Start narration
  await page.getByRole('button', { name: 'Start talking' }).click()
  await expect(page.getByText('Recording')).toBeVisible()

  // Tap on the photo to point at something (simulate pointing gesture)
  const image = page.getByRole('img', { name: `Capture ${slideNumber}` })
  const imageBounds = await image.boundingBox()
  if (imageBounds) {
    await page.mouse.click(
      imageBounds.x + imageBounds.width * 0.3,
      imageBounds.y + imageBounds.height * 0.4,
    )
  }

  // Brief pause to simulate natural narration
  await page.waitForTimeout(500)

  // Stop narration
  await page.getByRole('button', { name: 'Done' }).click()

  // Should return to camera view for next photo (or show review button if enough slides)
  // Wait for either "Open camera" or "Review session" to appear
  await page.waitForSelector('button:has-text("Open camera"), button:has-text("review session")', {
    timeout: 5_000,
  })
}
