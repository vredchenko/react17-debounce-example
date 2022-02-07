import { useState } from 'react'
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { useAsync } from 'react-async-hook';
import useConstant from 'use-constant';

const API_URL = 'https://gorest.co.in/public/v1/users?name='
const searchAPI = async (text) => await fetch(API_URL + encodeURIComponent(text));

const useDebouncedSearch = (searchFunction) => {
  const [inputText, setInputText] = useState('');

  const debouncedSearchFunction = useConstant(async () =>
    await AwesomeDebouncePromise(searchAPI, 3000)
  );

  const searchResults = await useAsync(
    async () => {
      if (inputText.length === 0) {
        return [];
      } else {
        return debouncedSearchFunction(inputText);
      }
    },
    [debouncedSearchFunction, inputText]
  );

  return {
    inputText,
    setInputText,
    searchResults,
  };
};

const LookaheadSearchInput = () => {
  const { inputText, setInputText, searchResults } = useDebouncedSearch(text => searchAPI(text));
  return (
    <div>
      <input value={inputText} onChange={e => setInputText(e.target.value)} />
      <div>
        {searchResults.loading && <div>loading...</div>}
        {searchResults.error && <div>Error: {searchResults.error.message}</div>}
        {searchResults.result && searchResults.result.data && (
          <div>
            <div>Results: {searchResults.result.data.length}</div>
            <ul>
              {searchResults.result.data.map(result => (
                <li key={result.id}>
                  {result.name} - {result.email} - {result.gender} - {result.status}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LookaheadSearchInput
