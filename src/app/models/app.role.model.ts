export class RoleModel {
    id: string;
    roleName: string;
}

export class PermissionRoleModel {
    id: string;
    moduleName: string; //dashboard
    isExpand: boolean;
    appFullPermissionModule: FullPermissionModule[];
    appSubModulesPermission: SubModulePermissionsModel[];
    notEmptyModules: boolean;

}

export class FullAccessRole {
    moduleId: string;
    moduleName: string;
    roleId: string;
    roleName: string; 
    isFullAccess: boolean;
    order?: number;
}

export class FullPermissionModule {
    moduleName: string;
    modulePermission: FullAccessModulePermission[];
}

export class FullAccessModulePermission {
    roleName: string;
    isFullAccess: boolean;
    order?: number;
}

export class SubModulePermissionsModel {    
    subModuleName: string;
    subModulePermissions: PermissionModel[];
    accessLevel: string;
}

export class PermissionModel {
    id?: string;
    roleName: string;
    accessLevel: string;
    accessLevelSelector: string[];
    isFullAccess: boolean;
    order?: number;
}

export class RoleOrderModel {
    roleName: string;
    order: number;
}


//use for getRoleAndPermissionsByUserLocation
export class LocationRoleAndPermissionModel {
    isFullAccess: boolean;
    moduleName: string;
    appSubModules: LocationRoleAndSubPermissionModel[];
}

export class LocationRoleAndSubPermissionModel {
    subModuleName: string;
    accessLevel: string;
}