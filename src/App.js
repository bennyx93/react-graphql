import github from "./db.js";
import query from "./Query.js";
import { useEffect, useState, useCallback } from "react";
import RepoInfo from "./RepoInfo";
import SearchBox from "./SearchBox";
import NavButtons from "./NavButtons";

function App() {

  let [userName, setUserName] = useState("");
  let [repoList, setRepoList] = useState(null);
  let [pageCount, setPageCount] = useState(10);
  let [queryString, setQueryString] = useState("");
  let [totalCount, setTotalCount] = useState(null);

  let [startCursor, setStartCursor] = useState(null);
  let [endCursor, setEndCursor] = useState(null);
  let [hasNextPage, setHasNextPage] = useState(false);
  let [hasPreviousPage, setHasPreviousPage] = useState(false);
  let [paginationKeyword, setPaginationKeyword] = useState("first");
  let [paginationString, setPaginationString] = useState("");

  const fetchData = useCallback(() => {
    const queryText = JSON.stringify(query(pageCount, queryString, paginationKeyword, paginationString)); 

    fetch(github.baseURL, {
      // Need to use POST since we are using headers
      method: "POST",
      headers: github.headers,
      body: queryText,
    })
    .then(response => response.json())
    .then(data => {
      const viewer = data.data.viewer
      const repos = data.data.search.edges;
      const total = data.data.search.repositoryCount
      const start = data.data.search.pageInfo?.startCursor;
      const end = data.data.search.pageInfo?.endCursor;
      const hasNext = data.data.search.pageInfo?.hasNextPage;
      const hasPrev = data.data.search.pageInfo?.hasPreviousPage;

      setUserName(viewer.name);
      setRepoList(repos);
      setTotalCount(total);

      setStartCursor(start);
      setEndCursor(end);
      setHasNextPage(hasNext);
      setHasPreviousPage(hasPrev);
    })
    .catch(err => {
      console.log(err)
    });
  }, [pageCount, queryString, paginationKeyword, paginationString]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="App container mt-5">
      <h1 className="text-primary"><i className="bi bi-diagram-2-fill"></i>Repos</h1>
      <p>Hey there {userName}</p>
      <SearchBox 
        totalCount={totalCount}
        pageCount={pageCount}
        queryString={queryString}
        onTotalChange={(myNumber) => {setPageCount(myNumber)}}
        onQueryChange={(myString) => {setQueryString(myString)}}
      />
      { repoList && (
        <ul className="list-group list-group-flush">
          { 
            repoList.map(repo => (
              <RepoInfo key={repo.node.id} repo={repo.node}></RepoInfo>
            ))
          }
        </ul>
      )
      }
      <NavButtons start={startCursor} end={endCursor} next={hasNextPage} previous={hasPreviousPage} onPage={(myKeyword, myString) => { 
        setPaginationKeyword(myKeyword)
        setPaginationString(myString)
      }} />

    </div>
  );
}

export default App;
