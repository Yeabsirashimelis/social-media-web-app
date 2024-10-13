export async function follow(username) {
  try {
    const res = await fetch(`/api/follows/${username}`, { method: "POST" });
    if (!res.ok) throw new Error("follow action unsuccessfull");
  } catch (error) {
    console.log(error);
  }
}

export async function unFollow(username) {
  try {
    const res = await fetch(`/api/follows/${username}`, { method: "DELETE" });
    if (!res.ok) throw new Error("unfollow action unsuccessfull");
  } catch (error) {
    console.log(error);
  }
}
