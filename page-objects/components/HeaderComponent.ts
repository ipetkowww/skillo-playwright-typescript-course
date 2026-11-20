import {Locator, Page} from "@playwright/test";
import {AccountPage} from "../AccountPage";
import {LoginPage} from "../LoginPage";

export class HeaderComponent {

    constructor(private readonly page: Page) {}

    public get accountLink(): Locator {
        return this.page.getByRole('link', { name: 'Account' });
    }

    public get signOutButton(): Locator {
        return this.page.locator("#logout-button");
    }

    public async clickAccountLink(): Promise<AccountPage> {
        await this.accountLink.click();
        return new AccountPage(this.page);
    }

    public async signOut(): Promise<LoginPage> {
        await this.signOutButton.click();
        return new LoginPage(this.page);
    }
}