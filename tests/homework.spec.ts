import {expect, test} from '@playwright/test';
import {LoginPage} from '../page-objects/LoginPage'
import {OrdersPage, StatusEnum} from "../page-objects/OrdersPage";

// Homework: implement these tests with the page-object model.
// Pages: ../pages/login.html, ../pages/index.html (orders) and ../pages/account.html.
// Demo account: alex.morgan@example.test / Northwind#2026
// Create LoginPage, OrdersPage and AccountPage in ../page-objects/, then replace test.fixme with test.


test.describe('Northwind Supply partner portal', () => {

    let loginPage: LoginPage;
    let ordersPage: OrdersPage;

    test.beforeEach(async ({page}) => {
        loginPage = new LoginPage(page);
        await loginPage.open();
        ordersPage = await loginPage.signIn("alex.morgan@example.test", "Northwind#2026");
    })


    test.fixme('signs in with valid credentials and opens the orders dashboard', async () => {
        await expect(ordersPage.signOutButton).toBeVisible();
        await expect(ordersPage.heading).toBeVisible();
    });

    test.fixme('shows an error message for an incorrect password', async () => {

    });

    test.fixme('lists all 8 orders in the grid after sign in', async () => {
        const expectedOrderRows = 8;

        await expect(ordersPage.orderRows).toHaveCount(expectedOrderRows);
        await expect(ordersPage.resultsCountParagraph)
            .toHaveText(`Showing ${expectedOrderRows} of ${expectedOrderRows} orders`)
    });

    test.fixme('able to filter the orders grid by customer name and status', async () => {
        await ordersPage.filterByCustomerNameAndStatus("Bluebird");
        await ordersPage.verifyOrderStatus(2, [StatusEnum.Paid, StatusEnum.Cancelled]);
    });

    test.fixme('able to sort orders by total from highest to lowest', async () => {
        await ordersPage.sortDescendingOrdersTotal();
    });

    test.fixme('updates the phone number on the account page and shows it in the summary', async () => {
    });

    test.fixme('signs out and redirects to sign in when the orders page is opened again', async () => {
    });
});
