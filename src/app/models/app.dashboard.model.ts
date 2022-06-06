export class DashboardModel {
    id: string;
    isBusinessAdded: boolean;
    isLocationAdded: boolean;
    isStaffAdded: boolean;
    isStaffPermissionAdded: boolean;
    isPractitionerScheduled: boolean;
    isServiceAdded: boolean;
    isClassAdded: boolean;
    isProductAdded: boolean;
    isContactAdded: boolean;
    isReferralAdded?: boolean;
    isThirdPartyAdded?: boolean;
    isGeneralAdded?: boolean;
  }

  export class DashboardMapping {
      title: string;
      key: string;
      value: boolean;
      skipOption?: boolean;
  }