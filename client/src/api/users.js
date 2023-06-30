import { BASE_URL } from "../config";

const register = async (user) => {
  try {
    const res = await fetch(BASE_URL + "api/users/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const login = async (user) => {
  try {
    const res = await fetch(BASE_URL + "api/users/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const sendPass = async (email) => {
  try {
    const res = await fetch(BASE_URL + "api/users/sendPass", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const resetPass = async (userId, password) => {
  try {
    const res = await fetch(BASE_URL + "api/users/reset-password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ userId, password })
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const getUser = async (params) => {
  try {
    const res = await fetch(BASE_URL + "api/users/" + params.id);
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const getRandomUsers = async (query) => {
  try {
    const res = await fetch(
      BASE_URL + "api/users/random?" + new URLSearchParams(query)
    );
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const updateUser = async (userId, biography, location, experto, intermedio, principiante) => {
  try {
    const res = await fetch(BASE_URL + "api/users/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ userId, biography, location, experto, intermedio, principiante })
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const deleteUser = async (userId) => {
  try {
    const res = await fetch(BASE_URL + "api/users/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ userId })
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const follow = async (followerId, followedId) => { 
  try {
    const res = await fetch(BASE_URL + "api/users/follow/" + followedId, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followerId: followerId,
        followedId: followedId,
      }),
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const unfollow = async (followerId, followedId) => { 
  try {
    const res = await fetch(BASE_URL + "api/users/unfollow/" + followedId, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followerId: followerId,
        followedId: followedId,
      }),
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};


const getFollowers = async ( userId , query) => {
  try {
    const res = await fetch(
      BASE_URL +
        "api/users/followers/" +
        userId +
        "?" +
        new URLSearchParams(query),
    );
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const getFollowing = async ( userId , query) => {
  try {
    const res = await fetch(
      BASE_URL +
        "api/users/following/" +
        userId +
        "?" +
        new URLSearchParams(query),
    );
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const isFollowing = async (followerId, followedId) => {
  try {
    const res = await fetch(
      BASE_URL + "api/users/isfollowing",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followerId, followedId }),
      }
    );
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

export { register, login, sendPass, resetPass, getUser, getRandomUsers, updateUser, deleteUser, follow, unfollow, getFollowers, getFollowing, isFollowing };
