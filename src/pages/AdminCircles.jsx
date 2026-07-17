import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Eye, Link2Off, Pencil, PlusCircle, RefreshCcw, Trash2 } from "lucide-react";
import AdminShell from "../components/admin/AdminShell";
import DataTable from "../components/ui/DataTable";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Modal from "../components/ui/Modal";
import StatusBadge from "../components/ui/StatusBadge";
import { ErrorState, LoadingState } from "../components/ui/LoadingState";
import { API_ENDPOINTS } from "../config/api";
import { useToast } from "../context/ToastContext";
import { apiClient } from "../lib/apiClient";
import { extractItem, extractList, formatApiError, getFieldErrors } from "../utils/apiResponse";
import { normalizeCircle } from "../utils/entities";
import { formatDisplayDate, formatTimeRange } from "../utils/formatters";

const initialForm = {
  title: "",
  description: "",
  meeting_date: "",
  start_time: "",
  end_time: "",
  max_members: "20",
  host_name: "",
};

export default function AdminCircles() {
  const toast = useToast();
  const [circles, setCircles] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [zoomActionState, setZoomActionState] = useState({ type: null, circle: null, reason: "" });
  const [isZoomMutating, setIsZoomMutating] = useState(false);
  const [zoomPanel, setZoomPanel] = useState({
    open: false,
    circleId: null,
    circleTitle: "",
    isLoading: false,
    isResyncing: false,
    error: "",
    details: null,
    logs: [],
  });

  useEffect(() => {
    let ignore = false;

    const loadInitialCircles = async () => {
      try {
        const payload = await apiClient.get(API_ENDPOINTS.circles.adminList, { requiresAuth: true });

        if (!ignore) {
          setCircles(extractList(payload).map(normalizeCircle));
          setError("");
        }
      } catch (requestError) {
        if (!ignore) {
          setError(formatApiError(requestError, "Unable to load circles."));
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadInitialCircles();

    return () => {
      ignore = true;
    };
  }, []);

  const loadCircles = async () => {
    setIsLoading(true);
    setError("");

    try {
      const payload = await apiClient.get(API_ENDPOINTS.circles.adminList, { requiresAuth: true });
      setCircles(extractList(payload).map(normalizeCircle));
    } catch (requestError) {
      setError(formatApiError(requestError, "Unable to load circles."));
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCircles = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return circles;
    }

    return circles.filter((circle) => [circle.title, circle.description, circle.host_name].join(" ").toLowerCase().includes(query));
  }, [circles, search]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(initialForm);
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = async (circleId) => {
    setFieldErrors({});
    setIsSaving(true);

    try {
      const payload = await apiClient.get(API_ENDPOINTS.circles.adminById(circleId), { requiresAuth: true });
      const circle = normalizeCircle(extractItem(payload));
      setEditingId(circle.id);
      setForm({
        title: circle.title,
        description: circle.description,
        meeting_date: circle.meeting_date,
        start_time: circle.start_time,
        end_time: circle.end_time,
        max_members: String(circle.max_members || "20"),
        host_name: circle.host_name,
      });
      setIsModalOpen(true);
    } catch (requestError) {
      toast.error(formatApiError(requestError, "Unable to load circle details."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setFieldErrors({});

    try {
      const payload = {
        ...form,
        max_members: Number(form.max_members),
      };

      if (editingId) {
        await apiClient.put(API_ENDPOINTS.circles.adminById(editingId), payload, { requiresAuth: true });
        toast.success("Circle updated successfully.");
      } else {
        await apiClient.post(API_ENDPOINTS.circles.adminList, payload, { requiresAuth: true });
        toast.success("Circle created successfully.");
      }

      setIsModalOpen(false);
      await loadCircles();
    } catch (requestError) {
      setFieldErrors(getFieldErrors(requestError));
      toast.error(formatApiError(requestError, "Unable to save circle."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);

    try {
      await apiClient.delete(API_ENDPOINTS.circles.adminById(deleteTarget.id), { requiresAuth: true });
      toast.success("Circle deleted successfully.");
      setDeleteTarget(null);
      await loadCircles();
    } catch (requestError) {
      toast.error(formatApiError(requestError, "Unable to delete circle."));
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDateTime = (value) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const closeZoomPanel = () => {
    setZoomPanel({
      open: false,
      circleId: null,
      circleTitle: "",
      isLoading: false,
      isResyncing: false,
      error: "",
      details: null,
      logs: [],
    });
  };

  const loadZoomOverview = async (circleId, circleTitle, preserveData = false) => {
    setZoomPanel((current) => ({
      ...current,
      open: true,
      circleId,
      circleTitle,
      isLoading: true,
      error: "",
      details: preserveData ? current.details : null,
      logs: preserveData ? current.logs : [],
    }));

    try {
      const [detailsPayload, logsPayload] = await Promise.all([
        apiClient.get(API_ENDPOINTS.zoom.detailsByCircleId(circleId), { requiresAuth: true }),
        apiClient.get(API_ENDPOINTS.zoom.logsByCircleId(circleId), { requiresAuth: true }),
      ]);

      setZoomPanel((current) => ({
        ...current,
        open: true,
        circleId,
        circleTitle,
        isLoading: false,
        error: "",
        details: extractItem(detailsPayload),
        logs: extractList(logsPayload),
      }));
    } catch (requestError) {
      setZoomPanel((current) => ({
        ...current,
        isLoading: false,
        error: formatApiError(requestError, "Unable to load Zoom overview."),
      }));
    }
  };

  const openZoomDetails = async (circle) => {
    if (!circle?.id) {
      toast.error("Circle id missing. Refresh circles and try again.");
      return;
    }

    await loadZoomOverview(circle.id, circle.title);
  };

  const openRegenerateDialog = (circle) => {
    setZoomActionState({ type: "regenerate", circle, reason: "" });
  };

  const openRemoveDialog = (circle) => {
    setZoomActionState({
      type: "remove",
      circle,
      reason: "Meeting link removed temporarily due to schedule change",
    });
  };

  const closeZoomActionDialog = () => {
    setZoomActionState({ type: null, circle: null, reason: "" });
  };

  const handleRegenerateZoom = async () => {
    const circle = zoomActionState.circle;

    if (!circle || !circle.id) {
      toast.error("Circle id missing. Refresh circles and try again.");
      return;
    }

    setIsZoomMutating(true);

    try {
      await apiClient.post(API_ENDPOINTS.circles.regenerateZoom(circle.id), {}, { requiresAuth: true });
      toast.success("Zoom link regenerated successfully.");
      closeZoomActionDialog();
      await loadCircles();

      if (zoomPanel.open && zoomPanel.circleId === circle.id) {
        await loadZoomOverview(circle.id, circle.title, true);
      }
    } catch (requestError) {
      toast.error(formatApiError(requestError, "Unable to regenerate Zoom link."));
    } finally {
      setIsZoomMutating(false);
    }
  };

  const handleRemoveZoom = async () => {
    const circle = zoomActionState.circle;

    if (!circle || !circle.id) {
      toast.error("Circle id missing. Refresh circles and try again.");
      return;
    }

    setIsZoomMutating(true);

    try {
      await apiClient.request(API_ENDPOINTS.circles.removeZoom(circle.id), {
        method: "DELETE",
        requiresAuth: true,
        body: {
          reason: zoomActionState.reason || "Meeting link removed temporarily due to schedule change",
        },
      });
      toast.success("Zoom link removed successfully.");
      closeZoomActionDialog();
      await loadCircles();

      if (zoomPanel.open && zoomPanel.circleId === circle.id) {
        await loadZoomOverview(circle.id, circle.title, true);
      }
    } catch (requestError) {
      toast.error(formatApiError(requestError, "Unable to remove Zoom link."));
    } finally {
      setIsZoomMutating(false);
    }
  };

  const handleResync = async () => {
    if (!zoomPanel.circleId) {
      return;
    }

    setZoomPanel((current) => ({ ...current, isResyncing: true }));

    try {
      await apiClient.post(API_ENDPOINTS.zoom.resyncByCircleId(zoomPanel.circleId), {}, { requiresAuth: true });
      toast.success("Zoom snapshot resync completed.");
      await loadZoomOverview(zoomPanel.circleId, zoomPanel.circleTitle, true);
      await loadCircles();
    } catch (requestError) {
      toast.error(formatApiError(requestError, "Unable to resync Zoom snapshots."));
    } finally {
      setZoomPanel((current) => ({ ...current, isResyncing: false }));
    }
  };

  const zoomOverview = zoomPanel.details || {};
  const syncSummary = zoomOverview.sync_summary || zoomOverview.syncSummary || {
    approved_count: zoomOverview.approved_count || zoomOverview.approvedCount || 0,
    synced_count: zoomOverview.synced_count || zoomOverview.syncedCount || 0,
    unsynced_count: zoomOverview.unsynced_count || zoomOverview.unsyncedCount || 0,
  };
  const bookingRows =
    zoomOverview.booking_rows ||
    zoomOverview.bookingRows ||
    zoomOverview.snapshot_rows ||
    zoomOverview.snapshotRows ||
    zoomOverview.bookings ||
    [];

  const columns = [
    {
      key: "title",
      label: "Circle",
      render: (circle) => (
        <div>
          <p className="font-semibold">{circle.title}</p>
          <p className="mt-1 text-xs text-[#6b716d]">{circle.description || "No description provided."}</p>
        </div>
      ),
    },
    {
      key: "schedule",
      label: "Schedule",
      render: (circle) => (
        <div>
          <p>{formatDisplayDate(circle.meeting_date)}</p>
          <p className="text-xs text-[#6b716d]">{formatTimeRange(circle.start_time, circle.end_time)}</p>
        </div>
      ),
    },
    { key: "host_name", label: "Host" },
    {
      key: "capacity",
      label: "Capacity",
      render: (circle) => `${circle.booked_members}/${circle.max_members}`,
    },
    {
      key: "status",
      label: "Status",
      render: (circle) => <StatusBadge status={circle.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (circle) => (
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => openEditModal(circle.id)} className="inline-flex items-center gap-2 rounded-full border border-[#e5d8cc] px-3 py-2 text-xs font-semibold text-[#314131]">
            <Pencil size={14} /> Edit
          </button>
          <button
            type="button"
            onClick={() => openZoomDetails(circle)}
            className="inline-flex items-center gap-2 rounded-full border border-[#d8d7eb] px-3 py-2 text-xs font-semibold text-[#3b4271]"
          >
            <Eye size={14} /> View Zoom Details
          </button>
          <button
            type="button"
            onClick={() => openRegenerateDialog(circle)}
            disabled={isZoomMutating}
            className="inline-flex items-center gap-2 rounded-full border border-[#d4e1d5] px-3 py-2 text-xs font-semibold text-[#2a5a35] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw size={14} /> Regenerate Zoom Link
          </button>
          <button
            type="button"
            onClick={() => openRemoveDialog(circle)}
            disabled={isZoomMutating}
            className="inline-flex items-center gap-2 rounded-full border border-[#e9c3b9] px-3 py-2 text-xs font-semibold text-[#9d4327] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Link2Off size={14} /> Remove Zoom Link
          </button>
          <button type="button" onClick={() => setDeleteTarget(circle)} className="inline-flex items-center gap-2 rounded-full border border-[#e9c3b9] px-3 py-2 text-xs font-semibold text-[#9d4327]">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminShell
      title="Manage circles"
      subtitle="Create, edit, and retire live circles using the admin endpoints. Zoom links are generated by the backend when omitted."
      actions={
        <button type="button" onClick={openCreateModal} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#314131]">
          <PlusCircle size={16} /> New circle
        </button>
      }
    >
      <div className="rounded-[28px] border border-[#efe7dc] bg-white p-4">
        <div className="flex items-center gap-3 rounded-[22px] border border-[#e3d7ca] bg-[#fcf7f1] px-4 py-3">
          <CalendarDays size={18} className="text-[#8b6e63]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search circles by title, host, or description"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {isLoading ? <LoadingState label="Loading circles..." /> : null}
      {!isLoading && error ? <ErrorState message={error} onRetry={loadCircles} /> : null}
      {!isLoading && !error ? <DataTable columns={columns} rows={filteredCircles} emptyMessage="No circles found." /> : null}

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit circle" : "Create circle"}
        description="These values are sent directly to the backend admin circles endpoints."
        footer={[
          <button key="cancel" type="button" onClick={() => setIsModalOpen(false)} className="rounded-full border border-[#ded3c7] px-5 py-3 text-sm font-semibold text-[#314131]">
            Cancel
          </button>,
          <button key="save" type="submit" form="circle-form" disabled={isSaving} className="rounded-full bg-[#314131] px-5 py-3 text-sm font-semibold text-white disabled:opacity-70">
            {isSaving ? "Saving..." : editingId ? "Update circle" : "Create circle"}
          </button>,
        ]}
      >
        <form id="circle-form" onSubmit={handleSave} className="grid gap-4 md:grid-cols-2">
          {[
            ["title", "Circle title", "text"],
            ["host_name", "Host name", "text"],
            ["meeting_date", "Meeting date", "date"],
            ["start_time", "Start time", "time"],
            ["end_time", "End time", "time"],
            ["max_members", "Max members", "number"],
          ].map(([key, label, type]) => (
            <label key={key} className="block">
              <span className="mb-2 block text-sm font-semibold text-[#314131]">{label}</span>
              <input
                type={type}
                min={key === "max_members" ? "1" : undefined}
                value={form[key]}
                onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                className="w-full rounded-2xl border border-[#e3d7ca] bg-[#fcf7f1] px-4 py-3 outline-none"
                required
              />
              {fieldErrors[key] ? <p className="mt-2 text-xs text-[#a14a2a]">{fieldErrors[key]}</p> : null}
            </label>
          ))}

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-[#314131]">Description</span>
            <textarea
              rows="4"
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              className="w-full rounded-2xl border border-[#e3d7ca] bg-[#fcf7f1] px-4 py-3 outline-none"
              required
            />
            {fieldErrors.description ? <p className="mt-2 text-xs text-[#a14a2a]">{fieldErrors.description}</p> : null}
          </label>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete circle"
        description={`Delete ${deleteTarget?.title || "this circle"}? This cannot be undone.`}
        confirmLabel="Delete circle"
        confirmVariant="danger"
        isBusy={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        open={zoomActionState.type === "regenerate"}
        title="Regenerate Zoom link"
        description={`Generate a fresh Zoom link for ${zoomActionState.circle?.title || "this circle"}? Approved users will receive updated lifecycle data.`}
        confirmLabel="Regenerate"
        isBusy={isZoomMutating}
        onConfirm={handleRegenerateZoom}
        onClose={closeZoomActionDialog}
      />

      <Modal
        open={zoomActionState.type === "remove"}
        onClose={closeZoomActionDialog}
        title="Remove Zoom link"
        description={`Remove Zoom link for ${zoomActionState.circle?.title || "this circle"}. This requires a reason that will be tracked in logs.`}
        footer={[
          <button key="cancel" type="button" onClick={closeZoomActionDialog} className="rounded-full border border-[#ded3c7] px-5 py-3 text-sm font-semibold text-[#314131]">
            Cancel
          </button>,
          <button
            key="remove"
            type="button"
            disabled={isZoomMutating}
            onClick={handleRemoveZoom}
            className="rounded-full bg-[#a44d31] px-5 py-3 text-sm font-semibold text-white disabled:opacity-70"
          >
            {isZoomMutating ? "Removing..." : "Remove Zoom Link"}
          </button>,
        ]}
      >
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[#314131]">Reason</span>
          <textarea
            rows="4"
            value={zoomActionState.reason}
            onChange={(event) => setZoomActionState((current) => ({ ...current, reason: event.target.value }))}
            className="w-full rounded-2xl border border-[#e3d7ca] bg-[#fcf7f1] px-4 py-3 outline-none"
          />
        </label>
      </Modal>

      <Modal
        open={zoomPanel.open}
        onClose={closeZoomPanel}
        title={`Zoom overview: ${zoomPanel.circleTitle || "Circle"}`}
        description="Live Zoom details, sync health, booking snapshots, and audit logs for this circle."
        footer={[
          <button key="close" type="button" onClick={closeZoomPanel} className="rounded-full border border-[#ded3c7] px-5 py-3 text-sm font-semibold text-[#314131]">
            Close
          </button>,
          <button
            key="resync"
            type="button"
            disabled={zoomPanel.isResyncing || zoomPanel.isLoading}
            onClick={handleResync}
            className="rounded-full bg-[#314131] px-5 py-3 text-sm font-semibold text-white disabled:opacity-70"
          >
            {zoomPanel.isResyncing ? "Resyncing..." : "Manual Re-sync"}
          </button>,
        ]}
      >
        {zoomPanel.isLoading ? <LoadingState label="Loading Zoom details..." /> : null}
        {!zoomPanel.isLoading && zoomPanel.error ? <ErrorState message={zoomPanel.error} onRetry={() => loadZoomOverview(zoomPanel.circleId, zoomPanel.circleTitle, true)} /> : null}

        {!zoomPanel.isLoading && !zoomPanel.error ? (
          <div className="space-y-5">
            <div className="grid gap-3 rounded-[24px] bg-[#fcf7f1] p-4 text-sm text-[#314131] md:grid-cols-2">
              <p>
                <span className="font-semibold">Zoom meeting ID:</span> {zoomOverview.zoom_meeting_id || zoomOverview.meeting_id || "-"}
              </p>
              <p>
                <span className="font-semibold">Join URL:</span>{" "}
                {zoomOverview.zoom_link || zoomOverview.join_url || "-"}
              </p>
              <p>
                <span className="font-semibold">Host URL:</span>{" "}
                {zoomOverview.zoom_start_url || zoomOverview.start_url || "-"}
              </p>
              <p>
                <span className="font-semibold">Start time:</span> {zoomOverview.zoom_start_time || zoomOverview.start_time || "-"}
              </p>
              <p>
                <span className="font-semibold">Duration:</span>{" "}
                {zoomOverview.zoom_duration || zoomOverview.duration ? `${zoomOverview.zoom_duration || zoomOverview.duration} min` : "-"}
              </p>
              <p>
                <span className="font-semibold">Updated at:</span> {formatDateTime(zoomOverview.zoom_updated_at || zoomOverview.updated_at)}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[20px] border border-[#e5dccf] bg-white p-4 text-sm text-[#314131]">
                <p className="text-xs uppercase tracking-[2px] text-[#8b6e63]">Approved</p>
                <p className="mt-2 text-2xl font-semibold">{syncSummary.approved_count ?? 0}</p>
              </div>
              <div className="rounded-[20px] border border-[#c9e2d0] bg-[#edf7ef] p-4 text-sm text-[#255135]">
                <p className="text-xs uppercase tracking-[2px]">Synced</p>
                <p className="mt-2 text-2xl font-semibold">{syncSummary.synced_count ?? 0}</p>
              </div>
              <div className="rounded-[20px] border border-[#efc6b8] bg-[#fff1ed] p-4 text-sm text-[#9d4327]">
                <p className="text-xs uppercase tracking-[2px]">Unsynced</p>
                <p className="mt-2 text-2xl font-semibold">{syncSummary.unsynced_count ?? 0}</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-[#314131]">Per-booking sync status</p>
              {Array.isArray(bookingRows) && bookingRows.length ? (
                <div className="overflow-hidden rounded-[20px] border border-[#e8dfd2]">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#efe7dc] text-sm">
                      <thead className="bg-[#fcf7f1] text-left text-xs uppercase tracking-[2px] text-[#8b6e63]">
                        <tr>
                          <th className="px-3 py-3">Booking</th>
                          <th className="px-3 py-3">Member</th>
                          <th className="px-3 py-3">Email</th>
                          <th className="px-3 py-3">Booking status</th>
                          <th className="px-3 py-3">Snapshot</th>
                          <th className="px-3 py-3">Snapshot updated</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f2ebe3] text-[#314131]">
                        {bookingRows.map((row, index) => {
                          const rowStatus = String(row.booking_status || row.status || "pending").toLowerCase();
                          const snapshotPresent = Boolean(
                            row.zoom_snapshot_present ??
                              row.snapshot_present ??
                              row.zoom_snapshot_synced ??
                              row.snapshot_synced ??
                              row.zoom_meeting_id
                          );
                          const highlightUnsynced = rowStatus === "approved" && !snapshotPresent;

                          return (
                            <tr key={row.booking_id || row.id || index} className={highlightUnsynced ? "bg-[#fff1ed]" : ""}>
                              <td className="px-3 py-3">{row.booking_id || row.id || "-"}</td>
                              <td className="px-3 py-3">{row.user_name || row.name || "-"}</td>
                              <td className="px-3 py-3">{row.email || "-"}</td>
                              <td className="px-3 py-3">
                                <StatusBadge status={rowStatus} />
                              </td>
                              <td className="px-3 py-3">
                                <StatusBadge status={snapshotPresent ? "synced" : "unsynced"} />
                              </td>
                              <td className="px-3 py-3">{formatDateTime(row.snapshot_updated_at || row.zoom_snapshot_updated_at)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="rounded-[20px] border border-dashed border-[#ddcfbf] bg-[#fcf7f1] p-4 text-sm text-[#6b716d]">No booking snapshot rows available.</div>
              )}
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-[#314131]">Audit logs</p>
              {zoomPanel.logs.length ? (
                <div className="overflow-hidden rounded-[20px] border border-[#e8dfd2]">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#efe7dc] text-sm">
                      <thead className="bg-[#fcf7f1] text-left text-xs uppercase tracking-[2px] text-[#8b6e63]">
                        <tr>
                          <th className="px-3 py-3">Event</th>
                          <th className="px-3 py-3">Source</th>
                          <th className="px-3 py-3">Status</th>
                          <th className="px-3 py-3">Message</th>
                          <th className="px-3 py-3">Created at</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f2ebe3] text-[#314131]">
                        {zoomPanel.logs.map((log, index) => (
                          <tr key={log.id || log.log_id || index}>
                            <td className="px-3 py-3">{log.event_type || log.type || "-"}</td>
                            <td className="px-3 py-3">{log.event_source || log.source || "-"}</td>
                            <td className="px-3 py-3">
                              <StatusBadge status={String(log.status || "default").toLowerCase()} />
                            </td>
                            <td className="px-3 py-3">{log.message || "-"}</td>
                            <td className="px-3 py-3">{formatDateTime(log.created_at || log.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="rounded-[20px] border border-dashed border-[#ddcfbf] bg-[#fcf7f1] p-4 text-sm text-[#6b716d]">No Zoom audit logs found for this circle.</div>
              )}
            </div>
          </div>
        ) : null}
      </Modal>
    </AdminShell>
  );
}