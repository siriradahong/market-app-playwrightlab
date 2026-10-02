import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByText('สมัครสมาชิก').click();
});

test('TC04 สมัครสมาชิกสำเร็จ', async ({ page, browserName }) => {
  // สร้างเบอร์ใหม่ทุกครั้ง ป้องกันเบอร์ซ้ำเวลารัน Test ใหม่
  const browserCode =
    browserName === 'chromium' ? '1' :
    browserName === 'firefox' ? '2' : '3';

  const uniquePart = Date.now().toString().slice(-7);
  const phone = `08${uniquePart}${browserCode}`;

  await page.getByPlaceholder('ชื่อและนามสกุล').fill('Test User');
  await page.getByPlaceholder('08X-XXX-XXXX').fill(phone);
  await page.getByPlaceholder('อย่างน้อย 8 ตัวอักษร').fill('password123');
  await page.getByPlaceholder('กรอกรหัสผ่านอีกครั้ง').fill('password123');

  await page.getByRole('button', { name: 'สมัครสมาชิก' }).click();

  await expect(page.getByText('สวัสดี, Test User')).toBeVisible();
});

test('TC05 สมัครสมาชิกไม่สำเร็จ - รหัสผ่านไม่ตรงกัน', async ({ page }) => {
  await page.getByPlaceholder('ชื่อและนามสกุล').fill('Test User 2');
  await page.getByPlaceholder('08X-XXX-XXXX').fill('0888888888');
  await page.getByPlaceholder('อย่างน้อย 8 ตัวอักษร').fill('password123');
  await page.getByPlaceholder('กรอกรหัสผ่านอีกครั้ง').fill('password456');

  await page.getByRole('button', { name: 'สมัครสมาชิก' }).click();

  await expect(
    page.getByText('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน')
  ).toBeVisible();
});

test('TC06 สมัครสมาชิกไม่สำเร็จ - ไม่กรอกชื่อ', async ({ page }) => {
  const nameInput = page.getByPlaceholder('ชื่อและนามสกุล');

  await page.getByPlaceholder('08X-XXX-XXXX').fill('0877777777');
  await page.getByPlaceholder('อย่างน้อย 8 ตัวอักษร').fill('password123');
  await page.getByPlaceholder('กรอกรหัสผ่านอีกครั้ง').fill('password123');

  await page.getByRole('button', { name: 'สมัครสมาชิก' }).click();

  await expect(nameInput).toBeFocused();

  const isValid = await nameInput.evaluate(
    (input: HTMLInputElement) => input.checkValidity()
  );

  expect(isValid).toBe(false);
});
test('TC07 สมัครสมาชิกไม่สำเร็จ - เบอร์โทรศัพท์มีบัญชีอยู่แล้ว', async ({ page }) => {
  await page.getByPlaceholder('ชื่อและนามสกุล').fill('Duplicate User');

  // 0800000000 เป็นบัญชีที่มีอยู่แล้ว
  await page.getByPlaceholder('08X-XXX-XXXX').fill('0800000000');

  await page.getByPlaceholder('อย่างน้อย 8 ตัวอักษร').fill('password123');
  await page.getByPlaceholder('กรอกรหัสผ่านอีกครั้ง').fill('password123');

  await page.getByRole('button', { name: 'สมัครสมาชิก' }).click();

  await expect(
    page.getByText('หมายเลขโทรศัพท์นี้มีบัญชีอยู่แล้ว')
  ).toBeVisible();
});


test('TC08 สมัครสมาชิกไม่สำเร็จ - รหัสผ่านน้อยกว่า 8 ตัวอักษร', async ({ page }) => {
  const passwordInput = page.getByPlaceholder('อย่างน้อย 8 ตัวอักษร');

  await page.getByPlaceholder('ชื่อและนามสกุล').fill('Test User');
  await page.getByPlaceholder('08X-XXX-XXXX').fill('0866666666');

  await passwordInput.fill('1234567');
  await page.getByPlaceholder('กรอกรหัสผ่านอีกครั้ง').fill('1234567');

  await page.getByRole('button', { name: 'สมัครสมาชิก' }).click();

  const isValid = await passwordInput.evaluate(
    (input: HTMLInputElement) => input.checkValidity()
  );

  expect(isValid).toBe(false);
});


test('TC09 สมัครสมาชิกไม่สำเร็จ - ไม่กรอกเบอร์โทรศัพท์', async ({ page }) => {
  const phoneInput = page.getByPlaceholder('08X-XXX-XXXX');

  await page.getByPlaceholder('ชื่อและนามสกุล').fill('Test User');
  await page.getByPlaceholder('อย่างน้อย 8 ตัวอักษร').fill('password123');
  await page.getByPlaceholder('กรอกรหัสผ่านอีกครั้ง').fill('password123');

  await page.getByRole('button', { name: 'สมัครสมาชิก' }).click();

  await expect(phoneInput).toBeFocused();

  const isValid = await phoneInput.evaluate(
    (input: HTMLInputElement) => input.checkValidity()
  );

  expect(isValid).toBe(false);
});