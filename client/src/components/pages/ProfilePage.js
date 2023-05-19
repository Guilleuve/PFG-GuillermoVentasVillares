import { Container, Stack } from "@mui/material";
import ProfileCard from "components/cards/ProfileCard";
import SidebarProfile from "components/sidebar/SidebarProfile";
import PostsWidget from "components/views/PostsView";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUser, updateUser } from "../../api/users";
import { isLoggedIn } from "../../helpers/authHelper";
import ErrorAlert from "../_more_components/ErrorAlert";
import GridLayout from "../_more_components/GridLayout";
import Loading from "../_more_components/Loading";
import ProfileTabs from "../cards/ProfileTabs";
import Navbar from "./Navbar";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState("posts");
  const user = isLoggedIn();
  const [error, setError] = useState("");
  const params = useParams();
  const navigate = useNavigate();

  const fetchUser = async () => {
    setLoading(true);
    const data = await getUser(params);
    setLoading(false);
    if (data.error) {
      setError(data.error);
    } else {
      setProfile(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const content = e.target.content.value;

    await updateUser(user, { biography: content });

    setProfile({ ...profile, user: { ...profile.user, biography: content } });
    setEditing(false);
  };

  const handleEditing = () => {
    setEditing(!editing);
  };

  const handleMessage = () => {
    navigate("/messenger", { state: { user: profile.user } });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const validate = (content) => {
    let error = "";

    if (content.length > 250) {
      error = "La biografía tiene un máximo de 250 caracteres";
    }

    return error;
  };

  let tabs;
  if (profile) {
    tabs = {
      posts: (
        <PostsWidget
          profileUser={profile.user}
          contentType="posts"
          key="posts"
        />
      ),
      liked: (
        <PostsWidget
          profileUser={profile.user}
          contentType="liked"
          key="liked"
        />
      )
    };
  }

  return (
    <Container>
      <Navbar />

      <GridLayout
        left={
          <>
            <Stack spacing={2}>
              {profile ? (
                <>
                <ProfileCard
                  profile={profile}
                  editing={editing}
                  handleSubmit={handleSubmit}
                  handleEditing={handleEditing}
                  handleMessage={handleMessage}
                  validate={validate}
                />
                <ProfileTabs tab={tab} setTab={setTab} />
                {tabs[tab]}
                </>
              ) : (
                <Loading />
              )}
              {error && <ErrorAlert error={error} />}
            </Stack>
          </>
        }
        right={
          <Stack spacing={2}>
            <SidebarProfile
            profile={profile}
            />
          </Stack>
        }
      />
    </Container>
  );
};

export default ProfilePage;
