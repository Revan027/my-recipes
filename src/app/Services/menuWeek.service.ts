import { Injectable, signal } from '@angular/core';
import { StorageService } from './capacitor.services.common/storage-service';
import { tableName } from '../constants/table-names';
import { MenuWeek } from '../Models/Entities/MenuWeek';
import { MenuDay } from '../Models/Entities/MenuDay';
import { MenuDayPeriod } from '../Models/Entities/MenuDayPeriod';

@Injectable({
    providedIn: 'root',
})
export class MenuWeekService {

    private _menuWeek = signal<MenuWeek>(new MenuWeek());
    menuWeek = this._menuWeek.asReadonly();

    constructor(private storageService: StorageService) {}

    async create(menuWeek: MenuWeek): Promise<boolean> {
        let isSuccess = true;

        try {
            await this.storageService.getDb().beginTransaction();

            let sql = `
                INSERT INTO ${tableName.menuWeek} (year, dateWeek) 
                VALUES (?, ?)`;

            let result = await this.storageService.getDb().run(sql, [menuWeek.year, menuWeek.dateWeek], false);

            await this.createMenuDay(result.changes?.lastId ?? 0, menuWeek.menuDays);

            // tout est validé d'un coup
            await this.storageService.getDb().commitTransaction(); 
        } 
        catch (err) {
            isSuccess = false;

            if ((await this.storageService.getDb()?.isTransactionActive()).result) {
                await this.storageService.getDb()?.rollbackTransaction();   // tout est annulé si une erreur survient
            }

            return isSuccess;
        }

        return isSuccess;
    }

    private async createMenuDay(lastId: number, menuDays: MenuDay[]): Promise<void>{
            for (const menuDay of menuDays) {
                const sql = `
                    INSERT INTO ${tableName.menuDay} (menuWeekID, day) 
                    VALUES (?, ?)`;
    
                const result = await this.storageService.getDb().run(sql, [lastId, menuDay.day], false);

                await this.createMenuDayPeriod(result.changes?.lastId ?? 0, menuDay.menuDayPeriods);
            }
    }
    
    private async createMenuDayPeriod(lastId: number, menuDayPeriods: MenuDayPeriod[]): Promise<void>{
        for (const menuDayPeriod of menuDayPeriods) {
            const sql = `
                INSERT INTO ${tableName.menuDayPeriod} (menuDayID, recipeName, period) 
                VALUES (?, ?, ?)`;

            await this.storageService.getDb().run(sql, [lastId, menuDayPeriod.recipeName, menuDayPeriod.period], false);
        }
    }

    async deleteMenuWeek(year: number, dateWeek: number){     
        let sql = `DELETE FROM ${tableName.menuDayPeriod}`;

        await this.storageService.getDb().run(sql, [], false);

        sql = `DELETE FROM ${tableName.menuDay}`;

        await this.storageService.getDb().run(sql, [], false);

        sql = `DELETE FROM ${tableName.menuWeek}`;

        await this.storageService.getDb().run(sql, [], false);
    }

    async getLast(): Promise<MenuWeek>{
        let menuWeek = new  MenuWeek();

        let sql = `
            SELECT id, year, dateWeek 
            FROM ${tableName.menuWeek} 
            ORDER BY year DESC, dateWeek DESC 
            LIMIT 1`;

        let result = ((await this.storageService.getDb().query(sql)).values ?? []) as MenuWeek[];
       
        if(result[0] == undefined)
            return menuWeek;

        menuWeek = result[0];

        sql = `
            SELECT id, day, menuWeekID
            FROM ${tableName.menuDay}
            WHERE menuWeekID = ${menuWeek.id}`;
            
        menuWeek.menuDays = ((await this.storageService.getDb().query(sql)).values ?? []) as MenuDay[];

        for(let menuDay of menuWeek.menuDays){
            sql = `
                SELECT menuDayID, recipeName, period
                FROM ${tableName.menuDayPeriod}
                WHERE menuDayID = ${menuDay.id}`;

            menuDay.menuDayPeriods = ((await this.storageService.getDb().query(sql)).values ?? []) as MenuDayPeriod[]; 
        }

        return menuWeek;
    }

    async countQueryResult(): Promise<number> {
        let result = await this.storageService.getDb().query(`
            SELECT COUNT(*) as countTotal
            FROM ${tableName.menuWeek}`);

        return result.values != undefined ? (result.values[0].countTotal as number) : 0;
    }

    setMenuWeek(value: MenuWeek){
        this._menuWeek.set({...value})
    }
}
