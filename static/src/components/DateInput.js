const DateInput = ({ value, onChange }) => {
  const [inputValue, setInputValue] = React.useState('');
  const [isValid, setIsValid] = React.useState(true);
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = React.useRef(null);
  const isMobile = window.innerWidth <= 768;

  React.useEffect(() => {
    // Convert ISO date to display format if value exists
    if (value) {
      const date = new Date(value);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      setInputValue(`${day}/${month}/${year}`);
    }
  }, [value]);

  const formatDate = (input) => {
    // Remove any non-digit characters
    const numbers = input.replace(/\D/g, '');
    
    // Add slashes automatically
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  };

  const validateDate = (dateStr) => {
    // Check format DD/MM/YYYY
    const parts = dateStr.split('/');
    if (parts.length !== 3) return false;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    // Check ranges
    if (year < 1900 || year > new Date().getFullYear()) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    // Create date object for final validation
    const date = new Date(year, month - 1, day);
    return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
  };

  const handleChange = (e) => {
    const formatted = formatDate(e.target.value);
    setInputValue(formatted);

    // If we have a complete date, validate and convert to YYYY-MM-DD
    if (formatted.length === 10) {
      const isValidDate = validateDate(formatted);
      setIsValid(isValidDate);

      if (isValidDate) {
        const [day, month, year] = formatted.split('/');
        const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        onChange(isoDate);
      } else {
        onChange(''); // Clear the value if invalid
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (isMobile) {
      // On mobile, scroll the input into view when focused
      if (inputRef.current) {
        setTimeout(() => {
          inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Validate on blur if there's a value
    if (inputValue) {
      setIsValid(validateDate(inputValue));
    }
  };

  return React.createElement('div', {
    className: 'input-container'  // Changed from date-input-container to match other inputs
  }, [
    React.createElement('img', {
      key: 'icon',
      src: "/static/icons/calendar.svg",
      alt: "",
      className: "input-icon"
    }),
    React.createElement('input', {
      key: 'input',
      ref: inputRef,
      type: "text",
      inputMode: "numeric",
      pattern: "\\d{2}/\\d{2}/\\d{4}",
      value: inputValue,
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
      placeholder: "DD/MM/YYYY",
      className: `input ${!isValid ? 'error' : ''} ${isFocused ? 'focused' : ''}`,
      maxLength: "10",
      required: true,
      'aria-label': "Date of birth",
      'aria-invalid': !isValid
    }),
    !isValid && inputValue.length === 10 && React.createElement('div', {
      key: 'error',
      className: "error-message"
    }, "Please enter a valid date")
  ]);
};

window.DateInput = DateInput;