import {Locator, Page} from "@playwright/test";
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import OrdersPage from './OrdersPage';

export class LoginPage {

    constructor(private readonly page: Page) {
    }

    public get emailField(): Locator {
        return this.page.locator("#email");
    }

    public get passwordField(): Locator {
        return this.page.locator("#password");
    }

    public get signInButton(): Locator {
        return this.page.locator("#login-button");
    }

    public async open(): Promise<void> {
        const loginPageUrl: string = pathToFileURL(resolve(__dirname, '../pages/login.html')).href;
        await this.page.goto(loginPageUrl);
    }

    public async signIn(email: string, password: string): Promise<OrdersPage> {
        await this.emailField.fill(email);
        await this.passwordField.fill(password);
        await this.signInButton.click();
        return new OrdersPage(this.page);
    }
}