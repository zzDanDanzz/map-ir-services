import { useState, useCallback } from 'react';
import { qs, qsParse } from 'utils';

const setQueryStringWithoutPageReload = (qsValue: string) => {
  const newurl =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    qsValue;

  window.history.pushState({ path: newurl }, '', newurl);
};

const setQueryStringValue = (
  key: string,
  value: string,
  queryString = window.location.search
) => {
  const values = qsParse(queryString);
  const newQsValue = qs({ ...values, [key]: value });
  setQueryStringWithoutPageReload(`?${newQsValue}`);
};

export const getQueryStringValue = (
  key: string,
  queryString = window.location.search
) => {
  const values = qsParse(queryString);
  return values[key];
};

function useQueryString(key: string, initialValue?: string) {
  const [value, setValue] = useState(getQueryStringValue(key) || initialValue);
  const onSetValue = useCallback(
    (newValue: string) => {
      setValue(newValue);
      setQueryStringValue(key, newValue);
    },
    [key]
  );

  return [value, onSetValue];
}

export default useQueryString;
