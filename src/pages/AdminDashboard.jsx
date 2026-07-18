import { useEffect, useState } from "react";
import { Activity, CalendarDays, CheckCircle2, Link as LinkIcon, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import AdminShell from "../components/admin/AdminShell";
import { ErrorState, LoadingState } from "../components/ui/LoadingState";
import StatusBadge from "../components/ui/StatusBadge";
import { API_ENDPOINTS } from "../config/api";
import { apiClient } from "../lib/apiClient";
import { extractItem, extractList, formatApiError } from "../utils/apiResponse";

export default function AdminDashboard() {
  const [overview, setOverview] = useState({ circles: 0, users: 0, pending: 0, approved: 0, zoom: "unknown" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadInitialOverview = async () => {
      try {
        const [circlesPayload, usersPayload, bookingsPayload, zoomPayload] = await Promise.all([
          apiClient.get(API_ENDPOINTS.circles.adminList, { requiresAuth: true }),
          apiClient.get(API_ENDPOINTS.users.list, { requiresAuth: true }),
          apiClient.get(API_ENDPOINTS.bookings.adminList, { requiresAuth: true }),
          apiClient.get(API_ENDPOINTS.health.zoom, { requiresAuth: true }),
        ]);

        if (ignore) {
          return;
        }

        const bookings = extractList(bookingsPayload);
        const zoomData = extractItem(zoomPayload);
        const zoomStatus = String(zoomData?.status || zoomData?.message || (zoomData?.success ? "healthy" : "unavailable")).toLowerCase();

        setOverview({
          circles: extractList(circlesPayload).length,
          users: extractList(usersPayload).length,
          pending: bookings.filter((booking) => String(booking.booking_status || booking.status || "").toLowerCase() === "pending").length,
          approved: bookings.filter((booking) => String(booking.booking_status || booking.status || "").toLowerCase() === "approved").length,
          zoom: zoomStatus,
        });
        setError("");
      } catch (requestError) {
        if (!ignore) {
          setError(formatApiError(requestError, "Unable to load admin overview."));
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadInitialOverview();

    return () => {
      ignore = true;
    };
  }, []);

  const loadOverview = async () => {
    setIsLoading(true);
    setError("");

    try {
      const [circlesPayload, usersPayload, bookingsPayload, zoomPayload] = await Promise.all([
        apiClient.get(API_ENDPOINTS.circles.adminList, { requiresAuth: true }),
        apiClient.get(API_ENDPOINTS.users.list, { requiresAuth: true }),
        apiClient.get(API_ENDPOINTS.bookings.adminList, { requiresAuth: true }),
        apiClient.get(API_ENDPOINTS.health.zoom, { requiresAuth: true }),
      ]);

      const bookings = extractList(bookingsPayload);
      const zoomData = extractItem(zoomPayload);
      const zoomStatus = String(zoomData?.status || zoomData?.message || (zoomData?.success ? "healthy" : "unavailable")).toLowerCase();

      setOverview({
        circles: extractList(circlesPayload).length,
        users: extractList(usersPayload).length,
        pending: bookings.filter((booking) => String(booking.booking_status || booking.status || "").toLowerCase() === "pending").length,
        approved: bookings.filter((booking) => String(booking.booking_status || booking.status || "").toLowerCase() === "approved").length,
        zoom: zoomStatus,
      });
    } catch (requestError) {
      setError(formatApiError(requestError, "Unable to load admin overview."));
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { label: "Circles", value: overview.circles, icon: CalendarDays },
    { label: "Users", value: overview.users, icon: Users },
    { label: "Pending bookings", value: overview.pending, icon: ShieldCheck },
    { label: "Approved bookings", value: overview.approved, icon: CheckCircle2 },
  ];

  return (
    <AdminShell title="Admin overview" subtitle="Track live platform activity and jump into the management areas that matter.">
      {isLoading ? <LoadingState label="Loading dashboard overview..." /> : null}
      {!isLoading && error ? <ErrorState message={error} onRetry={loadOverview} /> : null}

      {!isLoading && !error ? (
        <>
          <div className="grid min-w-0 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
            {statCards.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="min-w-0 rounded-[24px] border border-[#efe7dc] bg-white p-4 shadow-[0_18px_60px_-35px_rgba(0,0,0,0.25)] sm:rounded-[28px] sm:p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#6a746a]">{item.label}</p>
                    <Icon size={18} className="text-[#8b6e63]" />
                  </div>
                  <p className="mt-3 break-words text-3xl font-semibold text-[#314131] sm:mt-4 sm:text-4xl">{item.value}</p>
                </div>
              );
            })}
          </div>

          <div className="grid min-w-0 gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="min-w-0 rounded-[24px] border border-[#efe7dc] bg-white p-4 sm:rounded-[28px] sm:p-6">
              <div className="flex items-center gap-2 text-[#314131]">
                <Activity size={18} />
                <h3 className="text-lg font-semibold sm:text-xl">Operations snapshot</h3>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5f665f]">
                The backend is serving live circles, users, and booking approvals. Use the quick links to move directly into management screens.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link to="/admin/circles" className="rounded-[24px] bg-[#fcf7f1] p-4 transition hover:bg-[#f7efe6]">
                  <p className="font-semibold text-[#314131]">Open circles</p>
                  <p className="mt-2 text-sm text-[#667066]">Create, edit, and remove upcoming circles.</p>
                </Link>
                <Link to="/admin/users" className="rounded-[24px] bg-[#fcf7f1] p-4 transition hover:bg-[#f7efe6]">
                  <p className="font-semibold text-[#314131]">Open users</p>
                  <p className="mt-2 text-sm text-[#667066]">Manage member accounts and roles.</p>
                </Link>
                <Link to="/admin/bookings" className="rounded-[24px] bg-[#fcf7f1] p-4 transition hover:bg-[#f7efe6] sm:col-span-2">
                  <p className="font-semibold text-[#314131]">Open bookings</p>
                  <p className="mt-2 text-sm text-[#667066]">Approve or reject requests with confirmation modals.</p>
                </Link>
              </div>
            </div>

            <div className="min-w-0 rounded-[24px] border border-[#efe7dc] bg-white p-4 sm:rounded-[28px] sm:p-6">
              <div className="flex items-center gap-2 text-[#314131]">
                <LinkIcon size={18} />
                <h3 className="text-lg font-semibold sm:text-xl">Zoom health</h3>
              </div>
              <p className="mt-3 text-sm leading-7 text-[#5f665f]">This value comes from the backend Zoom health utility endpoint.</p>
              <div className="mt-6 rounded-[24px] bg-[#fcf7f1] p-5">
                <StatusBadge status={overview.zoom} />
                <p className="mt-3 text-sm text-[#667066]">Only approved bookings reveal their Zoom link in user and admin views.</p>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </AdminShell>
  );
}
