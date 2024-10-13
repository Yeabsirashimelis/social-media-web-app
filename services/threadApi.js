export async function getThreads() {
  try {
    const res = await fetch("/api/threads");
    if (!res.ok) throw new Error("can't get threads");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getThreadById(threadId) {
  try {
    const res = await fetch(`/api/threads/${threadId}`);
    if (!res.ok) throw new Error("can't get the thread");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function createThread(formData) {
  try {
    const res = await fetch("/api/threads", { method: "POST", body: formData });
    if (!res.ok) throw new Error("can't start a thread");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
