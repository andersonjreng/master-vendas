import {ComponentFactoryResolver, ComponentRef, ContentChild, Injectable, TemplateRef, Type, ViewContainerRef} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

export interface DrawerOptions {
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class DrawerLayoutService {
  private drawerStateSubject = new BehaviorSubject<boolean>(false);
  drawerState$ = this.drawerStateSubject.asObservable();

  private drawerContentSubject = new BehaviorSubject<Type<any> | null>(null);
  drawerContent$ = this.drawerContentSubject.asObservable();

  title: string ='';

  private options = new BehaviorSubject<DrawerOptions | null>(null);
  options$ = this.options.asObservable();

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  isOpen() {
    return this.drawerStateSubject.value;
  }
  setDrawerState(state: boolean) {
    console.log('Setting drawer state to:', state);
    this.drawerStateSubject.next(state);
  }

  openDrawer(title: string, componentType: Type<any>) {
    this.setDrawerState(true);
    this.title = title;
    this.drawerContentSubject.next(componentType);
  }


  closeDrawer() {
    this.title = ''; // Set title to an empty string
    if (this.drawerContentSubject.value != null) this.drawerContentSubject.next(null);
    if (this.isOpen()) this.setDrawerState(false);
  }


}
