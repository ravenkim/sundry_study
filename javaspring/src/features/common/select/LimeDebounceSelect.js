import React from 'react';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { useMemo, useRef, useState } from 'react';

const LimeDebounceSelect = ({ url, debounceTimeout = 800, className, ...props }) => {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);

  const fetchUserList = async (username) => {
    if (username.length >= 2) {
      console.log('fetch: ',fetch(url).then((response) => response.json()));
      return fetch(url)
        .then((response) => response.json())
        .then((body) =>
          body.results.map((user) => ({
            label: `${user.name.first} ${user.name.last}`,
            value: user.login.username,
          })),
        );
    }
  };

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      console.log('value: ',value);
      console.log('length: ',value.length);
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      fetchUserList(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }
        console.log('newOptions: ',newOptions);
        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchUserList, debounceTimeout]);


  return (
    <Select
      className={className}
      labelInValue
      filterOption={true}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
} // Usage of DebounceSelect

export default LimeDebounceSelect;