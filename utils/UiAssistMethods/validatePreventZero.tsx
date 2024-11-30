
// const validatePreventZero = () => {
    const validateToPreventZero = (
        key: string,
        value: any,
        type: 'number' | 'boolean' | 'string', 
        setError,
      ) => {
        if (type === 'number' || type === 'boolean') {
          const numericValue = Number(value);
    
          if (type === 'number' && numericValue < 0) {
            setError(key, { type: 'manual', message: "Please input positive value." });
            return null;
          }
          return numericValue;
        }
        return value;
      };
 
// }

export default validateToPreventZero
