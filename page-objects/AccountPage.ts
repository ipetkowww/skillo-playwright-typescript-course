import {Locator, Page} from "@playwright/test";

export class AccountPage {

    constructor(private readonly page: Page) {
    }

    public get phoneNumberField(): Locator {
        return this.page.locator("#phone");
    }

    public get phoneNumberSummaryField(): Locator {
        return this.page.locator("#summary-phone");
    }

    public get saveChangesButton(): Locator {
        return this.page.locator("#save-button");
    }

}