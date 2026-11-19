import {expect, Locator, Page} from "@playwright/test";

export class OrdersPage {

    constructor(private readonly page: Page) {
    }

    public get signOutButton(): Locator {
        return this.page.locator("#logout-button");
    }

    public get heading(): Locator {
        return this.page.getByRole("heading", {name: "Orders"});
    }

    public get orderRows(): Locator {
        return this.page.locator("tbody tr");
    }

    public get resultsCountParagraph(): Locator {
        return this.page.locator("#results-count");
    }

    public get customerNameField(): Locator {
        return this.page.locator("#search");
    }

    public get statusDropdown(): Locator {
        return this.page.locator("#status-filter");
    }

    public get totalTableHeader(): Locator {
        return this.page.locator("#sort-total");
    }

    public async filterByCustomerNameAndStatus(customerName: string, status: StatusEnum = StatusEnum.AllStatuses): Promise<void> {
        await this.customerNameField.fill(customerName);
        if (status) {
            await this.statusDropdown.selectOption(status);
        }
    }

    public async verifyOrderStatus(expectedOrderCount: number, expectedStatuses: StatusEnum[]) {
        await expect(this.orderRows).toHaveCount(expectedOrderCount);

        for (let i = 0; i < expectedOrderCount; i++) {
            let actualStatus = await this.page.locator(`tbody tr:nth-child(${i + 1})`)
                .locator("td:nth-child(4)")
                .innerText();

            let expectedStatus = expectedStatuses[i];
            expect(actualStatus).toEqual(expectedStatus);
        }
    }

    public async sortDescendingOrdersTotal(): Promise<void> {
        await this.totalTableHeader.click();
    }
}

export enum StatusEnum {
    AllStatuses = "",
    Pending = "Pending",
    Paid = "Paid",
    Shipped = "Shipped",
    Cancelled = "Cancelled",
}