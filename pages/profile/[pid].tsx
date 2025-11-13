import { useRouter } from "next/router";
import React from "react";
import useSWR, { useSWRConfig } from "swr";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import ArticleList from "../../components/article/ArticleList";
import CustomImage from "../../components/common/CustomImage";
import ErrorMessage from "../../components/common/ErrorMessage";
import Maybe from "../../components/common/Maybe";
import EditProfileButton from "../../components/profile/EditProfileButton";
import FollowUserButton from "../../components/profile/FollowUserButton";
import ProfileTab from "../../components/profile/ProfileTab";
import UserAPI from "../../lib/api/user";
import checkLogin from "../../lib/utils/checkLogin";
import { SERVER_BASE_URL } from "../../lib/utils/constant";
import fetcher from "../../lib/utils/fetcher";
import storage from "../../lib/utils/storage";

const Profile = ({
  initialProfile,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const {
    query: { pid },
  } = router;
  const { mutate } = useSWRConfig();

  const { data: fetchedProfile, error: profileError } = useSWR(
    `${SERVER_BASE_URL}/profiles/${encodeURIComponent(String(pid))}`,
    fetcher,
    { fallbackData: initialProfile }
  );

  const { data: currentUser } = useSWR("user", storage);
  const isLoggedIn = checkLogin(currentUser);

  if (profileError) return <ErrorMessage message="Can't load profile" />;

  const { profile } = fetchedProfile || initialProfile;
  const { username, bio, image, following } = profile;

  const isUser = currentUser && username === currentUser?.username;

  const handleFollow = async () => {
    mutate(
      `${SERVER_BASE_URL}/profiles/${pid}`,
      { profile: { ...profile, following: true } },
      false
    );
    UserAPI.follow(pid);
    mutate(`${SERVER_BASE_URL}/profiles/${pid}`);
  };

  const handleUnfollow = async () => {
    mutate(
      `${SERVER_BASE_URL}/profiles/${pid}`,
      { profile: { ...profile, following: false } },
      true
    );
    UserAPI.unfollow(pid);
    mutate(`${SERVER_BASE_URL}/profiles/${pid}`);
  };

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <CustomImage
                src={image}
                alt="User's profile image"
                className="user-img"
              />
              <h4>{username}</h4>
              <p>{bio}</p>
              <EditProfileButton isUser={isUser} />
              <Maybe test={isLoggedIn}>
                <FollowUserButton
                  isUser={isUser}
                  username={username}
                  following={following}
                  follow={handleFollow}
                  unfollow={handleUnfollow}
                />
              </Maybe>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ProfileTab profile={profile} />
            </div>
            <ArticleList />
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const pid = params?.pid;
  const { data: initialProfile } = await UserAPI.get(pid as string);
  return { props: { initialProfile } };
};

export default Profile;
