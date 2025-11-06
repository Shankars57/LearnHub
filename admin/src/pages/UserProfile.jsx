import React from "react";
import { useParams } from "react-router-dom";
import { useUserData } from "../store/useUsersData";
import { useColors } from "../hooks/useColors";
import { useStore } from "../store/useStore";

const UserProfile = () => {
  const { id } = useParams();
  const { users } = useUserData();
  const { materials } = useStore();
  const colors = useColors();
  const user = users.find((item) => item._id === id);
  const userMaterials = materials.filter(
    (item) =>
      item?.user?.email === user?.email ||
      item.uploadedBy.includes(user.firstName.toLowerCase()) ||
      item.uploadedBy.includes(user.lastName.toLowerCase())
  );
  console.log(user, userMaterials);
  return (
    <div
      className={`${colors.bg}
   mt-2 
  h-screen px-8
  py-4
  `}
    >
      <h1 className={`${colors.text} font-bold text-4xl`}>User Profile</h1>
    </div>
  );
};

export default UserProfile;
