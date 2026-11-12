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
        // si un menu est trovué sur cette semaine on le supprime
        let sql = `
            SELECT id, year, dateWeek 
            FROM ${tableName.menuWeek} 
            WHERE year = ? AND dateWeek = ?
            LIMIT 1`;

        let result = ((await this.storageService.getDb().query(sql)).values ?? [year, dateWeek]) as MenuWeek[];

        if(result.length == 0){
            return;
        }
        
        const menuWeek = result[0];

        sql = `
            DELETE FROM ${tableName.menuDayPeriod}
            WHERE menuDayID IN (?)`;

        await this.storageService.getDb().run(sql, [menuWeek.menuDays.map(x => x.id).toString()], false);

        sql = `
            DELETE FROM ${tableName.menuDay}
            WHERE id IN (?)`;

        await this.storageService.getDb().run(sql, [menuWeek.menuDays.map(x => x.id).toString()], false);

        sql = `
            DELETE FROM ${tableName.menuWeek}
            WHERE id = ?`;

        await this.storageService.getDb().run(sql, [menuWeek.id], false);
    }

    async getLastRecipes(): Promise<string[]>{
        // a optimiser
        let recipes: string[] = [];

        let sql = `
            SELECT id, year, dateWeek 
            FROM ${tableName.menuWeek} 
            ORDER BY year DESC, dateWeek DESC 
            LIMIT 1`;

        let menuWeek = ((await this.storageService.getDb().query(sql)).values ?? []) as MenuWeek[];

        if(menuWeek[0] == undefined)
            return [];

        sql = `
            SELECT id, day, menuWeekID
            FROM ${tableName.menuDay}
            WHERE menuWeekID = ${menuWeek[0].id}`;
            
        menuWeek[0].menuDays = ((await this.storageService.getDb().query(sql)).values ?? []) as MenuDay[];

        for(let menuDay of menuWeek[0].menuDays){
            sql = `
                SELECT menuDayID, recipeName, period
                FROM ${tableName.menuDayPeriod}
                WHERE menuDayID = ${menuDay.id}`;

            menuDay.menuDayPeriods = ((await this.storageService.getDb().query(sql)).values ?? []) as MenuDayPeriod[];  

            recipes.concat( menuDay.menuDayPeriods.map(x => x.recipeName))
        }

        return recipes;
    }

      async countQueryResult(): Promise<number> {
        let result = await this.storageService.getDb().query(`
            SELECT COUNT(*) as countTotal
            FROM ${tableName.menuWeek}`);

        return result.values != undefined ? (result.values[0].countTotal as number) : 0;
    }
}
