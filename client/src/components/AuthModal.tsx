"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type AuthModalProps = {
  showModal: boolean;
  toggleModal: () => void;
};

export default function AuthModal({ showModal, toggleModal }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const switchForm = () => setIsLogin(!isLogin);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData);

    try {
      const endpoint = isLogin
        ? "http://localhost:4000/auth/login"
        : "http://localhost:4000/auth/register";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed request");
      }

      const data = await res.json();
      console.log("✅ Success:", data);

      localStorage.setItem("token", data.token);
      // sessionStorage.setItem("userId",data._id)

      if (isLogin) {
        router.push("/admin");
      } else {
        setIsLogin(true);
      }

      toggleModal();
    } catch (err: any) {
      console.error("❌ API Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-gray-500 opacity-75"
        onClick={toggleModal}
      ></div>

      {/* Modal content */}
      <div className="relative z-50 bg-white rounded-lg shadow-xl sm:max-w-sm w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
          {isLogin ? "Login to your account" : "Create a new account"}
        </h3>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 text-left">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">
              Email address
            </label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 text-left">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Sign in"
              : "Create Account"}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600 text-center">
          {isLogin ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                onClick={switchForm}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={switchForm}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
