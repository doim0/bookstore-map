import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { onAuthChange, logOut } from "../services/authService";
import { useState, useEffect } from "react";
import type { User } from "../types";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "ko" ? "en" : "ko";
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <Link
            to="/"
            className="text-xl font-bold hover:text-blue-200 transition"
          >
            {t("home.title")}
          </Link>

          {/* 네비게이션 링크 */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="hover:text-blue-200 transition px-3 py-2 rounded-md hover:bg-blue-700"
            >
              {t("nav.home")}
            </Link>

            {user ? (
              <>
                <Link
                  to="/add"
                  className="hover:text-blue-200 transition px-3 py-2 rounded-md hover:bg-blue-700"
                >
                  {t("nav.addBookstore")}
                </Link>
                <Link
                  to="/mypage"
                  className="hover:text-blue-200 transition px-3 py-2 rounded-md hover:bg-blue-700"
                >
                  {t("nav.myPage")}
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-blue-200 transition px-3 py-2 rounded-md hover:bg-blue-700"
                >
                  {t("nav.logout")}
                </button>
                <span className="text-sm text-blue-200">{user.email}</span>
              </>
            ) : (
              <Link
                to="/login"
                className="hover:text-blue-200 transition px-3 py-2 rounded-md hover:bg-blue-700"
              >
                {t("nav.login")}
              </Link>
            )}

            {/* 언어 전환 버튼 */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-2 rounded-md bg-blue-700 hover:bg-blue-800 transition text-sm font-medium"
            >
              {i18n.language === "ko" ? "EN" : "KO"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
