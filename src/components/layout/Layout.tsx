// import { Navbar } from "@/components/ui/navbar";
// import { Outlet } from "react-router-dom";

// // interface LayoutProps {
// //   children: React.ReactNode;
// // }

// export const Layout = () => {
//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar/>
//       <main className="flex-1">
//         {/* {children} */}
//         <Outlet/>
//       </main>
//     </div>
//   );
// };
import { Outlet } from "react-router-dom";
import { Navbar } from "../ui/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

export const Layout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        {/* header/navbar can go here */}
        <Navbar />
        <main className="flex-1">
          <Outlet /> {/* 👈 This is where nested routes like Landing will render */}
        </main>
        {/* footer can go here */}
      </div>
    </SidebarProvider>
  );
};
