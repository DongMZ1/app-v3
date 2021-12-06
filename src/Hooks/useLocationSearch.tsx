import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const useLocationSearch = (searchKey: string) => {
  const location = useLocation();
  const getSearchValue = () => {
    const search = location.search;
    const searchValue = new URLSearchParams(search).get(searchKey);
    return searchValue ? searchValue : "";
  };

  const [value, setValue] = useState(getSearchValue());

  useEffect(() => {
    setValue(getSearchValue());
  }, [location]);

  return [value];
};

export default useLocationSearch;
