declare module 'lucide-react-native' {
  import { SvgProps } from 'react-native-svg';
  import { ComponentClass, FunctionComponent } from 'react';

  export interface LucideProps extends SvgProps {
    size?: number | string;
    absoluteStrokeWidth?: boolean;
    color?: string;
    style?: any;
    fill?: string;
  }

  export type LucideIcon = FunctionComponent<LucideProps>;

  // Export all icons used
  export const Mail: LucideIcon;
  export const Lock: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const User: LucideIcon;
  export const Home: LucideIcon;
  export const ShoppingBag: LucideIcon;
  export const ShoppingCart: LucideIcon;
  export const Plus: LucideIcon;
  export const Send: LucideIcon;
  export const CreditCard: LucideIcon;
  export const History: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Filter: LucideIcon;
  export const Search: LucideIcon;
  export const Star: LucideIcon;
  export const Trash2: LucideIcon;
  export const Truck: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const Heart: LucideIcon;
  export const Settings: LucideIcon;
  export const LogOut: LucideIcon;
  export const Eye: LucideIcon;
  export const EyeOff: LucideIcon;
}
