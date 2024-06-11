import { UserProfile, SignedIn, SignedOut } from "@clerk/nextjs";


const UserProfilePage = () => (
  <>
  <SignedIn>
    
  <div className="flex w-full ">
    {/* <Sidebar type="user" isAdmin={false} /> */}
    <div className="w-full flex justify-center items-center">
      <UserProfile path="/user-profile" />
    </div>
  </div>
  </SignedIn>
  {/* <SignedOut>
    <NotFound/>
  </SignedOut> */}
  </>
);

export default UserProfilePage;
