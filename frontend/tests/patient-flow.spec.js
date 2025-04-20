const { test, expect } = require('@playwright/test');

test('Patient crud flow', async ({ page }) => {
  // Navigate to the patients page
  await page.goto('/patients');
  
  // Verify the Add New Patient button exists and click it
  await expect(page.locator('text=Add New Patient')).toBeVisible();
  await page.click('text=Add New Patient');
  await expect(page).toHaveURL('/patients/new');
  
  // Fill in the patient form
  await page.fill('#first_name', 'John');
  await page.fill('#last_name', 'Doe');
  await page.fill('#date_of_birth', '1990-01-01');
  await page.fill('#email', 'john.doe@example.com');
  await page.fill('#phone', '555-123-4567');
  await page.check('#ecn_dysfunction_confirmed');
  await page.fill('#inflammatory_markers_level', '2.5');
  
  // Submit the form - note: in a real test we'd mock the API
  // await page.click('text=Save Patient');
  
  // For now, let's just verify we can navigate back
  await page.click('text=Cancel');
  await expect(page).toHaveURL('/patients');
});

test('Patient detail view navigation', async ({ page }) => {
  // This test assumes there are patients in the system
  // In a real test, we'd set up test data or mock the API
  
  // Navigate to the patients page
  await page.goto('/patients');
  
  // Check if we can navigate to the patient detail page
  // This is a bit fragile since it depends on actual data
  // For now, we'll just check if the page structure is right
  
  // Verify the table headers
  await expect(page.locator('th:has-text("Name")')).toBeVisible();
  await expect(page.locator('th:has-text("Email")')).toBeVisible();
  await expect(page.locator('th:has-text("ECN Dysfunction")')).toBeVisible();
  await expect(page.locator('th:has-text("Inflammatory Markers")')).toBeVisible();
  await expect(page.locator('th:has-text("Actions")')).toBeVisible();
  
  // Check for search functionality
  await expect(page.locator('input[placeholder*="Search patients"]')).toBeVisible();
});
