import { SearchIcon, X } from "lucide-react";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { handleResponseError } from "@/lib/utils";
import { searchJob } from "@/services/job/api";
import Loading from "../ui/Loading";
import JobCard from "../ui/JobCard";
import searching from "@/assets/images/searching.svg";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  addSearch,
  clearRecentSearches,
  removeSearch,
} from "@/lib/slices/search/searchSlice";
import { Button } from "../ui/Button";
import { Job } from "@/lib/slices/job/types";

const Search = () => {
  const dispatch = useDispatch<AppDispatch>();
  const recentSearches = useSelector(
    (state: RootState) => state.search.recentSearches,
  );

  const [isInitial, setIsInitial] = useState(true);
  const [results, setResults] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsInitial(false);
      setLoading(true);
    } else {
      setIsInitial(true);
      setLoading(false);
      setResults([]);
      setDebouncedQuery("");
    }

    const timeout = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    const onSearch = async (query: string) => {
      try {
        const response = await searchJob(query);
        dispatch(addSearch(query));
        setResults(response.jobs);
      } catch (error) {
        handleResponseError(error);
      } finally {
        setLoading(false);
      }
    };

    if (debouncedQuery.trim()) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, dispatch]);

  return (
    <div className="space-y-4 px-4">
      <h1 className="text-2xl font-bold">Search for your ideal job</h1>

      <div className="relative mx-auto max-w-[500px]">
        <SearchIcon className="text-muted-foreground absolute top-3 left-3" />
        <Input
          type="search"
          className="pl-11"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isInitial && (
        <div className="mx-auto max-w-[500px]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Searches</h2>
            {recentSearches.length > 0 && (
              <Button
                variant="link"
                className="text-foreground p-0"
                onClick={() => dispatch(clearRecentSearches())}
              >
                Clear all
              </Button>
            )}
          </div>

          <div className="mt-2 flex w-full flex-col gap-1">
            {recentSearches.map((search) => (
              <div className="flex items-center gap-2" key={search}>
                <Button
                  variant="ghost"
                  className="flex-1 justify-start"
                  onClick={() => setSearchQuery(search)}
                >
                  {search}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => dispatch(removeSearch(search))}
                >
                  <X />
                </Button>
              </div>
            ))}
            {recentSearches.length === 0 && (
              <span className="text-sm">No recent searches.</span>
            )}
          </div>
        </div>
      )}

      <div>
        {loading ? (
          <Loading logoClassName="h-[50px]" />
        ) : (
          results &&
          (results.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((job) => (
                <JobCard job={job} key={job.id} />
              ))}
            </div>
          ) : (
            !isInitial && (
              <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 pt-12">
                <span className="text-center font-medium">
                  No search results found for "{searchQuery}".
                </span>

                <div className="bg-background dark:bg-foreground size-[350px] overflow-hidden rounded-full p-4">
                  <img src={searching} className="text-foreground" />
                </div>
              </div>
            )
          ))
        )}
      </div>
    </div>
  );
};

export default Search;
