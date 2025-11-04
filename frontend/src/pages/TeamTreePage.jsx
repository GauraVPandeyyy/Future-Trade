// TeamTreePage.jsx
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext"; // adjust path
import { getTeam } from "../services/api"; // adjust path
import TeamTree from "./TeamTree";

export default function TeamTreePage() {
  const { user } = useAuthContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return; // not logged in
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getTeam(user.user_id); // use logged-in user id
        setData(res);
      } catch (err) {
        console.error("Failed to fetch team tree", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (!user) {
    return (
      <div className="p-4 text-center text-slate-600">
        Please login to see your team tree.
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">
        Team Tree of {user.name}
      </h2>
      <TeamTree data={data} loading={loading} />
    </div>
  );
}
