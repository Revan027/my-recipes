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
alert(1)
            let result = await this.storageService.getDb().run(sql, [menuWeek.year, menuWeek.dayWeek], false);
alert(result.changes?.lastId)
            await this.createMenuDay(result.changes?.lastId ?? 0, menuWeek.menuDays);

            // tout est validé d'un coup
            await this.storageService.getDb().commitTransaction(); 
        } catch (err) {
            isSuccess = false;
alert()
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

     async getAllLight(): Promise<MenuWeek[]>{
try{
 let recipesResult = await this.storageService.getDb().query(`
            SELECT menuWeek.id as mwid, menuWeek.year as year, menuWeek.dateWeek as dateWeek, menuDay.day as day, menuDay.id as mdid,  menuDayPeriod.recipeName, menuDayPeriod.period         
            FROM ${tableName.menuWeek} as menuWeek
            INNER JOIN ${tableName.menuDay} AS menuDay ON ${tableName.menuDay}.menuWeekID = mwid
            INNER JOIN ${tableName.menuDayPeriod} AS menuDayPeriod ON ${tableName.menuDayPeriod}.menuDayID = mdid;`);
alert(JSON.stringify(recipesResult.values, null, 2));
}catch(e){
alert(e)
}
      
return [];
        //return recipesResult.values?.map((item) => MenuWeek.createMenuWeek(item)) ?? [];
    }
}
