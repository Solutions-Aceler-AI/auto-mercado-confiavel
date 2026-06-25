import { VEHICLES, type Vehicle } from "./mock-data";

export interface Filters {
  q: string;
  brand: string[];
  category: string[];
  fuel: string[];
  gearbox: string[];
  color: string[];
  state: string[];
  priceMin?: number;
  priceMax?: number;
  yearMin?: number;
  yearMax?: number;
  kmMin?: number;
  kmMax?: number;
}

export const EMPTY_FILTERS: Filters = {
  q: "",
  brand: [], category: [], fuel: [], gearbox: [], color: [], state: [],
};

export type SortKey = "relevance" | "price-asc" | "price-desc" | "newest";

export function applyFilters(filters: Filters, sort: SortKey = "relevance"): Vehicle[] {
  const q = filters.q.trim().toLowerCase();
  let out = VEHICLES.filter((v) => {
    if (q && !`${v.brand} ${v.model} ${v.version}`.toLowerCase().includes(q)) return false;
    if (filters.brand.length && !filters.brand.includes(v.brand)) return false;
    if (filters.category.length && !filters.category.includes(v.category)) return false;
    if (filters.fuel.length && !filters.fuel.includes(v.fuel)) return false;
    if (filters.gearbox.length && !filters.gearbox.includes(v.gearbox)) return false;
    if (filters.color.length && !filters.color.includes(v.color)) return false;
    if (filters.state.length && !filters.state.includes(v.state)) return false;
    if (filters.priceMin && v.price < filters.priceMin) return false;
    if (filters.priceMax && v.price > filters.priceMax) return false;
    if (filters.yearMin && v.year < filters.yearMin) return false;
    if (filters.yearMax && v.year > filters.yearMax) return false;
    if (filters.kmMin && v.km < filters.kmMin) return false;
    if (filters.kmMax && v.km > filters.kmMax) return false;
    return true;
  });

  switch (sort) {
    case "price-asc": out = [...out].sort((a, b) => a.price - b.price); break;
    case "price-desc": out = [...out].sort((a, b) => b.price - a.price); break;
    case "newest": out = [...out].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)); break;
    default:
      out = [...out].sort((a, b) => (b.highlighted ? 1 : 0) - (a.highlighted ? 1 : 0));
  }
  return out;
}