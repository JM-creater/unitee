//import "./SearchResultsList.css";
import { SearchResult } from './SearchResult';

export const SearchResultList = ({ results }) => {
    return (
        <div className="results-list">
            {results.map((result, id) => (
                // Ensure this matches the actual property name in your product objects
                <SearchResult result={result.productName} key={id} />
            ))}
        </div>
    );
};