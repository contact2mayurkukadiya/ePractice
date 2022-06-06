export interface MenuModel {
    link: string;
    name: string;
    icon: string;
    hover: string;
    show?: boolean;
    child?: MenuModel[];
    enabled?: boolean;
}