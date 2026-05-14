import React, { createContext, useContext, useState } from 'react';

interface FilterState {
  fechaDesde: string;
  fechaHasta: string;
  comuna: string;
  estrato: string;
  rangoEdad: string;
  genero: string;
}

interface FilterContextType {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  applyFilters: () => void;
  clearFilters: () => void;
}

const initialFilters = {
  fechaDesde: '',
  fechaHasta: '',
  comuna: 'Todas',
  estrato: 'Todos',
  rangoEdad: 'Todas',
  genero: 'Todos',
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const applyFilters = () => {
    console.log('Applying filters:', filters);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <FilterContext.Provider value={{ filters, setFilters, applyFilters, clearFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters debe usarse dentro de un FilterProvider');
  }
  return context;
}
