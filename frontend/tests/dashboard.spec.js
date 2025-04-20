const { test, expect } = require('@playwright/test');

test('Dashboard navigation and display', async ({ page }) => {
  // Navigate to the dashboard
  await page.goto('/');
  
  // Ensure the page title is correct
  await expect(page).toHaveTitle(/Clinical Health Platform/);
  
  // Check if dashboard title is present
  await expect(page.locator('h2:has-text("Dashboard")')).toBeVisible();
  
  // Make sure the stat cards are displayed
  await expect(page.locator('text=Patients')).toBeVisible();
  await expect(page.locator('text=Assessments')).toBeVisible();
  await expect(page.locator('text=Treatments')).toBeVisible();
  
  // Verify project phases section is present
  await expect(page.locator('text=Project Phases')).toBeVisible();
  
  // Check quick actions buttons
  await expect(page.locator('text=Add Patient')).toBeVisible();
  await expect(page.locator('text=New Assessment')).toBeVisible();
  await expect(page.locator('text=New Treatment')).toBeVisible();
});

test('Navigation through main menu', async ({ page }) => {
  // Start at the dashboard
  await page.goto('/');
  
  // Navigate to patients page
  await page.click('text=Patients');
  await expect(page).toHaveURL('/patients');
  await expect(page.locator('h2:has-text("Patients")')).toBeVisible();
  
  // Navigate to assessments page
  await page.click('text=Assessments');
  await expect(page).toHaveURL('/assessments');
  await expect(page.locator('h2:has-text("Assessments")')).toBeVisible();
  
  // Navigate to treatments page
  await page.click('text=Treatments');
  await expect(page).toHaveURL('/treatments');
  await expect(page.locator('h2:has-text("Treatments")')).toBeVisible();
  
  // Navigate to project vision page
  await page.click('text=Project Vision');
  await expect(page).toHaveURL('/project-vision');
  await expect(page.locator('h2:has-text("Project Vision")')).toBeVisible();
  
  // Return to dashboard
  await page.click('text=Clinical Health Platform');
  await expect(page).toHaveURL('/');
  await expect(page.locator('h2:has-text("Dashboard")')).toBeVisible();
});
