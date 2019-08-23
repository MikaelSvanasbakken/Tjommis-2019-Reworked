import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteresserPage } from './interesser.page';

describe('InteresserPage', () => {
  let component: InteresserPage;
  let fixture: ComponentFixture<InteresserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteresserPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteresserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
