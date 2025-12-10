import { useState } from 'react';

export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValues = {
      ...values,
      [name]: value
    };
    setValues(newValues);

    // Validación en tiempo real
    if (validationRules[name] && touched[name]) {
      const error = validationRules[name](value, newValues);
      setErrors({
        ...errors,
        [name]: error
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });

    // Validar al perder el foco
    if (validationRules[name]) {
      const error = validationRules[name](values[name], values);
      setErrors({
        ...errors,
        [name]: error
      });
    }
  };

  const handleSubmit = (callback) => (e) => {
    e.preventDefault();
    
    // Validar todos los campos
    const newErrors = {};
    let hasErrors = false;

    Object.keys(validationRules).forEach(field => {
      const error = validationRules[field](values[field], values);
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {}));

    if (!hasErrors) {
      callback(values);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  const setFieldValue = (name, value) => {
    setValues({
      ...values,
      [name]: value
    });
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue
  };
};