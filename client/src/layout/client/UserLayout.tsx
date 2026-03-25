import { Outlet } from "react-router-dom";
import { UserHeader } from "./ClientHeader";
import { UserFooter } from "./ClientFooter";
import { PageMeta } from "../../shared/PageMeta";

 const UserLayout = () => {
  return (
    <div className="bg-[#07140f] min-h-screen flex flex-col">
      <PageMeta
        title="Fitora | Your Fitness Journey" 
        favicon="/favicon.svg" 
      />
      <UserHeader />

      <main className="flex-1 pt-28 px-6 md:px-12">
        <Outlet />
      </main>

      <UserFooter />

    </div>
  );
};
export default UserLayout