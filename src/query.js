const githubQuery = (pageCount, queryString, paginationKeyword, paginationString) => {
  return {
    query: `
    {
        viewer {
          name
        }
        search(query: "${queryString} user:bennyx93 sort:updated-desc", type: REPOSITORY, ${paginationKeyword}: ${pageCount}, ${paginationString}) {
          edges {
            cursor
            node {
              ... on Repository {
                name
                description
                id
                url
                viewerSubscription
                licenseInfo {
                    spdxId
                }
              }
            }
          }
          pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
          }
          repositoryCount
        }
    }
    `,
  };
};

export default githubQuery;