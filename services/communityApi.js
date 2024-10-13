export async function getCommunitiesForYou() {
  try {
    const res = await fetch("/api/communities/for-each-person");
    if (!res.ok) return new Error("can't get communities");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getCommunity(inviteLink) {
  try {
    const res = await fetch(`/api/communities/${inviteLink}`);
    if (!res.ok) return new Error("can't get community");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function createCommunity(formData) {
  try {
    const res = await fetch(`/api/communities`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("can't create the community");
  } catch (error) {
    console.log(error);
  }
}

export async function followCommunity(inviteLink) {
  try {
    const res = await fetch(`/api/communities/${inviteLink}/follow`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("can't follow the community");
  } catch (error) {
    console.log(error);
  }
}

export async function checkIfCommunityFollowed(inviteLink) {
  try {
    const res = await fetch(`/api/communities/${inviteLink}/follow`);
    if (!res.ok)
      throw new Error("can't get the status of following the community");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getFollowers(inviteLink) {
  try {
    const res = await fetch(`/api/communities/${inviteLink}/followers`);
    if (!res.ok) throw new Error("can't get followers");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function promoteToAdmin(data) {
  const { inviteLink, formData } = data;
  try {
    const res = await fetch(
      `/api/communities/${inviteLink}/followers/promote-to-admin`,
      { method: "PUT", body: formData }
    );
    if (!res.ok) throw new Error("can't finish task");
    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
