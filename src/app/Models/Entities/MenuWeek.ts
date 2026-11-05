import { MenuDay } from "./MenuDay";

export class MenuWeek {
    constructor() {}

    year: number = 0;
    dayWeek: number = 0;
    menuDays: MenuDay[] = [];

    static createMenuWeek(data: any): MenuWeek {
        const menuWeek = new MenuWeek();
        menuWeek.year = data.year;
        menuWeek.dayWeek = data.dayWeek;

        return menuWeek;
    }
}
