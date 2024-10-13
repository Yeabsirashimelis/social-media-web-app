"use client";

export async function getComments(threadId) {
  try {
    const res = await fetch(`/api/threads/comment/${threadId}`, {
      method: "GET",
    });
    if (!res.ok) throw new Error("Can't get comments for this thread");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getReplies(threadId, commentId) {
  try {
    const res = await fetch(
      `/api/threads/comment/${threadId}?commentId=${commentId}`,
      {
        method: "GET",
      }
    );
    if (!res.ok) throw new Error("Can't get replies for this comment");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function addComment(formData) {
  const threadId = formData.get("threadId");
  try {
    const res = await fetch(`/api/threads/comment/${threadId}`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("can't comment");
  } catch (error) {
    console.log(error);
  }
}
