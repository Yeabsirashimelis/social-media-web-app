export async function createFullProfile(formData) {
  try {
    const res = fetch("/api/profile", { method: "PUT", body: formData });
    if (!res.ok) throw new Error("can't complete the profile creation process");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function editProfile(formData) {
  try {
    const res = fetch("/api/profile/edit", { method: "PUT", body: formData });
    if (!res.ok) throw new Error("can't edit your profile");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

//this route used to get the personal profile infos along with the threads related
export async function getProfile(username) {
  try {
    const res = await fetch(`/api/profile/${username}`);
    if (!res.ok) throw new Error("can't get your profile");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getYourReplies(username) {
  try {
    const res = await fetch(`/api/profile/${username}/replies`);
    if (!res.ok) throw new Error("can't get your replies");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
