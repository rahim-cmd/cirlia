import { useEffect, useMemo, useState } from "react";
import { Layers3, ListChecks, UserCog } from "lucide-react";
import AdminShell from "../components/admin/AdminShell";
import DataTable from "../components/ui/DataTable";
import Modal from "../components/ui/Modal";
import StatusBadge from "../components/ui/StatusBadge";
import { ErrorState, LoadingState } from "../components/ui/LoadingState";
import { API_ENDPOINTS } from "../config/api";
import { useToast } from "../context/ToastContext";
import { apiClient } from "../lib/apiClient";
import { extractItem, extractList, formatApiError } from "../utils/apiResponse";
import { normalizeBooking } from "../utils/entities";
import { formatDisplayDate, formatTimeRange } from "../utils/formatters";

const decisionTemplates = {
  approve: {
    title: "Approve booking",
    label: "Approve",
    endpoint: API_ENDPOINTS.bookings.approve,
    defaultReason: "Approved by admin",
    buttonClass: "bg-[#314131]",
  },
  reject: {
    title: "Reject booking",
    label: "Reject",
    endpoint: API_ENDPOINTS.bookings.reject,
    defaultReason: "Circle capacity policy not met",
    buttonClass: "bg-[#a44d31]",
  },
};

const getReadableApiError = (error, fallback) => {
  if (error?.status === 401) {
    return "Your admin session expired. Please sign in again.";
  }

  if (error?.status === 403) {
    return "You are not allowed to perform this admin action.";
  }

  if (error?.status >= 500) {
    return "Server error while processing this action. Please try again.";
  }

  return formatApiError(error, fallback);
};

export default function AdminBookings() {
  const toast = useToast();
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [decisionState, setDecisionState] = useState({ type: null, booking: null, reason: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [resyncingCircleId, setResyncingCircleId] = useState(null);
  const [joinControlState, setJoinControlState] = useState({ booking: null, isEnabled: true, reason: "" });
  const [isUpdatingJoinControl, setIsUpdatingJoinControl] = useState(false);
  const [joinLogsState, setJoinLogsState] = useState({ open: false, booking: null, isLoading: false, error: "", rows: [] });
  const [circleReasonMap, setCircleReasonMap] = useState({});
  const [bulkJoinState, setBulkJoinState] = useState({ open: false, circle: null, isEnabled: false, reason: "" });
  const [bulkUpdatingCircleId, setBulkUpdatingCircleId] = useState(null);

  const loadBookings = async () => {
    setIsLoading(true);
    setError("");

    try {
      const payload = await apiClient.get(API_ENDPOINTS.bookings.adminList, { requiresAuth: true });
      setBookings(extractList(payload).map(normalizeBooking));
    } catch (requestError) {
      setError(formatApiError(requestError, "Unable to load bookings."));
    } finally {
      setIsLoading(false);
    }
  };

  const loadBookingsSilently = async () => {
    try {
      const payload = await apiClient.get(API_ENDPOINTS.bookings.adminList, { requiresAuth: true });
      setBookings(extractList(payload).map(normalizeBooking));
    } catch {
      // Keep existing table state if background refresh fails.
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadInitialBookings = async () => {
      try {
        const payload = await apiClient.get(API_ENDPOINTS.bookings.adminList, { requiresAuth: true });

        if (!ignore) {
          setBookings(extractList(payload).map(normalizeBooking));
          setError("");
        }
      } catch (requestError) {
        if (!ignore) {
          setError(formatApiError(requestError, "Unable to load bookings."));
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadInitialBookings();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return bookings;
    }

    return bookings.filter((booking) => [booking.circle_title, booking.user_name, booking.email, booking.status].join(" ").toLowerCase().includes(query));
  }, [bookings, search]);

  const circlesSummary = useMemo(() => {
    const map = new Map();

    filteredBookings.forEach((booking) => {
      const circleKey = booking.circle_id || `${booking.circle_title || "untitled"}-${booking.meeting_date || "na"}-${booking.start_time || "na"}`;

      if (!map.has(circleKey)) {
        map.set(circleKey, {
          id: booking.circle_id || null,
          key: circleKey,
          title: booking.circle_title || "Untitled circle",
          meeting_date: booking.meeting_date,
          start_time: booking.start_time,
          end_time: booking.end_time,
          total: 0,
          joinEnabled: 0,
          approvedCount: 0,
          missingCircleId: !booking.circle_id,
        });
      }

      const item = map.get(circleKey);
      item.total += 1;

      if (booking.join_enabled === true) {
        item.joinEnabled += 1;
      }

      if (booking.status === "approved") {
        item.approvedCount += 1;
      }

      if (booking.circle_id) {
        item.id = booking.circle_id;
        item.missingCircleId = false;
      }
    });

    return Array.from(map.values());
  }, [filteredBookings]);

  const openDecisionModal = (type, booking) => {
    setDecisionState({
      type,
      booking,
      reason: decisionTemplates[type].defaultReason,
    });
  };

  const closeDecisionModal = () => {
    setDecisionState({ type: null, booking: null, reason: "" });
  };

  const handleDecision = async () => {
    const template = decisionTemplates[decisionState.type];

    if (!template || !decisionState.booking) {
      return;
    }

    setIsSaving(true);

    try {
      await apiClient.put(template.endpoint(decisionState.booking.id), { reason: decisionState.reason }, { requiresAuth: true });
      toast.success(`Booking ${template.label.toLowerCase()}d successfully.`);
      closeDecisionModal();
      await loadBookings();

      if (decisionState.type === "approve") {
        // Backend zoom snapshot sync can complete asynchronously right after approval.
        setTimeout(() => {
          loadBookingsSilently();
        }, 1800);
      }
    } catch (requestError) {
      toast.error(formatApiError(requestError, `Unable to ${template.label.toLowerCase()} booking.`));
    } finally {
      setIsSaving(false);
    }
  };

  const handleResync = async (booking) => {
    if (!booking.circle_id) {
      toast.error("Circle id is missing for this booking.");
      return;
    }

    setResyncingCircleId(booking.circle_id);

    try {
      await apiClient.post(API_ENDPOINTS.zoom.resyncByCircleId(booking.circle_id), {}, { requiresAuth: true });
      toast.success("Zoom snapshot resync triggered.");
      await loadBookings();
    } catch (requestError) {
      toast.error(formatApiError(requestError, "Unable to resync Zoom snapshot."));
    } finally {
      setResyncingCircleId(null);
    }
  };

  const openJoinControlModal = (booking, isEnabled) => {
    setJoinControlState({
      booking,
      isEnabled,
      reason: isEnabled ? "" : "Join access disabled by admin",
    });
  };

  const closeJoinControlModal = () => {
    setJoinControlState({ booking: null, isEnabled: true, reason: "" });
  };

  const handleJoinControlUpdate = async () => {
    if (!joinControlState.booking?.id) {
      return;
    }

    setIsUpdatingJoinControl(true);
    const targetBookingId = joinControlState.booking.id;
    const nextJoinEnabled = joinControlState.isEnabled;

    const previousBookings = bookings;
    setBookings((current) =>
      current.map((booking) =>
        booking.id === targetBookingId
          ? {
              ...booking,
              join_enabled: nextJoinEnabled,
              can_join: nextJoinEnabled,
              join_lock_reason: nextJoinEnabled ? "" : joinControlState.reason || "Join access disabled by admin",
              join_locked_at: nextJoinEnabled ? null : new Date().toISOString(),
            }
          : booking
      )
    );

    try {
      const payload = { is_enabled: joinControlState.isEnabled };

      if (!joinControlState.isEnabled) {
        payload.reason = joinControlState.reason || "Join access disabled by admin";
      }

      const response = await apiClient.put(API_ENDPOINTS.bookings.joinControl(joinControlState.booking.id), payload, { requiresAuth: true });
      const responseItem = extractItem(response);

      setBookings((current) =>
        current.map((booking) =>
          booking.id === targetBookingId
            ? {
                ...booking,
                join_enabled: responseItem?.join_enabled ?? nextJoinEnabled,
                can_join: responseItem?.join_enabled ?? nextJoinEnabled,
              }
            : booking
        )
      );

      toast.success(joinControlState.isEnabled ? "Join access enabled." : "Join access disabled.");
      closeJoinControlModal();
      await loadBookingsSilently();
    } catch (requestError) {
      setBookings(previousBookings);
      toast.error(getReadableApiError(requestError, "Unable to update join access."));
    } finally {
      setIsUpdatingJoinControl(false);
    }
  };

  const updateCircleReason = (circleId, value) => {
    setCircleReasonMap((current) => ({
      ...current,
      [circleId]: value,
    }));
  };

  const triggerBulkJoinControl = async ({ circleId, isEnabled, reason = "" }) => {
    if (!circleId) {
      return;
    }

    setBulkUpdatingCircleId(circleId);

    try {
      const payload = {
        is_enabled: isEnabled,
      };

      if (reason?.trim()) {
        payload.reason = reason.trim();
      }

      const response = await apiClient.put(API_ENDPOINTS.bookings.circleJoinControl(circleId), payload, { requiresAuth: true });
      const data = extractItem(response);
      const affectedCount = Number(data?.affected_bookings || 0);

      toast.success(
        isEnabled
          ? `Join access enabled for ${affectedCount} booking${affectedCount === 1 ? "" : "s"}.`
          : `Join access disabled for ${affectedCount} booking${affectedCount === 1 ? "" : "s"}.`
      );

      await loadBookings();
    } catch (requestError) {
      toast.error(getReadableApiError(requestError, "Unable to update circle join access."));
    } finally {
      setBulkUpdatingCircleId(null);
    }
  };

  const handleBulkEnable = async (circle) => {
    if (!circle?.id) {
      toast.error("Circle ID missing in booking data. Bulk action unavailable for this circle.");
      return;
    }

    const reason = circleReasonMap[circle.id] || "";
    await triggerBulkJoinControl({ circleId: circle.id, isEnabled: true, reason });
  };

  const openBulkDisableModal = (circle) => {
    if (!circle?.id) {
      toast.error("Circle ID missing in booking data. Bulk action unavailable for this circle.");
      return;
    }

    setBulkJoinState({
      open: true,
      circle,
      isEnabled: false,
      reason: circleReasonMap[circle.id] || "",
    });
  };

  const closeBulkDisableModal = () => {
    setBulkJoinState({ open: false, circle: null, isEnabled: false, reason: "" });
  };

  const confirmBulkDisable = async () => {
    if (!bulkJoinState.circle?.id) {
      return;
    }

    await triggerBulkJoinControl({
      circleId: bulkJoinState.circle.id,
      isEnabled: false,
      reason: bulkJoinState.reason,
    });

    closeBulkDisableModal();
  };

  const openJoinLogsModal = async (booking) => {
    if (!booking?.id) {
      return;
    }

    setJoinLogsState({ open: true, booking, isLoading: true, error: "", rows: [] });

    try {
      const payload = await apiClient.get(API_ENDPOINTS.bookings.joinLogs(booking.id), { requiresAuth: true });
      const item = extractItem(payload);
      const rows =
        (Array.isArray(item) && item) ||
        (Array.isArray(item?.logs) && item.logs) ||
        (Array.isArray(item?.rows) && item.rows) ||
        (Array.isArray(payload?.logs) && payload.logs) ||
        extractList(payload);

      setJoinLogsState({ open: true, booking, isLoading: false, error: "", rows });
    } catch (requestError) {
      setJoinLogsState({
        open: true,
        booking,
        isLoading: false,
        error: formatApiError(requestError, "Unable to load join logs."),
        rows: [],
      });
    }
  };

  const closeJoinLogsModal = () => {
    setJoinLogsState({ open: false, booking: null, isLoading: false, error: "", rows: [] });
  };

  const columns = [
    {
      key: "member",
      label: "Member",
      render: (booking) => (
        <div>
          <p className="font-semibold">{booking.user_name}</p>
          <p className="mt-1 text-xs text-[#6b716d]">{booking.email || "No email provided"}</p>
        </div>
      ),
    },
    {
      key: "circle",
      label: "Circle",
      render: (booking) => (
        <div>
          <p className="font-semibold">{booking.circle_title}</p>
          <p className="mt-1 text-xs text-[#6b716d]">{formatDisplayDate(booking.meeting_date)} | {formatTimeRange(booking.start_time, booking.end_time)}</p>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (booking) => <StatusBadge status={booking.status} />,
    },
    {
      key: "zoom_status",
      label: "Zoom lifecycle",
      render: (booking) => (
        <div className="space-y-1">
          <StatusBadge status={booking.zoom_status} />
          <p className="text-xs text-[#6b716d]">{booking.zoom_message || "-"}</p>
        </div>
      ),
    },
    {
      key: "zoom_sync",
      label: "Zoom snapshot sync",
      render: (booking) => {
        const isApproved = booking.status === "approved";
        const isSynced = booking.zoom_snapshot_synced ?? Boolean(booking.zoom_meeting_id);

        if (!isApproved) {
          return <span className="text-xs text-[#6b716d]">Snapshot applies after approval</span>;
        }

        return (
          <div className="space-y-1">
            <StatusBadge status={isSynced ? "synced" : "unsynced"} />
            <p className="text-xs text-[#6b716d]">Updated: {booking.zoom_snapshot_updated_at || "-"}</p>
          </div>
        );
      },
    },
    {
      key: "join_access",
      label: "Join access",
      render: (booking) => (
        <div className="space-y-1">
          <StatusBadge status={booking.join_enabled === true ? "enabled" : "disabled"} />
          <p className="text-xs text-[#6b716d]">can_join: {booking.can_join === true ? "yes" : "no"}</p>
          {booking.join_lock_reason ? <p className="text-xs text-[#8f3e27]">{booking.join_lock_reason}</p> : null}
          {booking.join_locked_at ? <p className="text-xs text-[#6b716d]">Locked: {formatDisplayDate(booking.join_locked_at)}</p> : null}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (booking) => (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => openDecisionModal("approve", booking)}
            disabled={booking.status === "approved"}
            className="rounded-full bg-[#314131] px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Approve
          </button>
          <button
            type="button"
            onClick={() => openDecisionModal("reject", booking)}
            disabled={booking.status === "rejected"}
            className="rounded-full bg-[#a44d31] px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => handleResync(booking)}
            disabled={booking.status !== "approved" || resyncingCircleId === booking.circle_id}
            className="rounded-full border border-[#d8d7eb] px-3 py-2 text-xs font-semibold text-[#3b4271] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resyncingCircleId === booking.circle_id ? "Resyncing..." : "Resync Zoom"}
          </button>
          {booking.status === "approved" && booking.zoom_link ? (
            <a href={booking.zoom_link} target="_blank" rel="noreferrer" className="rounded-full border border-[#d4e1d5] px-3 py-2 text-xs font-semibold text-[#2a5a35]">
              Join URL
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => openJoinControlModal(booking, true)}
            disabled={isUpdatingJoinControl}
            className="rounded-full border border-[#c9e2d0] px-3 py-2 text-xs font-semibold text-[#255135] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Enable Join
          </button>
          <button
            type="button"
            onClick={() => openJoinControlModal(booking, false)}
            disabled={isUpdatingJoinControl}
            className="rounded-full border border-[#efc6b8] px-3 py-2 text-xs font-semibold text-[#9d4327] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Disable Join
          </button>
          <button
            type="button"
            onClick={() => openJoinLogsModal(booking)}
            className="rounded-full border border-[#d8d7eb] px-3 py-2 text-xs font-semibold text-[#3b4271]"
          >
            Join Logs
          </button>
        </div>
      ),
    },
  ];

  const decisionTemplate = decisionState.type ? decisionTemplates[decisionState.type] : null;

  return (
    <AdminShell
      title="Manage bookings"
      subtitle="Review live booking requests, confirm admin decisions, and expose Zoom links only after approval."
    >
      <div className="min-w-0 rounded-[24px] border border-[#efe7dc] bg-white p-3 sm:rounded-[28px] sm:p-4">
        <div className="flex min-w-0 items-center gap-3 rounded-[20px] border border-[#e3d7ca] bg-[#fcf7f1] px-3 py-3 sm:rounded-[22px] sm:px-4">
          <ListChecks size={18} className="text-[#8b6e63]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search bookings by member, email, circle, or status"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {!isLoading && !error ? (
        <section className="grid gap-3">
          <div className="rounded-[20px] border border-[#ddcfbf] bg-[#fcf4e8] p-4 shadow-[0_10px_30px_-24px_rgba(120,72,38,0.45)]">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 rounded-full bg-[#f2deca] p-2 text-[#8f5d43]">
                <Layers3 size={16} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[2px] text-[#8b6e63]">Bulk Circle Join Controls</p>
                <p className="mt-1 text-sm text-[#5f665f]">Use one click to enable or disable join access for all users in a circle.</p>
              </div>
            </div>
          </div>

          {!circlesSummary.length ? (
            <div className="rounded-[20px] border border-dashed border-[#ddcfbf] bg-[#fcf7f1] p-4 text-sm text-[#6b716d]">
              No circle groups available for bulk controls with current filters.
            </div>
          ) : null}

          {circlesSummary.map((circle) => {
            const isBulkBusy = circle.id !== null && circle.id !== undefined && bulkUpdatingCircleId === circle.id;
            const isUnavailable = !circle.id;

            return (
              <div key={circle.key || circle.id} className="rounded-[24px] border border-[#efe7dc] bg-white p-4 sm:p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-[#314131]">{circle.title}</p>
                    <p className="text-xs text-[#6b716d]">
                      {formatDisplayDate(circle.meeting_date)} | {formatTimeRange(circle.start_time, circle.end_time)}
                    </p>
                  </div>
                  <p className="text-xs text-[#6b716d]">
                    Join enabled: {circle.joinEnabled}/{circle.total} | Approved: {circle.approvedCount}
                  </p>
                </div>

                {isUnavailable ? (
                  <div className="mt-3 rounded-2xl border border-[#f0d7ca] bg-[#fff4ef] px-3 py-2 text-xs text-[#9d4327]">
                    Bulk action unavailable: this circle record has no circle_id in booking payload.
                  </div>
                ) : null}

                <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-[2px] text-[#6b716d]">Reason (optional)</span>
                    <textarea
                      rows="2"
                      value={circleReasonMap[circle.id || circle.key] || ""}
                      onChange={(event) => updateCircleReason(circle.id || circle.key, event.target.value)}
                      className="w-full rounded-2xl border border-[#e3d7ca] bg-[#fcf7f1] px-3 py-2 text-sm outline-none"
                      placeholder="Optional note for bulk join control"
                      disabled={isUnavailable || isBulkBusy}
                    />
                  </label>

                  <button
                    type="button"
                    disabled={isUnavailable || isBulkBusy}
                    onClick={() => handleBulkEnable(circle)}
                    className="rounded-full border border-[#c9e2d0] px-4 py-2 text-sm font-semibold text-[#255135] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isBulkBusy ? "Saving..." : "Enable Join For All"}
                  </button>

                  <button
                    type="button"
                    disabled={isUnavailable || isBulkBusy}
                    onClick={() => openBulkDisableModal(circle)}
                    className="rounded-full border border-[#efc6b8] px-4 py-2 text-sm font-semibold text-[#9d4327] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isBulkBusy ? "Saving..." : "Disable Join For All"}
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      ) : null}

      {isLoading ? <LoadingState label="Loading bookings..." /> : null}
      {!isLoading && error ? <ErrorState message={error} onRetry={loadBookings} /> : null}
      {!isLoading && !error ? (
        <section className="space-y-3">
          <div className="rounded-[20px] border border-[#d6e3d6] bg-[#eff7f0] p-4 shadow-[0_10px_30px_-24px_rgba(35,78,47,0.45)]">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 rounded-full bg-[#dcebdd] p-2 text-[#35613f]">
                <UserCog size={16} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[2px] text-[#527054]">Per User Join Controls</p>
                <p className="mt-1 text-sm text-[#4f6451]">Manage join access for individual bookings from the Actions column.</p>
              </div>
            </div>
          </div>
          <DataTable columns={columns} rows={filteredBookings} emptyMessage="No bookings found." />
        </section>
      ) : null}

      <Modal
        open={Boolean(decisionTemplate)}
        onClose={closeDecisionModal}
        title={decisionTemplate?.title || "Update booking"}
        description={`Confirm the ${decisionState.type || "selected"} action for ${decisionState.booking?.user_name || "this member"}.`}
        footer={[
          <button key="cancel" type="button" onClick={closeDecisionModal} className="rounded-full border border-[#ded3c7] px-5 py-3 text-sm font-semibold text-[#314131]">
            Cancel
          </button>,
          <button
            key="confirm"
            type="button"
            disabled={isSaving}
            onClick={handleDecision}
            className={`rounded-full px-5 py-3 text-sm font-semibold text-white disabled:opacity-70 ${decisionTemplate?.buttonClass || "bg-[#314131]"}`}
          >
            {isSaving ? "Saving..." : decisionTemplate?.label || "Confirm"}
          </button>,
        ]}
      >
        <div className="space-y-4">
          <div className="rounded-[24px] bg-[#fcf7f1] p-4 text-sm text-[#314131]">
            <p className="font-semibold">{decisionState.booking?.circle_title}</p>
            <p className="mt-1 text-[#667066]">{decisionState.booking?.user_name}</p>
          </div>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#314131]">Reason</span>
            <textarea
              rows="4"
              value={decisionState.reason}
              onChange={(event) => setDecisionState((current) => ({ ...current, reason: event.target.value }))}
              className="w-full rounded-2xl border border-[#e3d7ca] bg-[#fcf7f1] px-4 py-3 outline-none"
            />
          </label>
        </div>
      </Modal>

      <Modal
        open={Boolean(joinControlState.booking)}
        onClose={closeJoinControlModal}
        title={joinControlState.isEnabled ? "Enable join access" : "Disable join access"}
        description={`Update join access for ${joinControlState.booking?.user_name || "this booking"}.`}
        footer={[
          <button key="cancel" type="button" onClick={closeJoinControlModal} className="rounded-full border border-[#ded3c7] px-5 py-3 text-sm font-semibold text-[#314131]">
            Cancel
          </button>,
          <button
            key="confirm"
            type="button"
            disabled={isUpdatingJoinControl}
            onClick={handleJoinControlUpdate}
            className={`rounded-full px-5 py-3 text-sm font-semibold text-white disabled:opacity-70 ${joinControlState.isEnabled ? "bg-[#314131]" : "bg-[#a44d31]"}`}
          >
            {isUpdatingJoinControl ? "Saving..." : joinControlState.isEnabled ? "Enable Join" : "Disable Join"}
          </button>,
        ]}
      >
        <div className="space-y-3">
          <div className="rounded-[18px] bg-[#fcf7f1] p-4 text-sm text-[#314131]">
            <p className="font-semibold">{joinControlState.booking?.circle_title}</p>
            <p className="mt-1">{joinControlState.booking?.user_name}</p>
          </div>

          {!joinControlState.isEnabled ? (
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#314131]">Reason</span>
              <textarea
                rows="4"
                value={joinControlState.reason}
                onChange={(event) => setJoinControlState((current) => ({ ...current, reason: event.target.value }))}
                className="w-full rounded-2xl border border-[#e3d7ca] bg-[#fcf7f1] px-4 py-3 outline-none"
              />
            </label>
          ) : null}
        </div>
      </Modal>

      <Modal
        open={bulkJoinState.open}
        onClose={closeBulkDisableModal}
        title="Disable join access for this circle"
        description={`This will disable join access for all bookings in ${bulkJoinState.circle?.title || "the selected circle"}.`}
        footer={[
          <button key="cancel" type="button" onClick={closeBulkDisableModal} className="rounded-full border border-[#ded3c7] px-5 py-3 text-sm font-semibold text-[#314131]">
            Cancel
          </button>,
          <button
            key="confirm"
            type="button"
            disabled={bulkUpdatingCircleId === bulkJoinState.circle?.id}
            onClick={confirmBulkDisable}
            className="rounded-full bg-[#a44d31] px-5 py-3 text-sm font-semibold text-white disabled:opacity-70"
          >
            {bulkUpdatingCircleId === bulkJoinState.circle?.id ? "Disabling..." : "Confirm Disable"}
          </button>,
        ]}
      >
        <div className="space-y-3">
          <div className="rounded-[18px] bg-[#fff3ee] p-4 text-sm text-[#8f3e27]">
            This action impacts all users in this circle at once.
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#314131]">Reason (optional)</span>
            <textarea
              rows="4"
              value={bulkJoinState.reason}
              onChange={(event) => setBulkJoinState((current) => ({ ...current, reason: event.target.value }))}
              className="w-full rounded-2xl border border-[#e3d7ca] bg-[#fcf7f1] px-4 py-3 outline-none"
              placeholder="Optional reason shown for audit logs/messages"
            />
          </label>
        </div>
      </Modal>

      <Modal
        open={joinLogsState.open}
        onClose={closeJoinLogsModal}
        title={`Join logs: ${joinLogsState.booking?.user_name || "Member"}`}
        description="Booking join activity from backend logs."
        size="lg"
      >
        {joinLogsState.isLoading ? <LoadingState label="Loading join logs..." /> : null}
        {!joinLogsState.isLoading && joinLogsState.error ? <ErrorState message={joinLogsState.error} onRetry={() => openJoinLogsModal(joinLogsState.booking)} /> : null}

        {!joinLogsState.isLoading && !joinLogsState.error ? (
          joinLogsState.rows.length ? (
            <div className="overflow-hidden rounded-[20px] border border-[#e8dfd2]">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#efe7dc] text-sm">
                  <thead className="bg-[#fcf7f1] text-left text-xs uppercase tracking-[2px] text-[#8b6e63]">
                    <tr>
                      <th className="px-3 py-3">Booking</th>
                      <th className="px-3 py-3">Event</th>
                      <th className="px-3 py-3">Source</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Message</th>
                      <th className="px-3 py-3">IP</th>
                      <th className="px-3 py-3">User agent</th>
                      <th className="px-3 py-3">Created at</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f2ebe3] text-[#314131]">
                    {joinLogsState.rows.map((log, index) => {
                      const eventType = String(log.event_type || log.type || "").toLowerCase();
                      const isJoinStarted = eventType.includes("join_start");
                      const isJoinEnded = eventType.includes("join_end");

                      return (
                        <tr key={log.id || log.log_id || index} className={isJoinStarted ? "bg-[#edf7ef]" : isJoinEnded ? "bg-[#fff1ed]" : ""}>
                          <td className="px-3 py-3">{log.booking_id || log.bookingId || "-"}</td>
                          <td className="px-3 py-3">{log.event_type || log.type || "-"}</td>
                          <td className="px-3 py-3">{log.event_source || log.source || "-"}</td>
                          <td className="px-3 py-3"><StatusBadge status={String(log.status || "default").toLowerCase()} /></td>
                          <td className="px-3 py-3">{log.message || "-"}</td>
                          <td className="px-3 py-3">{log.ip_address || log.ip || "-"}</td>
                          <td className="px-3 py-3">{log.user_agent || log.userAgent || "-"}</td>
                          <td className="px-3 py-3">{formatDisplayDate(log.created_at || log.createdAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-[20px] border border-dashed border-[#ddcfbf] bg-[#fcf7f1] p-4 text-sm text-[#6b716d]">No join logs found for this booking.</div>
          )
        ) : null}
      </Modal>
    </AdminShell>
  );
}