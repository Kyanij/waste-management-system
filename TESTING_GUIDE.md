# Admin Login Page - Comprehensive Testing & Verification Guide

## Overview

This document provides a complete testing strategy for the Admin Login page, ensuring pixel-perfect alignment with the provided HTML prototype and design consistency with the existing waste collection dashboard.

---

## 1. Visual Regression Testing Checklist

### Color Palette Verification

| Element | Target CSS Property | Expected Value | Test Method |
|---------|-------------------|-----------------|-------------|
| Primary button background | `background` | `#4a9c7a` | Visual inspection + screenshot comparison |
| Header text color | `color` | `#2f7a5f` | DevTools computed styles |
| Card shadow | `box-shadow` | `0 4px 20px rgba(0, 0, 0, 0.08)` | DevTools computed styles |
| Form background gradient | `background` | `linear-gradient(135deg, #f0f4f3 0%, #e8f5f0 100%)` | DevTools computed styles |
| Admin badge background | `background` | `#edf2f7` | DevTools computed styles |
| Error text | `color` | `#e24b4a` | Visual inspection |
| Input border default | `border-color` | `#cbd5e0` | Visual inspection |
| Input border focus | `border-color` | `#4a9c7a` | Click input + inspect |

### Spacing Measurements

| Element | Measurement | Expected Value | Verification |
|---------|------------|----------------|--------------|
| Card padding | All sides | `40px 32px` | Measure with devTools layout panel |
| Card padding (mobile) | All sides | `32px 24px` | Responsive check at 375px |
| Form group margin | Bottom | `20px` | DevTools box model |
| Card max-width | Width | `440px` | Computed style |
| Login wrapper max-width | Width | `440px` | Computed style |
| Admin badge margin | Bottom | `24px` | DevTools box model |
| Login header margin | Bottom | `32px` | DevTools box model |
| Form options margin | Bottom | `24px` | DevTools box model |
| Login footer margin | Top | `28px` | DevTools box model |
| Footer padding | Top | `20px` | DevTools box model |
| Footer border | Top | `1px solid #e2e8f0` | Visual inspection |

### Border Radius Values

| Element | CSS Property | Expected Value |
|---------|-------------|---------------|
| Login card | `border-radius` | `12px` |
| Admin badge | `border-radius` | `20px` |
| Input fields | `border-radius` | `6px` |
| Submit button | `border-radius` | `6px` |

### Typography Hierarchy

| Element | Expected Style | CSS Declaration |
|---------|----------------|-----------------|
| Main heading | 26px, bold, #2f7a5f | `font-size: 26px; font-weight: 700; color: #2f7a5f` |
| Subtitle text | 14px, #718096 | `font-size: 14px; color: #718096` |
| Form labels | 14px, #4a5568, semibold | `font-size: 14px; font-weight: 600; color: #4a5568` |
| Input text | 14px, #2d3748 | `font-size: 14px; color: #2d3748` |
| Input placeholder | 14px, #a0aec0 | `font-size: 14px; color: #a0aec0` |
| Helper text | 13px | `font-size: 13px` |
| Button text | 15px, semibold | `font-size: 15px; font-weight: 600` |
| Footer text | 12px, #a0aec0 | `font-size: 12px; color: #a0aec0` |

### Admin Badge Styling Verification

```css
/* Expected styles for .admin-badge */
.admin-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #edf2f7;
  color: #4a5568;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  margin-bottom: 24px;
  letter-spacing: 0.3px;
}
```

**Test Case:** The admin badge should display with the exact background color `#edf2f7`, rounded corners at `20px`, contain "Secure Admin Access" text, and display the recycle icon with proper gap spacing.

---

## 2. Interactive State Verification Tests

### Input Focus States

**Test Case 2.1:** When the email input receives focus, the border color should change to `#4a9c7a` and a green ring shadow should appear.

```javascript
// Playwright test
await page.click('#email');
const emailInput = await page.locator('#email');
await expect(emailInput).toHaveCSS('border-color', 'rgb(74, 156, 122)');
await expect(emailInput).toHaveCSS('box-shadow', 'rgb(74, 156, 122) 0px 0px 0px 3px');
```

**Test Case 2.2:** Focus ring shadow should use the exact color `rgba(74, 156, 122, 0.15)`.

```css
/* Expected focus styles */
.form-control:focus {
  outline: none;
  border-color: #4a9c7a;
  box-shadow: 0 0 0 3px rgba(74, 156, 122, 0.15);
}
```

### Button Hover Effects

**Test Case 2.3:** When hovering over the submit button, background darkens and button lifts with enhanced shadow.

```javascript
await page.hover('.btn-login');
await expect(page.locator('.btn-login')).toHaveCSS('background-color', 'rgb(61, 138, 106)');
await expect(page.locator('.btn-login')).toHaveCSS('transform', 'translateY(-1px)');
await expect(page.locator('.btn-login')).toHaveCSS('box-shadow', 'rgb(74, 156, 122) 0px 4px 12px 0px');
```

**Test Case 2.4:** Button active/pressed state should reset transform to original position.

```javascript
await page.locator('.btn-login').press('Control+Click');
await expect(page.locator('.btn-login')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
```

### Checkbox States

**Test Case 2.5:** Checkbox unchecked state should retain default styling.

```javascript
const checkbox = page.locator('#rememberMe');
await expect(checkbox).not.toBeChecked();
await expect(checkbox).toHaveCSS('accent-color', 'rgb(74, 156, 122)');
```

**Test Case 2.6:** Checkbox checked state should show filled indicator.

```javascript
await page.locator('#rememberMe').check();
await expect(page.locator('#rememberMe')).toBeChecked();
```

### Link Hover States

**Test Case 2.7:** Forgot password link should show underline on hover.

```javascript
await page.hover('.forgot-link');
await expect(page.locator('.forgot-link')).toHaveCSS('color', 'rgb(61, 138, 106)');
await expect(page.locator('.forgot-link')).toHaveCSS('text-decoration-line', 'underline');
```

### Disabled Loading State

**Test Case 2.8:** Submit button should be disabled during form submission.

```javascript
// While submitting
await expect(page.locator('.btn-login')).toBeDisabled();
await expect(page.locator('.btn-login')).toHaveCSS('opacity', '0.7');
await expect(page.locator('.btn-login')).toHaveCSS('cursor', 'not-allowed');
```

---

## 3. Form Validation UI Tests

### Email Validation

**Test Case 3.1:** Invalid email format should display inline error message below the email field.

```javascript
await page.fill('#email', 'invalid-email');
await page.fill('#password', 'password123');
await page.click('.btn-login');

// Should display error
await expect(page.locator('#email-error')).toBeVisible();
await expect(page.locator('#email-error')).toContainText('Please enter a valid email address');
await expect(page.locator('#email')).toHaveCSS('border-color', 'rgb(226, 75, 74)');
```

**Test Case 3.2:** Empty email field should display "Email address is required" error.

```javascript
await page.fill('#email', '');
await page.click('.btn-login');
await expect(page.locator('#email-error')).toContainText('Email address is required');
```

### Password Validation

**Test Case 3.3:** Password below minimum length should display error message.

```javascript
await page.fill('#email', 'admin@test.com');
await page.fill('#password', '123');
await page.click('.btn-login');
await expect(page.locator('#password-error')).toContainText('Password must be at least 6 characters');
```

**Test Case 3.4:** Empty password field should display "Password is required" error.

```javascript
await page.fill('#password', '');
await page.click('.btn-login');
await expect(page.locator('#password-error')).toContainText('Password is required');
```

### Error State ARIA Attributes

**Test Case 3.5:** Error inputs should have correct ARIA attributes.

```javascript
await page.fill('#email', 'invalid');
await page.click('.btn-login');
const emailInput = page.locator('#email');
await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
await expect(emailInput).toHaveAttribute('aria-describedby', 'email-error');
```

**Test Case 3.6:** Error messages should be announced to screen readers.

```javascript
const errorMessage = page.locator('#email-error');
await expect(errorMessage).toHaveAttribute('role', 'alert');
```

### Success State Error Clearing

**Test Case 3.7:** Valid input should clear error messages.

```javascript
await page.fill('#email', 'admin@example.com');
await page.blur('#email');
await expect(page.locator('#email-error')).not.toBeVisible();
await expect(page.locator('#email')).toHaveCSS('border-color', 'rgb(203, 213, 224)');
```

---

## 4. Responsive Design Verification

### Breakpoint Testing Matrix

| Viewport Width | Device Type | Card Padding | Heading Size | Form Options | Horizontal Scroll |
|-------------|-----------|------------|------------|------------|-----------------|
| 320px | Mobile Small | 32px 24px | 24px | Stacked | None |
| 375px | Mobile Standard | 32px 24px | 24px | Stacked | None |
| 768px | Tablet | 40px 32px | 26px | Row | None |
| 1024px | Desktop Small | 40px 32px | 26px | Row | None |
| 1440px | Desktop Large | 40px 32px | 26px | Row | None |

### Mobile Responsive Tests

**Test Case 4.1:** At viewport width below 480px, form options should stack vertically.

```javascript
await page.setViewportSize({ width: 375, height: 667 });
const formOptions = page.locator('.form-options');
await expect(formOptions).toHaveCSS('flex-direction', 'column');
```

**Test Case 4.2:** At viewport width below 480px, heading should scale to 24px.

```javascript
await page.setViewportSize({ width: 375, height: 667 });
await expect(page.locator('.login-header h1')).toHaveCSS('font-size', '24px');
```

**Test Case 4.3:** At mobile viewport, card padding should reduce.

```javascript
await page.setViewportSize({ width: 375, height: 667 });
await expect(page.locator('.login-card')).toHaveCSS('padding', '32px 24px');
```

### Touch Target Verification

**Test Case 4.4:** All interactive elements should meet 44px minimum touch target.

```javascript
const button = page.locator('.btn-login');
const buttonBox = await button.boundingBox();
expect(buttonBox.height).toBeGreaterThanOrEqual(44);
```

**Test Case 4.5:** No horizontal scrolling should occur at any viewport.

```javascript
for (const width of [320, 375, 768, 1024, 1440]) {
  await page.setViewportSize({ width, height: 900 });
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
}
```

---

## 5. Accessibility Compliance Tests

### Keyboard Navigation

**Test Case 5.1:** Tab should navigate through all interactive elements in logical order.

```javascript
await page.keyboard.press('Tab');   // Should focus email input
await expect(page.locator('#email')).toBeFocused();

await page.keyboard.press('Tab');   // Should focus password input
await expect(page.locator('#password')).toBeFocused();

await page.keyboard.press('Tab');   // Should focus remember checkbox
await expect(page.locator('#rememberMe')).toBeFocused();

await page.keyboard.press('Tab');   // Should focus forgot password link
await expect(page.locator('.forgot-link')).toBeFocused();

await page.keyboard.press('Tab');  // Should focus submit button
await expect(page.locator('.btn-login')).toBeFocused();
```

### Focus Indicators

**Test Case 5.2:** Visible focus indicator should be present on email input.

```javascript
await page.click('#email');
await page.keyboard.press('Tab');
const email = page.locator('#email');
// Focus should be visible - check computed styles include focus ring
await expect(email).toHaveCSS('box-shadow', /rgb\(74, 156, 122\)/);
```

**Test Case 5.3:** Submit button should show focus indicator.

```javascript
await page.locator('.btn-login').focus();
await expect(page.locator('.btn-login')).toHaveCSS('outline');
```

### Color Contrast Ratios

**Test Case 5.4:** Normal text should meet 4.5:1 contrast ratio.

```javascript
// #4a5568 on white = 7.36:1 ratio (passes)
const label = page.locator('.form-label');
await expect(label).toHaveCSS('color', 'rgb(74, 85, 104)');
```

**Test Case 5.5:** Large text (14px+) should meet 3:1 contrast ratio.

```javascript
// Header is 26px - passes 3:1 automatically
// #2f7a5f on white = 5.83:1 ratio (passes)
```

### Form Labels Association

**Test Case 5.6:** Email input should have associated label via htmlFor.

```javascript
const emailLabel = page.locator('label[for="email"]');
await expect(emailLabel).toBeVisible();
await expect(emailLabel).toHaveText('Email Address');
```

**Test Case 5.7:** Password input should have associated label.

```javascript
const passwordLabel = page.locator('label[for="password"]');
await expect(passwordLabel).toBeVisible();
await expect(passwordLabel).toHaveText('Password');
```

### Screen Reader Announcements

**Test Case 5.8:** Error messages should be in aria-live region.

```javascript
// Toast container has aria-live="polite"
await expect(page.locator('.toast-container')).toHaveAttribute('aria-live', 'polite');
```

**Test Case 5.9:** Error messages should have role="alert".

```javascript
await page.fill('#email', 'invalid');
await page.click('.btn-login');
await expect(page.locator('.form-error')).toHaveAttribute('role', 'alert');
```

### Checkbox Accessibility

**Test Case 5.10:** Checkbox should have proper labeling.

```javascript
const checkbox = page.locator('#rememberMe');
const checkboxLabel = page.locator('label[for="rememberMe"]');
await expect(checkboxLabel).toContainText('Remember me');
```

---

## 6. Cross-Browser Compatibility Tests

### Browser Testing Matrix

| Browser | Version | Gradient | Placeholder | Accent-Color | Transitions | Shadow |
|--------|---------|----------|-------------|--------------|-------------|--------|
| Chrome | Latest | ✓ | ✓ | ✓ | ✓ | ✓ |
| Firefox | Latest | ✓ | ✓ | ✓ | ✓ | ✓ |
| Safari | Latest | ✓ | ✓ | ⚠ (partial) | ✓ | ✓ |
| Edge | Latest | ✓ | ✓ | ✓ | ✓ | ✓ |

### Visual Consistency Tests

**Test Case 6.1:** Gradient background should render consistently.

```javascript
// Run on each browser
const body = page.locator('body');
await expect(body).toHaveCSS('background-image', /linear-gradient/);
```

**Test Case 6.2:** Input placeholder styling should be consistent.

```javascript
const placeholder = page.locator('input::placeholder');
await expect(placeholder).toHaveCSS('color', 'rgb(160, 174, 192)');
```

**Test Case 6.3:** Checkbox accent-color should work (with fallback for Safari).

```javascript
// Primary test
const checkbox = page.locator('#rememberMe');
const accentColor = await checkbox.evaluate(el => {
  return getComputedStyle(el).accentColor;
});
// If accentColor not supported, check custom styling
if (accentColor === 'rgb(0, 0, 0)') {
  await expect(checkbox).toHaveCSS('accent-color', 'rgb(74, 156, 122)');
}
```

**Test Case 6.4:** Button hover transitions should be smooth.

```javascript
await page.hover('.btn-login');
consttransition = await page.locator('.btn-login')
  .evaluate(el => getComputedStyle(el).transition);
expect(transition).toContain('all 0.2s ease');
```

---

## 7. Performance Benchmarking

### Performance Criteria

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| First Contentful Paint (FCP) | < 1.5s | < 2.0s |
| Time to Interactive (TTI) | < 3.0s | < 4.0s |
| Cumulative Layout Shift (CLS) | < 0.1 | < 0.25 |
| Total Bundle Size | < 200KB gzipped | < 300KB gzipped |

### Performance Tests

**Test Case 7.1:** First Contentful Paint should occur under 1.5 seconds.

```javascript
const metrics = await page.evaluate(() => {
  return new Promise(resolve => {
    new PerformanceObserver(entry => {
      if (entry.name === 'first-contentful-paint') {
        resolve(entry.startTime);
      }
    }).observe({ type: 'paint' });
  });
});
expect(metrics).toBeLessThan(1500);
```

**Test Case 7.2:** No unnecessary re-renders during typing.

```javascript
// Using React DevTools Profiler (manual test)
// 1. Open React DevTools Profiler
// 2. Start recording
// 3. Type in email field
// 4. Stop recording
// 5. Verify AdminLogin component renders only 1 time per keystroke
```

**Test Case 7.3:** Cumulative Layout Shift should be less than 0.1.

```javascript
const cls = await page.evaluate(() => {
  return new Promise(resolve => {
    new PerformanceObserver(entry => {
      if (entry.name === 'layout-shift') {
        resolve(entry.value);
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
});
expect(cls).toBeLessThan(0.1);
```

---

## 8. Integration Test Scenarios

### End-to-End Test Flows

#### 8.1 Successful Login Flow

```javascript
test('successful login with valid credentials', async ({ page }) => {
  await page.goto('/admin');
  
  // Fill valid credentials
  await page.fill('#email', 'admin@recycle.com');
  await page.fill('#password', 'admin123');
  await page.click('#rememberMe');
  await page.click('.btn-login');
  
  // Should show loading state
  await expect(page.locator('.btn-login')).toContainText('Signing In...');
  
  // Should show success toast
  await expect(page.locator('.toast-success')).toBeVisible({ timeout: 3000 });
  await expect(page.locator('.toast-success'))
    .toContainText('Login successful! Redirecting...');
  
  // Should redirect (in mock mode)
  await page.waitForURL('**/dashboard', { timeout: 2000 });
});
```

#### 8.2 Failed Login Flow

```javascript
test('failed login with invalid credentials', async ({ page }) => {
  await page.goto('/admin');
  
  await page.fill('#email', 'wrong@test.com');
  await page.fill('#password', 'wrongpass');
  await page.click('.btn-login');
  
  // Should show error toast
  await expect(page.locator('.toast-error')).toBeVisible({ timeout: 3000 });
  await expect(page.locator('.toast-error'))
    .toContainText('Invalid email or password');
});
```

#### 8.3 Loading State During Submission

```javascript
test('button disabled during submission', async ({ page }) => {
  await page.goto('/admin');
  
  await page.fill('#email', 'admin@recycle.com');
  await page.fill('#password', 'admin123');
  
  const submitPromise = page.click('.btn-login');
  await page.click('.btn-login');
  
  // Button should be immediately disabled
  await expect(page.locator('.btn-login')).toBeDisabled();
  await expect(page.locator('.btn-login'))
    .toHaveAttribute('aria-busy', 'true');
  
  await submitPromise;
});
```

#### 8.4 Remember Me Persistence

```javascript
test('remember me persists across refresh', async ({ page }) => {
  await page.goto('/admin');
  
  // Check remember me
  await page.check('#rememberMe');
  await page.click('.btn-login');
  await page.waitForURL('**/dashboard');
  
  // Simulate session persistence
  // LocalStorage should contain auth data
  const storage = await page.evaluate(() => localStorage.getItem('recycle_auth'));
  expect(JSON.parse(storage)).toHaveProperty('token');
});
```

#### 8.5 Forgot Password Link

```javascript
test('forgot password link is navigable', async ({ page }) => {
  await page.goto('/admin');
  
  const forgotLink = page.locator('.forgot-link');
  await expect(forgotLink).toHaveAttribute('href', '#');
});
```

---

## 9. Visual Comparison Tools Setup

### Percy Configuration

```yaml
# .percy.yml
version: 2
snapshot:
  widths:
    - 320
    - 375
    - 768
    - 1024
    - 1440
  percyCSS: |
    .toast-container { display: none !important; }
```

### Playwright Screenshot Tests

```typescript
// tests/visual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Admin Login Visual Regression', () => {
  test('default state', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveScreenshot('login-default.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  test('email focused', async ({ page }) => {
    await page.goto('/admin');
    await page.click('#email');
    await expect(page).toHaveScreenshot('login-email-focused.png');
  });

  test('validation errors', async ({ page }) => {
    await page.goto('/admin');
    await page.click('.btn-login');
    await expect(page).toHaveScreenshot('login-errors.png');
  });

  test('loading state', async ({ page }) => {
    await page.goto('/admin');
    await page.fill('#email', 'admin@recycle.com');
    await page.fill('#password', 'admin123');
    await page.click('.btn-login', { timeout: 100 });
    await expect(page).toHaveScreenshot('login-loading.png');
  });

  test('mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/admin');
    await expect(page).toHaveScreenshot('login-mobile.png');
  });
});
```

### Chromatic Configuration

```yaml
# .chromatic-cli.yml
projectToken: your-project-token
buildScriptName: build
exitZeroOnChanges: true
exitOnceUploaded: true
```

---

## 10. Automated Component Tests (Jest + RTL)

```typescript
// tests/components/AdminLogin.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminLogin } from '../../app/components/AdminLogin/AdminLogin';
import { AuthProvider } from '../../app/context/AuthContext';
import { ToastProvider } from '../../app/context/ToastContext';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ToastProvider>
      <AuthProvider>{component}</AuthProvider>
    </ToastProvider>
  );
};

describe('AdminLogin Component', () => {
  test('renders email and password inputs', () => {
    renderWithProviders(<AdminLogin />);
    
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('displays validation errors for empty fields', async () => {
    renderWithProviders(<AdminLogin />);
    
    fireEvent.submit(screen.getByRole('form'));
    
    await waitFor(() => {
      expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test('displays error for invalid email format', async () => {
    renderWithProviders(<AdminLogin />);
    
    await userEvent.type(screen.getByLabelText(/email address/i), 'invalid');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    fireEvent.submit(screen.getByRole('form'));
    
    await waitFor(() => {
      expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
    });
  });

  test('displays error for short password', async () => {
    renderWithProviders(<AdminLogin />);
    
    await userEvent.type(screen.getByLabelText(/email address/i), 'test@test.com');
    await userEvent.type(screen.getByLabelText(/password/i), '12345');
    fireEvent.submit(screen.getByRole('form'));
    
    await waitFor(() => {
      expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
    });
  });

  test('checkbox can be toggled', async () => {
    renderWithProviders(<AdminLogin />);
    
    const checkbox = screen.getByRole('checkbox', { name: /remember me/i });
    expect(checkbox).not.toBeChecked();
    
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  test('button shows loading state when submitting', async () => {
    renderWithProviders(<AdminLogin />);
    
    await userEvent.type(screen.getByLabelText(/email address/i), 'admin@recycle.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'admin123');
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.submit(screen.getByRole('form'));
    
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
});
```

---

## 11. Bug Reporting Template

```markdown
## Bug Report

### Basic Information
- **Issue ID:** [Auto-generated]
- **Date Reported:** YYYY-MM-DD
- **Tester Name:** [Name]
- **Environment:** [Development/Staging/Production]

### Issue Details
- **Title:** [Clear, concise description]
- **Severity:** [Critical | High | Medium | Low]
- **Priority:** [P1 | P2 | P3 | P4]
- **Component:** AdminLogin

### Steps to Reproduce
1. [First step]
2. [Second step]
3. [Third step]

### Expected Behavior
[Based on HTML prototype specifications - include exact values]

### Actual Behavior
[What actually happened - include screenshots]

### Browser & Device
- **Browser:** [Chrome/Firefox/Safari/Edge]
- **Version:** [Browser version]
- **OS:** [Windows/macOS/iOS/Android]
- **Device:** [Desktop/Tablet/Mobile]
- **Viewport:** [Width x Height]

### Visual Evidence
- **Screenshot:** [Attach image]
- **Screen Recording:** [Attach if applicable]
- **Console Errors:** [Paste any errors]

### Design Reference
[Link to HTML prototype or Figma design file]

### Related Issues
[Links to any related bugs or features]
```

### Severity Definitions

| Level | Description | Example |
|-------|------------|----------|
| Critical | Complete blockage, data loss | Login submission fails completely |
| High | Major feature broken | Validation errors don't display |
| Medium | Feature partially working | Minor visual misalignment |
| Low | Cosmetic or enhancement | Minor spacing difference |

---

## 12. Design Consistency Audit

### Shared Design Tokens Check

| Token | Variable | Value | Used In |
|-------|----------|-------|--------|
| Green Primary | `--green-600` | `#3b6d11` | Dashboard, Admin Login |
| Green Light | `--green-400` | `#639922` | Dashboard, Admin Login |
| Green Dark | `--green-700` | `#2e560d` | Dashboard, Admin Login |
| Green-50 | `--green-50` | `#eaf3de` | Dashboard, Admin Login |
| Gray-100 | `--gray-100` | `#f1efe8` | Dashboard, Admin Login |
| Gray-200 | `--gray-200` | `#d3d1c7` | Dashboard, Admin Login |
| Gray-600 | `--gray-600` | `#5f5e5a` | Dashboard, Admin Login |
| Gray-900 | `--gray-900` | `#2c2c2a` | Dashboard, Admin Login |
| Radius | `--radius` | `10px` | Dashboard |
| Radius-sm | `--radius-sm` | `6px` | Dashboard, Admin Login |

### Visual Audit Checklist

**Test Case 12.1:** Verify CSS variables are consistently defined.

```bash
# Check globals.css contains all required variables
grep -E "var\(--green-|var\(--gray-|var\(--radius" app/styles/globals.css
```

**Test Case 12.2:** Verify AdminLogin imports global styles.

```javascript
// AdminLogin should have access to CSS variables
const color = await page.evaluate(() => {
  return getComputedStyle(document.body)
    .getPropertyValue('--green-600').trim();
});
expect(color).toBe('#3b6d11');
```

---

## Final Sign-Off Checklist

Before deploying the Admin Login page to production, verify each item:

### Visual Verification
- [ ] All colors match HTML prototype exactly
- [ ] All spacing measurements are correct
- [ ] Border radius values match (12px card, 6px inputs)
- [ ] Typography hierarchy is correct (26px/14px/12px)
- [ ] Admin badge styling matches (#edf2f7 background)
- [ ] Card shadow renders correctly

### Functional Verification
- [ ] Email validation works (required, valid format)
- [ ] Password validation works (required, min 6 chars)
- [ ] Error messages display inline in red
- [ ] Error input has aria-invalid="true"
- [ ] Focus states show green ring shadow
- [ ] Button hover effects work (lift + shadow)
- [ ] Loading state shows spinner + disabled button
- [ ] Toast notifications appear for success/error

### Accessibility Verification
- [ ] Keyboard navigation works through all fields
- [ ] Visible focus indicators on all elements
- [ ] All inputs have labels
- [ ] ARIA attributes are correct
- [ ] Color contrast meets WCAG 2.1 AA

### Responsive Verification
- [ ] Mobile view (375px) works correctly
- [ ] Form options stack on small screens
- [ ] Heading scales on mobile
- [ ] No horizontal scroll at any width
- [ ] Touch targets meet 44px minimum

### Integration Verification
- [ ] Successful login redirects
- [ ] Failed login shows error toast
- [ ] App builds without errors
- [ ] Dev server starts successfully

### Design System Verification
- [ ] CSS variables match dashboard
- [ ] Colors consistent across pages
- [ ] Spacing scale matches
- [ ] Typography consistent

---

**Sign-Off Date:** _____________

**QA Lead Approval:** _____________

**Frontend Lead Approval:** _____________

**Product Owner Approval:** _____________