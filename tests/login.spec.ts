import { test, expect } from '@playwright/test';

test('TC01 Login สำเร็จ', async ({ page }) => {
  await page.goto('/');

  await page
    .getByLabel('หมายเลขโทรศัพท์มือถือ')
    .fill('0800000000');

  await page
    .getByPlaceholder('อย่างน้อย 8 ตัวอักษร')
    .fill('uCrwVaBW39o_0G0Q5QwAVrqr');

  await page
    .getByRole('button', { name: 'เข้าสู่ระบบ' })
    .click();

  await expect(page.getByText('ยินดีต้อนรับ')).toBeVisible();
});


test('TC02 Login ไม่สำเร็จ - เบอร์โทรศัพท์ไม่ถูกต้อง', async ({ page }) => {
  await page.goto('/');

  await page
    .getByLabel('หมายเลขโทรศัพท์มือถือ')
    .fill('0811111111');

  await page
    .getByPlaceholder('อย่างน้อย 8 ตัวอักษร')
    .fill('uCrwVaBW39o_0G0Q5QwAVrqr');

  await page
    .getByRole('button', { name: 'เข้าสู่ระบบ' })
    .click();

  await expect(
    page.getByText('หมายเลขโทรศัพท์หรือรหัสผ่านไม่ถูกต้อง')
  ).toBeVisible();
});


test('TC03 Login ไม่สำเร็จ - รหัสผ่านไม่ถูกต้อง', async ({ page }) => {
  await page.goto('/');

  await page
    .getByLabel('หมายเลขโทรศัพท์มือถือ')
    .fill('0800000000');

  await page
    .getByPlaceholder('อย่างน้อย 8 ตัวอักษร')
    .fill('wrongpassword');

  await page
    .getByRole('button', { name: 'เข้าสู่ระบบ' })
    .click();

  await expect(
    page.getByText('หมายเลขโทรศัพท์หรือรหัสผ่านไม่ถูกต้อง')
  ).toBeVisible();
});

test('TC10 Login ไม่สำเร็จ - ไม่กรอกเบอร์โทรศัพท์', async ({ page }) => {
  await page.goto('/');

  const phoneInput = page.getByLabel('หมายเลขโทรศัพท์มือถือ');

  await page
    .getByPlaceholder('อย่างน้อย 8 ตัวอักษร')
    .fill('password123');

  await page
    .getByRole('button', { name: 'เข้าสู่ระบบ' })
    .click();

  await expect(phoneInput).toBeFocused();

  const isValid = await phoneInput.evaluate(
    (input: HTMLInputElement) => input.checkValidity()
  );

  expect(isValid).toBe(false);
});


test('TC11 Login ไม่สำเร็จ - ไม่กรอกรหัสผ่าน', async ({ page }) => {
  await page.goto('/');

  await page
    .getByLabel('หมายเลขโทรศัพท์มือถือ')
    .fill('0800000000');

  const passwordInput = page.getByPlaceholder('อย่างน้อย 8 ตัวอักษร');

  await page
    .getByRole('button', { name: 'เข้าสู่ระบบ' })
    .click();

  await expect(passwordInput).toBeFocused();

  const isValid = await passwordInput.evaluate(
    (input: HTMLInputElement) => input.checkValidity()
  );

  expect(isValid).toBe(false);
});


test('TC12 ไปหน้าเข้าสู่ระบบจากหน้าสมัครสมาชิกได้สำเร็จ', async ({ page }) => {
  await page.goto('/');

  await page.getByText('สมัครสมาชิก').click();

  await expect(
    page.getByRole('heading', { name: 'สร้างบัญชีผู้เช่า' })
  ).toBeVisible();

  await page.getByText('เข้าสู่ระบบ').click();

  await expect(
    page.getByRole('heading', { name: 'ยินดีต้อนรับ' })
  ).toBeVisible();
});