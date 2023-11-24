import toast from "react-hot-toast";

export const SearchResult = ({ result }) => {
    return (
        <div className="search-result" onClick={() => toast.success(`You selected ${result}!`)}>
            {result}
        </div>
    );
};