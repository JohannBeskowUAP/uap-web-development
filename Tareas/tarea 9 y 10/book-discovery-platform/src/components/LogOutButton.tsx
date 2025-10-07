"use client";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        // redirect to login page after logout
        window.location.href = "/login";
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      type="button" // important: type="button" so it doesn't submit a form
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded"
    >
      Logout
    </button>
  );
}
