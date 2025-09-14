import type { TUser } from "@/utils/types";

const ProfileHeader = ({ data }: { data: TUser }) => {
  return (
    <div className="justify-center flex items-center gap-2 relative w-full h-60 z-1">
      <img
        src="https://i.ibb.co.com/G2xCfZf/interior-design-mountain-view.jpg"
        alt={`${data?.data?.name} cover`}
        className="w-full h-full object-center"
      />
      <img
        src={
          data?.data?.image ||
          "https://i.ibb.co.com/Fz38g1t/human-celebrating.png"
        }
        alt={`${data?.data?.name} image`}
        className="rounded-full w-32 h-32 absolute left-1/2 transform -translate-x-1/2 -bottom-10 border-4 border-white shadow-md"
      />
    </div>
  );
};

export default ProfileHeader;