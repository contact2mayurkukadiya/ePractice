import { Component, OnInit } from '@angular/core';
import { AppState } from 'src/app/app.state';
import { PermissionRoleModel, RoleOrderModel } from 'src/app/models/app.role.model';
import { RoleService } from 'src/app/services/app.role.service';

@Component({
  selector: 'app-roles-and-permissions',
  templateUrl: './roles-and-permissions.component.html',
  styleUrls: ['./roles-and-permissions.component.css']
})
export class RolesAndPermissionsComponent implements OnInit {

  permissionRoles: PermissionRoleModel[] = [];
  roles: RoleOrderModel[] = [];

  modulePermissions: any[] = [
    {
      moduleName: "Dashboard",
      permissions: ["My Appt today", "Practice Appt Overview", "Draft Treatment Notes", "Patient Reminders", "Patient Birthdays", "Kavanii Setup checklist"]
    },
    {
      moduleName: "Diary",
      permissions: ["Appointment", "Class"]
    }
  ];

  order: any[] = [
    {
      type: "Owner", order: 1
    },
    {
      type: "Manager", order: 2
    },
    {
      type: "Practitioner", order: 3
    },
    {
      type: "Receptionist", order: 4
    },
    {
      type: "Accountant", order: 5
    },
  ]

  constructor(public appState: AppState, public roleService: RoleService) { }

  ngOnInit() {

    this.roleService.getAllRoles().subscribe(roles => {
      this.roles = [];

      let roleIdx = 0;
      roles.map(r => r.roleName).forEach(r => {
        let rom: RoleOrderModel = new RoleOrderModel();
        rom.roleName = r;
        rom.order = this.order.find(o => o.type == r).order;
        this.roles.push(rom);
        roleIdx++;
      });

      this.roles = this.roles.sort(function(a ,b) {
        return a.order - b.order;
      });

      this.roleService.getRoleAndPermissions(this.appState.UserProfile.parentBusinessId).subscribe(data => {
        if(data && data.length > 0) {
          data.forEach(p => {
            p.notEmptyModules = p.appSubModulesPermission && p.appSubModulesPermission.length > 0;

            if(p.appFullPermissionModule && p.appFullPermissionModule.length > 0 && p.appFullPermissionModule[0].modulePermission) {
              p.appFullPermissionModule[0].modulePermission.forEach(m => {
                m.order = this.order.find(o => o.type == m.roleName).order;
              });
              p.appFullPermissionModule[0].modulePermission.sort(function(a ,b) {
                return a.order - b.order;
              });
            }

            if(p.appSubModulesPermission) {
              p.appSubModulesPermission.forEach(s => {
                s.subModulePermissions.forEach(sp => {
                  sp.accessLevelSelector = sp.accessLevel ? sp.accessLevel.split(',') : [];
                  sp.order = this.roles.find(r => r.roleName == sp.roleName).order;
                });

                if(!s.subModulePermissions.find(p => p.roleName == "Owner")) {
                  s.subModulePermissions.push({
                    accessLevel: "",
                    accessLevelSelector: [],
                    isFullAccess: true,
                    order: 1,
                    roleName: "Owner"
                  });
                }

                s.subModulePermissions.sort(function(a ,b) {
                  return a.order - b.order;
                });
              });
            }
          });          
        }

        this.permissionRoles = data.filter(p => p.notEmptyModules);
      });
    });
    
    // this.modulePermissions.forEach(m => {
    //   let pr: PermissionRoleModel = new PermissionRoleModel();
    //   pr.fullAccessRoles = [];
    //   pr.expand = true;
    //   pr.id = `${m.moduleName}_GUID`
    //   pr.moduleName = m.moduleName;
    //   pr.modulePermissions = [];

    //   this.roles.forEach(role => {
    //     let far: FullAccessRole = new FullAccessRole();
    //     far.id = `${role}_GUID`;
    //     far.isFullAccess = false;
    //     far.roleName = role;
    //     pr.fullAccessRoles.push(far);        
    //   });

    //   m.permissions.forEach(p => {
    //     let mpm:ModulePermissionsModel = new ModulePermissionsModel();
    //     mpm.name = p;
    //     mpm.permissions = [];
    //     this.roles.forEach(role => {
    //       let pm: PermissionModel = new PermissionModel();
    //       pm.id = `${role}_GUID`;
    //       pm.accessLevel = ["view", "edit", "delete"];
    //       pm.roleName = role;
    //       mpm.permissions.push(pm);
    //     });      
    //     pr.modulePermissions.push(mpm);
    //   });
    //   this.permissionRoles.push(pr); 
    // });
  }
}


