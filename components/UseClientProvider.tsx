// "use client";

// import { useEffect, useState } from "react";
// import { getCurrentUser } from "@/lib/appwrite/GetAccount";

// export default function UserClientProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     getCurrentUser().then(setUser);
//   }, []);

//   return <>{children}</>;
//}