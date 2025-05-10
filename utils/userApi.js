import instance from "./axios"; 

export const getMyProfile = async () => {
  try {
    const response = await instance.get(`/api/v1/users/me`);
    return response.data.user;
  } catch (error) {
    console.error("Error fetching my profile:", error);
    throw error;
  }
};

export const getProfile = async (userId) => {
  try {
    const response = await instance.get(`/api/v1/users/${userId}`);
    return response.data.user;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const updateProfile = async (updateData) => {
  try {
    const response = await instance.patch(`/api/v1/users/me`, updateData);
    return response.data.user;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
