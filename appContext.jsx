"use client";
import { createContext, useContext, useState } from "react";

const AppContext = createContext();

function AppProvider({ children }) {
  const [communityFormOpened, setCommunityFormOpened] = useState(false);
  const [contentOfCommunity, setContentOfCommunity] = useState("");
  const [communityInfoOpened, setCommunityInfoOpened] = useState(false);
  const [communityInfoCurrentTab, setCommunityInfoCurrentTab] =
    useState("followers");

  console.log(communityInfoCurrentTab);

  function openCommunityForm() {
    setCommunityFormOpened(true);
    console.log("clicked");
  }
  function closeCommunityForm() {
    setCommunityFormOpened(false);
  }

  return (
    <AppContext.Provider
      value={{
        communityFormOpened,
        openCommunityForm,
        closeCommunityForm,
        contentOfCommunity,
        setContentOfCommunity,
        communityInfoOpened,
        setCommunityInfoOpened,
        communityInfoCurrentTab,
        setCommunityInfoCurrentTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

function useApp() {
  const context = useContext(AppContext);
  if (context === undefined)
    throw new Error("App context should be used in AppProvider");

  return context;
}

export { AppProvider, useApp };
