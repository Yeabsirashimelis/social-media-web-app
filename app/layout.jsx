import NavBar from "@/components/NavBar";
import "/assets/styles/globals.css";
import "photoswipe/dist/photoswipe.css";

import Logo from "@/components/Logo";
import AuthProvider from "@/components/AuthProvider";
import ModalProfileComplete from "@/components/ModalProfileComplete";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import { AppProvider } from "@/appContext";

export const metadata = {};

function Layout({ children }) {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <html lang="en">
          <body>
            <AppProvider>
              <ModalProfileComplete />
              <Logo />
              <div className="h-full  grid md:grid-cols-[auto_1fr] lg:grid-cols-[auto_3fr_1fr] grid-cols-1">
                <NavBar />
                {/* Main should control scrolling */}
                <main className="flex-grow h-screen overflow-y-auto bg-black px-3 ">
                  {children}
                </main>

                <div className="hidden lg:block">suggested communities</div>
              </div>
            </AppProvider>
          </body>
        </html>
      </AuthProvider>
    </ReactQueryProvider>
  );
}

export default Layout;
