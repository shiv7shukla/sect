import React from 'react';

const useDebounce = (value: string, delay: number) => {
  const [debouncedVal, setDebouncedVal] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedVal(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay])

  return debouncedVal;
}

export default useDebounce
