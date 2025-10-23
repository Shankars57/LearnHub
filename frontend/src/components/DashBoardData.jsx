import React from "react";
import { useAuthStore } from "../../store/useAuthStore";

const DashBoardData = () => {
  const { user } = useAuthStore();
  return (
    <div>
      <h1>{user.firstName}</h1>
    </div>
  );
};

export default DashBoardData;
