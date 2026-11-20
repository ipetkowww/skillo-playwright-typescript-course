import {expect, Locator, Page} from "@playwright/test";
import {HeaderComponent} from "./components/HeaderComponent";
import {pathToFileURL} from "node:url";
import {resolve} from "node:path";

export class OrdersPage {

    constructor(private readonly page: Page) {
    }

    public get headerComponent(): HeaderComponent {
        return new HeaderComponent(this.page);
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

    public get totalButton(): Locator {
        return this.page.locator("#sort-total");
    }

    public get totalHeader(): Locator {
        return this.page.locator("th.total");
    }

    public get totalCells(): Locator {
        return this.page.locator('td.total');
    }

    async open() {
        const ordersPageUrl: string = pathToFileURL(resolve(__dirname, '../pages/index.html')).href;
        await this.page.goto(ordersPageUrl);
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

            let expectedStatus: StatusEnum = expectedStatuses[i]!;
            expect(actualStatus).toEqual(expectedStatus);
        }
    }

    public async verifyTotalOrdersSortedDescending(): Promise<void> {
        const attribute = await this.totalHeader.getAttribute("aria-sort");
        expect(attribute).toEqual("descending");


        const actualValues: number[] = (await this.totalCells.allTextContents())
            .map(x => Number(x.replace(/[$,]/g, '').trim())
            );
        expect(actualValues.length).toBeGreaterThan(0);

        const expectedValues: number[] = [...actualValues].sort((a: number, b: number) => b - a);
        expect(actualValues).toEqual(expectedValues);
    }
}

export enum StatusEnum {
    AllStatuses = "",
    Pending = "Pending",
    Paid = "Paid",
    Shipped = "Shipped",
    Cancelled = "Cancelled",
}