import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import {useGetPostsQuery} from "./features/post/postsApiSlice";
import {Post} from "./types/Post";

const Header: React.FC = () => (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo"/>
      <Counter/>
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <span>
          <span>Learn </span>
          <a
              className="App-link"
              href="https://reactjs.org/"
              target="_blank"
              rel="noopener noreferrer"
          >
            React
          </a>
          <span>, </span>
          <a
              className="App-link"
              href="https://redux.js.org/"
              target="_blank"
              rel="noopener noreferrer"
          >
            Redux
          </a>
          <span>, </span>
          <a
              className="App-link"
              href="https://redux-toolkit.js.org/"
              target="_blank"
              rel="noopener noreferrer"
          >
            Redux Toolkit
          </a>
          ,<span> and </span>
          <a
              className="App-link"
              href="https://react-redux.js.org/"
              target="_blank"
              rel="noopener noreferrer"
          >
            React Redux
          </a>
        </span>
    </header>
)

const Posts: React.FC = () => {
    const {data: posts, error, isLoading} = useGetPostsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;

  return (
      <div>
        <h1>Posts</h1>
        <ul>
          {posts?.map((post: Post) => (
              <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      </div>
  )
}

function App() {
  return (
      <div className="App">
        <Header/>
        <Posts/>
      </div>
  );
}

export default App;
