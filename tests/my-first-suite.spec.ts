import {expect, Page, test} from "@playwright/test";
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const loginPageUrl: string = pathToFileURL(
    resolve(__dirname, '../pages/login-page.html'),
).href;

test.beforeEach(async ({page}) => {
    await page.goto(loginPageUrl);
})

test("Successful login", async ({page}) => {
    await login(page, "alex@example.com", "Playwright123!");
    await verifySuccessfulLogin(page);
})

const invalidLoginData: InvalidLoginDataScenario[] = [
    {
        testName: 'Fail login with invalid email address',
        email: 'invalid-alex@example.com',
        password: 'Playwright123!',
        errorLocator: '#login-error',
        expectedError: 'Email or password is incorrect. Please try again.'
    },
    {
        testName: 'Fail login with invalid password',
        email: 'alex@example.com',
        password: 'Playwright123!Invalid',
        errorLocator: '#login-error',
        expectedError: 'Email or password is incorrect. Please try again.'
    },
    {
        testName: 'Fail login with empty email address',
        email: '',
        password: 'Playwright123!',
        errorLocator: '#email-error',
        expectedError: 'Enter your email address.'
    },
    {
        testName: 'Fail login with empty password',
        email: 'alex@example.com',
        password: '',
        errorLocator: '#password-error',
        expectedError: 'Enter your password.'
    }
]

for (const scenario of invalidLoginData) {
    test(scenario.testName, async ({page}) => {
        await login(page, scenario.email, scenario.password);

        await expect(page.locator(scenario.errorLocator)).toBeVisible();
        await expect(page.locator(scenario.errorLocator)).toHaveText(scenario.expectedError);
    });
}

test("Remember my email when sign out", async ({page}) => {
    const rememberMyEmail: boolean = true;
    await login(page, "alex@example.com", "Playwright123!", rememberMyEmail);

    await verifySuccessfulLogin(page);
    await page.locator("#logout-button").click();

    await expect(page.locator("#logout-button")).not.toBeVisible();
    await expect(page.locator("#email")).toHaveValue("alex@example.com");
    await expect(page.locator("#remember-email")).toBeChecked();
})

async function login(page: Page, username: string, password: string, rememberMyEmail?: boolean): Promise<void> {
    await page.locator("#email").fill(username);
    await page.locator("#password").fill(password);
    if (rememberMyEmail) {
        await page.locator("#remember-email").check();
    }
    await page.locator("#login-button").click();
}

async function verifySuccessfulLogin(page: Page): Promise<void> {
    await expect(page.locator("#user-name")).toHaveText("Alex");
    await expect(page.locator("#logout-button")).toBeVisible();
    await expect(page.getByRole('heading', {name: 'Make room for good things.'})).toBeVisible();
}

interface InvalidLoginDataScenario {
    testName: string;
    email: string;
    password: string;
    errorLocator: string;
    expectedError: string;
}