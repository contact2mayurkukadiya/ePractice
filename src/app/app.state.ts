// Angular import
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { UserProfile } from './models/app.user.model';
import { LocationGridModel, LocationSelectionModel } from './models/app.location.model';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BusinessService } from './services/app.business.service';
import { RoleService } from './services/app.role.service';
import { Router, NavigationEnd } from '@angular/router';
import { LocationRoleAndPermissionModel } from './models/app.role.model';
import { MenuModel } from './models/app.menu.model';
import { filter, map } from 'rxjs/operators';

export type InternalStateType = {
  [key: string]: any
};

@Injectable()
export class AppState {

  public contrastBackground: boolean = false;
  contrastBackgroundSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public userProfile: UserProfile;
  userProfileSubject: BehaviorSubject<UserProfile> = new BehaviorSubject(null);

  public authenicatied: boolean;
  authenicatiedSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public isTablet: boolean = false;
  public sizeChangedState: Subject<boolean> = new Subject();
  
  public selectedTab: number = 0;
  public selectedTabState: Subject<number> = new Subject();

  public selectedSpecialisationTab: number = 0;
  public selectedSpecialisationTabState: Subject<number> = new Subject();

  public selectedAppointmentTab: number = 0;
  public selectedAppointmentTabState: Subject<number> = new Subject();

  public selectedPatientTab: number = 0;
  public selectedPatientTabState: Subject<number> = new Subject();

  public selectedBillingTab: number = 0;
  public selectedBillingTabState: Subject<number> = new Subject();
  public selectedUserLocationIdState: Subject<string> = new Subject();
  public selectedUserLocationState: Subject<LocationSelectionModel> = new Subject();

  public get selectedUserLocation() {
    let l = localStorage.getItem('selectedUserLocation');
    return l ? JSON.parse(l) : null;
  }

  public set selectedUserLocation(v) {
    localStorage.setItem('selectedUserLocation', JSON.stringify(v));
  }

  public get selectedUserLocationId() {


    return localStorage.getItem('selectedUserLocationId');
  }

  public set selectedUserLocationId(v) {
    localStorage.setItem('selectedUserLocationId', v);
  }

  _state: InternalStateType = {};

  public sideNavToggle: boolean = true;
  public sideNavState: Subject<boolean> = new Subject();

  public locationList: LocationSelectionModel[];
  public locationListState: Subject<LocationSelectionModel[]> = new Subject();
  locationInterval: any;

  public permissions: LocationRoleAndPermissionModel[];
  public permissionState: Subject<LocationRoleAndPermissionModel[]> = new Subject();

  public toolsPermission: LocationRoleAndPermissionModel;
  public toolsPermissionState: Subject<LocationRoleAndPermissionModel> = new Subject();

  public businessAccess: string[] = [];
  private businessPermissionState: Subject<string[]> = new Subject();
  public locationAccess: string[] = [];
  private locationPermissionState: Subject<string[]> = new Subject();
  publicUrls: string[] = ["/login", "/forgotpassword", "/register"];

  private testUserAccountNames: string[] = [
    "anushaprasanna27@gmail.com", 
    "kavaniiowner@gmail.com", 
    "kavaniimanager@gmail.com",
    "kavaniiacct@gmail.com",
    "kavaniirec@gmail.com",
    "kavaniipractitioner@gmail.com"
  ];

  public topMenus: MenuModel[] = [
    {name: 'Dashboard', link:'/dashboard', icon: 'dashboard', hover: 'Dashboard', show: false },
    {name: 'Tools', link:'/tools', icon: 'build', hover: 'Tools', show: false },
    {name: 'Staffs', link:'/staffs', icon: 'perm_contact_calendar', hover: 'Staffs', show: false },
    {name: 'Offering', link:'/offerings', icon: 'shopping_basket', hover: 'Offering', show: false },
    {name: 'Contacts', link:'/contacts', icon: 'contacts', hover: 'Contacts', show: false },
  ];

  public menus: MenuModel[] = [
    {name: 'Appointments', link:'/appointment', icon: 'calendar_today', hover: 'Appointments', show: false },
    {name: 'Patients', link:'/patients', icon: 'face', hover: 'Patients', show: false },
    {name: 'Bills', link:'/bills', icon: 'list_alt', hover: 'Bills', show: false },
    {name: 'Expenses', link:'/expense', icon: 'attach_money', hover: 'Expenses', show: false },
    {name: 'Items', link:'/items', icon: 'list', hover: 'Items (Services, Classes and Inventory)', show: false },
    {name: 'Communications', link:'/communications', icon: 'mail_outline', hover: 'Communications (Email, SMS)', show: false },
    {name: 'Reports', link:'/reports', icon: 'assessment', hover: 'Reports', show: false },
    {name: 'Settings', link:'/settings', icon: 'settings', hover: 'Settings', show: false },
  ];

  constructor(private breakpointObserver: BreakpointObserver,
              public businessService: BusinessService,
              public roleService: RoleService,
              private router: Router,
              ) {

    this.populateStateChangeEvents();
    router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        
        if(this.publicUrls.indexOf(event.url) < 0) {
          if(this.selectedUserLocation) {
            this.loadUserRolePermissions(this.selectedUserLocation);
            this.routeAccessDenied(event.url);
          }
        }
      }
    });
  }

  routeAccessDenied(url: string) {
    if(this.applicableForPermission()) {
      // console.log("all permissions", this.permissions);
      if(this.permissions && this.permissions.length > 0) {
        let module = this.routeModuleMapper(url);
        let subModule = "";

        if(module.indexOf(',') > 0) {
          let split = module.split(',');
          module = split[0];
          subModule = split[1];
        }

        let permission_Module = this.permissions.find(p => p.moduleName == module);
        if(subModule) {
          let p = this.getSubModulePermission(module, subModule);
          // console.log("sub module permission",subModule, url, p);
          if(!permission_Module || (!permission_Module.isFullAccess && p.length == 0)) {
            this.router.navigate(["/accessDenied"]);
          }
        }
        else {
          // console.log("root module permission", module, url, permission_Module);
          if(!permission_Module || (!permission_Module.isFullAccess && permission_Module.appSubModules.length == 0)) {
            this.router.navigate(["/accessDenied"]);
          }
        }
      }
    }
  }

  private populateStateChangeEvents() {
    this.authenicatiedSubject.subscribe(s => {
      setTimeout(() => {
        this.authenicatied = s;
      });
    });

    this.selectedUserLocationState.subscribe(c => {
      this.selectedUserLocation = c;
      if(c) {
        this.selectedUserLocationId = c.id;
        this.loadUserRolePermissions(c);
      }
    });

    this.selectedUserLocationIdState.subscribe(c => {
      this.selectedUserLocationId = c;
      if(this.locationList) {
        this.selectedUserLocation = this.locationList.find(l => l.id == c);
      }
    });

    this.locationListState.subscribe(s => {
      this.locationList = s;
      if(!this.selectedUserLocation) {
        this.selectedUserLocationState.next(this.locationList[0]);
      }
    });

    this.userProfileSubject.subscribe(s => {
      this.userProfile = s;
      if(!this.locationList && s) {
        this.loadUserLocations();
      }
    });

    this.contrastBackgroundSubject.subscribe(s => {
      setTimeout(() => {
        this.contrastBackground = s;
      });
    });

    this.sizeChangedState.subscribe(c => {
      this.isTablet = c;
    });

    this.breakpointObserver.observe(['(min-width: 768px) and (max-width: 1366px)']).subscribe(result => {
      this.sizeChangedState.next(result.matches);
    });

    this.selectedTabState.subscribe(c => {
      this.selectedTab = c;
    });
    this.selectedSpecialisationTabState.subscribe(c => {
      this.selectedSpecialisationTab = c;
    });
    this.selectedAppointmentTabState.subscribe(c => {
      this.selectedAppointmentTab = c;
    });
    this.selectedPatientTabState.subscribe(c => {
      this.selectedPatientTab = c;
    });
    this.selectedBillingTabState.subscribe(c => {
      this.selectedBillingTab = c;
    });

    this.sideNavState.subscribe(s => {
      setTimeout(() => {
        this.sideNavToggle = s;
      });
    });

    this.permissionState.subscribe(s => {
      this.permissions = s;
    });

    this.toolsPermissionState.subscribe(s => {
      this.toolsPermission = s;
    });

    this.businessPermissionState.subscribe(s => {
      this.businessAccess = s;
    });

    this.locationPermissionState.subscribe(s => {
      this.locationAccess = s;
    });
  }

  public loadLocationWhenReady() {
    if(this.userProfile) {
      this.loadUserLocations();
    }
    else {
      this.locationInterval = setInterval(() => {
        if(!this.userProfile) {
          this.loadLocationWhenReady();
          clearInterval(this.locationInterval);
        }
      }, 500);
    }
  }

  public loadUserLocations() {
    this.businessService.getLocationsForCurrentUser()
    .pipe(
      map(items => items.filter(l => l.status))
    ).subscribe(l => {
      this.locationListState.next(l);
      if(!this.selectedUserLocation) {
        this.selectedUserLocationState.next(this.locationList[0]);
      }
    });
  }

  private loadUserRolePermissions(location: LocationSelectionModel) {    
    if(this.publicUrls.indexOf(this.router.url) < 0) { 
      if(location) {
        this.roleService.getRoleAndPermissionsByUserLocation(location.id).subscribe(data => {
          this.permissionState.next(data);
          this.populateMenuApperance(data);
        });
      }
    }    
  }

  private populateMenuApperance(permission: LocationRoleAndPermissionModel[]) {
    if(this.applicableForPermission()) {
      this.topMenus.forEach(tm => {
        let p = permission.find(p => p.moduleName == tm.name);
        tm.show = p != null && (p.isFullAccess || p.appSubModules.length > 0);
      });

      this.menus.forEach(m => {
        let p = permission.find(p => p.moduleName == m.name);
        m.show = p != null && (p.isFullAccess || p.appSubModules.length > 0);
      });
    }
    else {
      this.topMenus.forEach(tm => {
        tm.show = true;
      });
      this.menus.forEach(m => {
        m.show = true;
      });
    }
  }

  getSubModulePermission(rootModuleName: string, subModuleName: string): string[] {
    if(this.applicableForPermission()) {
      let root = this.permissions.find(p => p.moduleName == rootModuleName);
      if(root) {
        let subModule = root.appSubModules.find(m => m.subModuleName == subModuleName);
        let subModulePermission:string[] = [];
        if(root.isFullAccess ) {
          subModulePermission = ["V", "E", "D"];
        }
        else {
          subModulePermission = subModule && subModule.accessLevel ? subModule.accessLevel.split(',') : [];
        }
        return subModulePermission;
      }
    }
    else {
      return ["V", "E", "D"];
    }

    return [];
  }

  haveAccessToModule(m: LocationRoleAndPermissionModel): boolean {
    return m != null && (m.isFullAccess || m.appSubModules.length > 0);
  }

  public applicableForPermission() {
    //TODO: return true once development for role and permission is completed.
    if(this.userProfile) {
      return this.testUserAccountNames.indexOf(this.userProfile.userName) >= 0;
    }
    return false;
  }

  // already return a clone of the current state
  get state() {
    return this._state = this.clone(this._state);
  }

  // never allow mutation
  set state(value) {
    throw new Error('do not mutate the `.state` directly');
  }

  get(prop?: any) {
    // use our state getter for the clone
    const state = this.state;
    //return state.hasOwnProperty(prop) ? state[prop] : state;
    return state.hasOwnProperty(prop) ? state[prop] : null;
  }

  set(prop: string, value: any) {
    // internally mutate our state
    return this._state[prop] = value;
  }

  public get IsAuthenticated(): Boolean {
    if (this.userProfile && this.userProfile.userName) {
      return true;
    }

    return false;
  }

  get UserProfile(): UserProfile {
    return this.userProfile;
  }

  setUserProfileSubject(userProfile: UserProfile) {
    // this.userProfile = userProfile;
    this.userProfileSubject.next(userProfile);
    if(this.userProfile) {
      this.authenicatiedSubject.next(true);
    }
    else {
      this.authenicatiedSubject.next(false);
    }
  }

  public clone(object: InternalStateType) {
    // simple object clone
    return JSON.parse(JSON.stringify(object));
  }

  routeModuleMapper(route: string) {
    let map = "";
    switch(route) {
      case "/appointment":
      case "/appointment/schedule":
      case "/appointment/create": 
      case "/appointment/create-practitioner": 
      case "/appointment/today": 
      case "/appointment/room": 
      case "/appointment/waitlist": 
        map = "Appointment";
        break;
      case "/dashboard":
        map = "Dashboard";
        break;
      case "/tools":
        map = "Tools";
        break;
      case "/tools/business/edit":
        map = "Tools,Business Information";
        break;
      case "/offerings":
        map = "Offering";
        break;
      case "/contacts":
        map = "Contacts";
        break;
    }

    if(route.indexOf("/tools/locations") >= 0) {
      map = "Tools,Business Information";
    }

    if(route.indexOf("/tools/specialty") >= 0) {
      map = "Tools,Specialisation";
    }

    if(route.indexOf("/tools/tax") >= 0 ||
       route.indexOf("/tools/discountType") >= 0 ||
       route.indexOf("/tools/paymentType") >= 0
    ) {
      map = "Tools,Billing";
    }

    if(route.indexOf("/tools/treatmentRoom") >= 0 ||
       route.indexOf("/tools/appointmentType") >= 0 ||
       route.indexOf("/tools/missedReason") >= 0 ||
       route.indexOf("/tools/cancelReason") >= 0
    ) {
      map = "Tools,Appointment settings";
    }

    if(route.indexOf("/tools/marketingReferralSource") >= 0 ||
       route.indexOf("/tools/concession") >= 0 ||
       route.indexOf("/tools/documentType") >= 0
    ) {
      map = "Tools,Patient Settings";
    }

    if(route.indexOf("/settings") >= 0) {
      map = "Settings";
    }

    if(route.indexOf("/staffs") >= 0) {
      map = "Staffs";
    }

    return map;
  }

  getRouteLinkByName(name: string) {
   
    let menu = "";
    let subMenu = this.menus.find(m => m.name == name);

  }

  getRootPath() {
    
  }

  resetState() {
    this.setUserProfileSubject(null);
    this.locationList = null;
    this.selectedUserLocation = null;
    this.permissions = null;
    this.menus.forEach(m => m.show = false);
    this.topMenus.forEach(m => m.show = false);
    localStorage.removeItem("selectedUserLocationId");
    localStorage.removeItem("selectedUserLocation");
  }

}
