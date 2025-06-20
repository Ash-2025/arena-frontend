// import { middlewareTest } from "@/API"
// import { useQuery } from "@tanstack/react-query"

import DashboardPage from "@/components/custom/UserDashboard";

function Dashboard() {
  // const { data, error } = useQuery({
  //   queryKey: ['middleware-test'],
  //   queryFn: middlewareTest
  // });
  // if (error) {
  //   return <div>Error: {(error as Error).message}</div>;
  // }

  return (
    <div className="w-full h-full">
      <DashboardPage />
    </div>
  );
}

export default Dashboard