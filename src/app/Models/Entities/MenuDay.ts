import { MenuDayPeriod } from "./MenuDayPeriod";

export class MenuDay {
    constructor() {}

    id: number = 0;
    day!: string;
    menuDayPeriods: MenuDayPeriod[] = [];
}
