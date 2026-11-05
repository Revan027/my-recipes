import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionNumber } from './version-number';

describe('VersionNumber', () => {
    let component: VersionNumber;
    let fixture: ComponentFixture<VersionNumber>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [VersionNumber],
        }).compileComponents();

        fixture = TestBed.createComponent(VersionNumber);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
