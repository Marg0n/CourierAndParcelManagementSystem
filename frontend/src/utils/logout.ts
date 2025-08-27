/*
export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  // Or use localStorage.clear() for removing everything
  window.location.href = "/login"; //? Hard redirect to login
};
*/

export const logout = (navigate: (path: string) => void) => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  navigate("/login");
};
