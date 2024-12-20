let timeout: ReturnType<typeof setTimeout>;

export const debounce = (func: Function, wait: number) => {
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
