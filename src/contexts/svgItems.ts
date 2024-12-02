import { createContext } from '@lit/context';
import { LogoItem } from '../types/LogoItem';
import names from '../assets/names.json';

export const defaultPreselectedItems = names as LogoItem[];

export const allItemsContext = createContext<LogoItem[]>('all-items');
export const selectedItemsContext = createContext<LogoItem[]>('selected-items');
export const preselectedItemsContext =
  createContext<LogoItem[]>('preselected-items');
export const itemsContext = createContext<LogoItem[]>('items');
export const isLoadingContext = createContext<boolean>('is-loading');
