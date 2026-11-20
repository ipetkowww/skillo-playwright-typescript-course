import {expect, test} from '@playwright/test';
import {LoginPage} from '../page-objects/LoginPage'
import {OrdersPage, StatusEnum} from "../page-objects/OrdersPage";
import {AccountPage} from "../page-objects/AccountPage";

test.describe('Northwind Supply partner portal', () => {

    let loginPage: LoginPage;

    test.describe('When signed in', () => {
        let ordersPage: OrdersPage;

        test.beforeEach(async ({page}) => {
            loginPage = new LoginPage(page);
            await loginPage.open();
            ordersPage = await loginPage.signIn("alex.morgan@example.test", "Northwind#2026");
        })

        test('signs in with valid credentials and opens the orders dashboard', async () => {
            await expect(ordersPage.headerComponent.signOutButton).toBeVisible();
            await expect(ordersPage.heading).toBeVisible();
        });

        test('lists all 8 orders in the grid after sign in', async () => {
            const expectedOrderRows = 8;

            await expect(ordersPage.orderRows).toHaveCount(expectedOrderRows);
            await expect(ordersPage.resultsCountParagraph)
                .toHaveText(`Showing ${expectedOrderRows} of ${expectedOrderRows} orders`)
        });

        test('able to filter the orders grid by customer name and status', async () => {
            await ordersPage.filterByCustomerNameAndStatus("Bluebird");
            await ordersPage.verifyOrderStatus(2, [StatusEnum.Paid, StatusEnum.Cancelled]);
        });

        test('able to sort orders by total from highest to lowest', async () => {
            await ordersPage.totalButton.click();

            await ordersPage.verifyTotalOrdersSortedDescending();

        });

        test('updates the phone number on the account page and shows it in the summary', async () => {
            const newPhoneNumber: string = "+359 123 456 789";

            const accountPage: AccountPage = await ordersPage.headerComponent.clickAccountLink();
            await accountPage.phoneNumberField.fill(newPhoneNumber);
            await accountPage.saveChangesButton.click();

            await expect(accountPage.phoneNumberSummaryField).toHaveText(newPhoneNumber);
        });

        test('signs out and redirects to sign in when the orders page is opened again', async ({page}) => {
            loginPage = await ordersPage.headerComponent.signOut();
            await loginPage.verifyPageOpened();

            await new OrdersPage(page).open();

            await loginPage.verifyPageOpened();
        });
    })

    test.describe('When signing in with invalid credentials', () => {
        test('shows an error message for an incorrect password', async ({page}) => {
            loginPage = new LoginPage(page);
            await loginPage.open();
            await loginPage.emailField.fill("alex.morgan@example.test");
            await loginPage.passwordField.fill("invalidPassword");
            await loginPage.signInButton.click();

            await loginPage.verifyPageOpened();
            await expect(loginPage.loginErrorMessage).toBeVisible();
            await expect(loginPage.loginErrorMessage).toHaveText("Email or password is incorrect.")
        });
    })
});