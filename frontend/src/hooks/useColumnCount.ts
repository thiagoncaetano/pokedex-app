import { useState, useEffect } from 'react';

// Retorna o número de colunas baseado nos breakpoints do Tailwind
export function useColumnCount() {
  const [columns, setColumns] = useState(2); // Starts with mobile (grid-cols-2)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const updateColumns = () => {
      const width = window.innerWidth;
      if (width >= 1024) setColumns(6);      // lg:grid-cols-6
      else if (width >= 768) setColumns(4);  // md:grid-cols-4
      else if (width >= 640) setColumns(3);  // sm:grid-cols-3
      else setColumns(2);                    // grid-cols-2
    };

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateColumns, 100); // 100ms debounce
    };

    updateColumns();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return columns;
}
