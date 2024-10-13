export async function likeThread(threadId, targetType = "Thread") {
  try {
    const res = await fetch(`/api/threads/like/${threadId}`, {
      method: "POST",
      body: JSON.stringify({ targetType }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Unable to like the thread");
    }
  } catch (error) {
    console.error("Error liking the thread:", error);
  }
}

export async function likeComment({ commentId, targetType }) {
  try {
    const res = await fetch(`/api/threads/like/${commentId}`, {
      method: "POST",
      body: JSON.stringify({ targetType }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Unable to like the comment");
    }
  } catch (error) {
    console.error("Error liking the comment:", error);
  }
}
