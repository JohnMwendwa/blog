import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styled from "styled-components";
import AllPosts from "../../posts/AllPosts";

const Wrapper = styled.div`
  margin: 0 auto;
  position: relative;

  & > h2 {
    text-align: center;
  }

  & > div {
    width: calc(100vw - 230px);
  }
`;

export const Btn = styled.button`
  display: block;
  margin: 20px auto;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  background-color: ${(c) => c.theme.colors.ui.secondary};
  color: white;
  outline: 1px solid ${(c) => c.theme.colors.ui.secondary};
  font-size: 1.25rem;

  & span {
    font-weight: bold;
    padding: 3px;
  }
`;

const Error = styled.div`
  margin-bottom: 10px;
  text-align: center;
  color: red;
  font-weight: 700;
`;

export default function Articles({ posts: data }) {
  const [posts, setPosts] = useState(data);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Clear error state after 5 seconds
  useEffect(() => {
    let timeout;

    if (error) {
      timeout = setTimeout(() => {
        setError(null);
      }, 5000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  const onEditPost = (slug) => {
    router.push(`/admin/articles/edit/${slug}`);
  };
  const onDeletePost = async (postId) => {
    const res = await fetch("/api/posts/delete-post", {
      method: "DELETE",
      body: JSON.stringify({ postId }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }

    if (res.ok) {
      router.reload();
    }
  };

  return (
    <Wrapper>
      <Link href="/admin/articles/new">
        <a>
          <Btn>
            <span>+</span> Create New
          </Btn>
        </a>
      </Link>

      <h2>My Articles</h2>

      {error && <Error>{error}</Error>}

      <AllPosts
        posts={posts}
        isEdit
        onDeletePost={onDeletePost}
        onEditPost={onEditPost}
      />
    </Wrapper>
  );
}
