export { default } from "next-auth/middleware";
export const config = {
  matcher: [
    "/search-users",
    "/activity",
    "/create-thread",
    "/communities",
    "/profile",
  ],
};

//the matcher will contain any routes that we want to protect
