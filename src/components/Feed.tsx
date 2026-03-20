"use client";

import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";

type PromptCardListProps = {
  data: Array<{
    _id: string;
    creator: {
      username: string;
    };
    prompt: string;
    tag: string;
  }>;
  handleTagClick: (tagName: string) => void;
};

const PromptCardList = ({ data, handleTagClick }: PromptCardListProps) => {
  return (
    <div className="mt-16 space-y-6 py-8 sm:columns-2 sm:gap-6 xl:columns-3">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleEdit={() => {}}
          handleDelete={() => {}}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {

  const [post, setPosts] = useState([]);

  // // Search states
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const fetchPosts = async () => {
    const response = await fetch("/api/prompt");
    if (!response.ok) {
      throw new Error(`Failed to fetch prompts: ${response.status}`);
    }

    const data = await response.json();

    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i");
    return post.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };

    return (
      <section className="mt-16 mx-auto w-full max-w-xl flex justify-center items-center flex-col gap-2">
        <form className="relative w-full flex justify-center items-center">
          <input
            type="text"
            placeholder="Search for a tag or a username"
            value={searchText}
            onChange={handleSearchChange}
            required
            className="search_input peershadow-lg p-6 mb-10 bg-slate-700 rounded-md hover:border-none"
            style={{
              boxShadow: "3px 4px #ff0000b5, -3px -4px #ff0000b5",
              color: "black",
            }}
          />
        </form>

        {/* All Prompts */}
        {searchText ? (
          <PromptCardList
            data={searchedResults}
            handleTagClick={handleTagClick}
          />
        ) : (
          <PromptCardList data={post} handleTagClick={handleTagClick} />
        )}
      </section>
    );
};

export default Feed;