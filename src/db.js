import token from "./token";

const github = {
    baseURL: 'https://api.github.com/graphql',
    username: 'bennyx93',
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    }
};

export default github;