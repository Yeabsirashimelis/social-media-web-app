"use client";

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

export async function removeCommunity(inviteLink) {
  try {
    const res = await fetch(`/api/communities/${inviteLink}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("can't delete the community");
  } catch (error) {
    console.log(error);
  }
}

export async function editCommunityInfo({ formData, inviteLink }) {
  try {
    const res = await fetch(`/api/communities/${inviteLink}`, {
      method: "PUT",
      body: formData,
    });
    if (!res.ok) throw new Error("can't edit the community info");
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
    if (!res.ok) throw new Error("can't promote follower to admin");
    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function removeFollower(data) {
  const { inviteLink, follower: followerId } = data;

  console.log("data: ", inviteLink, followerId);
  try {
    const res = await fetch(
      `/api/communities/${inviteLink}/followers/${followerId}`,
      { method: "DELETE" }
    );
    if (!res.ok) throw new Error("can't remove follower");
    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getMedias(inviteLink) {
  try {
    const res = await fetch(`/api/communities/${inviteLink}/medias`);
    if (!res.ok) throw new Error("can't get medias");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getMusics(inviteLink) {
  try {
    const res = await fetch(`/api/communities/${inviteLink}/musics`);
    if (!res.ok) throw new Error("can't get medias");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
