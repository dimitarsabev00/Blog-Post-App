import styled from "@emotion/styled";
import { Box, Button, Container, Typography } from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../configs/firebase";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import DeleteDocIcon from "../components/DeleteDocIcon";
import EditDocIcon from "../components/EditDocIcon";
import Loading from "../components/Loading";
import { useAppContext } from "../contexts/AppContext";
const PostDetailPage = () => {
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [updateMode, setUpdateMode] = useState(false);

  const { postId } = useParams();
  const { setPostList, user, isLoading, setIsLoading } = useAppContext();

  const getPost = async () => {
    setIsLoading(true);
    const docRef = doc(db, "posts", postId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setPost(docSnap.data());
      setIsLoading(false);
    }
    setTitle(post.title);
    setDesc(post.description);
  };
  useEffect(() => {
    getPost();
  }, [postId]);

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, "posts", postId);
      await updateDoc(docRef, { title: title, description: desc });
      setUpdateMode(false);
      setPost((oldValue) => {
        return {
          ...oldValue,
          title: title,
          description: desc,
        };
      });
    } catch (error) {
      console.error(error);
    }
  };

  const HeaderPost = styled(Box)({
    marginTop: "1rem",
    display: "flex",
    justifyContent: "center",
  });
  const ActionIcons = styled(Box)({
    display: "flex",
    gap: "1rem",
    cursor: "pointer",
    justifyContent: "flex-end",
    marginTop: "1rem",
  });
  const Title = styled(Typography)({
    margin: "10px",
    fontSize: "30px",
  });
  const PostInfo = styled(Box)({
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
    fontSize: "17px",
  });
  const DescriptionPost = styled(Typography)({
    color: "#666",
    fontSize: "18px",
    lineHeight: "25px",
  });
  const UpdateButton = styled(Button)({
    width: "200px",
    padding: "5px",
    marginTop: "20px",
    borderRadius: "5px",
    cursor: "pointer",
    alignSelf: "flex-end",
  });
  if (isLoading) {
    return <Loading />;
  }
  return (
    <Container
      maxWidth="lg"
      sx={{ marginTop: "2rem", display: "flex", flexDirection: "column" }}
    >
      <img
        src={post?.imageUrl}
        style={{
          width: "100%",
          height: "35vh",
          borderRadius: "1rem",
          objectFit: "cover",
        }}
      />
      {post?.author?.id === user?.uid ? (
        <ActionIcons>
          <EditDocIcon setUpdateMode={setUpdateMode} />
          <DeleteDocIcon
            imageUrl={post?.imageUrl}
            id={postId}
            setPostList={setPostList}
          />
        </ActionIcons>
      ) : null}

      {updateMode ? (
        <input
          type="text"
          placeholder={post?.title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      ) : (
        <HeaderPost>
          <Title>{post?.title}</Title>
        </HeaderPost>
      )}

      <PostInfo>
        <Typography>{`${post?.author?.name} · ${post?.createdAt} · 5 min read`}</Typography>
      </PostInfo>
      {updateMode ? (
        <textarea
          placeholder={post?.description}
          onChange={(e) => {
            setDesc(e.target.value);
          }}
        />
      ) : (
        <DescriptionPost>{post?.description}</DescriptionPost>
      )}
      {updateMode ? (
        <UpdateButton variant="contained" onClick={handleUpdate}>
          Update Post
        </UpdateButton>
      ) : null}
    </Container>
  );
};

export default PostDetailPage;
