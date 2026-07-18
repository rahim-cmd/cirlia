export const normalizeCircle = (circle = {}) => ({
  id:
    circle.circle_id ||
    circle.circleId ||
    circle.id ||
    circle._id ||
    circle.circle_event_id ||
    circle.circleEventId ||
    circle.event_id ||
    circle.eventId ||
    null,
  title: circle.title || circle.name || "Untitled circle",
  description: circle.description || "",
  meeting_date: circle.meeting_date || circle.date || "",
  start_time: circle.start_time || circle.startTime || "",
  end_time: circle.end_time || circle.endTime || "",
  max_members: Number(circle.max_members || circle.maxMembers || circle.capacity || circle.total_seats || circle.totalSeats || 0),
  booked_members: Number(
    circle.booked_members ||
      circle.bookedMembers ||
      circle.current_members ||
      circle.currentMembers ||
      circle.booked_count ||
      circle.bookedCount ||
      circle.approved_members ||
      circle.approvedMembers ||
      0
  ),
  host_name: circle.host_name || circle.hostName || circle.host?.name || "Circlia host",
  zoom_link:
    circle.zoom_link ||
    circle.zoomLink ||
    circle.meeting_link ||
    circle.meetingLink ||
    circle.join_url ||
    circle.joinUrl ||
    circle.zoom_join_url ||
    circle.zoomJoinUrl ||
    null,
  zoom_start_url:
    circle.zoom_start_url ||
    circle.zoomStartUrl ||
    circle.start_url ||
    circle.startUrl ||
    circle.host_url ||
    circle.hostUrl ||
    null,
  zoom_meeting_id: circle.zoom_meeting_id || circle.zoomMeetingId || circle.meeting_id || circle.meetingId || null,
  zoom_start_time: circle.zoom_start_time || circle.zoomStartTime || null,
  zoom_duration: Number(circle.zoom_duration || circle.zoomDuration || 0),
  zoom_updated_at: circle.zoom_updated_at || circle.zoomUpdatedAt || null,
  status: String(circle.status || "active").toLowerCase(),
});

export const normalizeUserRecord = (user = {}) => ({
  id: user.id || user.user_id || user._id,
  first_name: user.first_name || user.firstName || "",
  last_name: user.last_name || user.lastName || "",
  email: user.email || "",
  phone: user.phone || user.mobile || "",
  role: String(user.role || user.user_role || "user").toLowerCase(),
});

export const normalizeBooking = (booking = {}) => {
  const parseBooleanFlag = (value, trueValues = [], falseValues = []) => {
    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "number") {
      return value > 0;
    }

    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();

      if (["yes", "true", "1", "enabled", "enable", "active", "allowed", ...trueValues].includes(normalized)) {
        return true;
      }

      if (["no", "false", "0", "disabled", "disable", "inactive", "blocked", ...falseValues].includes(normalized)) {
        return false;
      }
    }

    return null;
  };

  const user = booking.user || booking.member || {};
  const circle =
    booking.circle ||
    booking.circle_event ||
    booking.circle_events ||
    booking.event ||
    booking.circleEvent ||
    booking.circleEvents ||
    {};

  const resolvedCircleTitle =
    booking.circle_title ||
    booking.title ||
    circle.title ||
    circle.circle_title ||
    booking.circle_event?.title ||
    booking.circle_events?.title ||
    booking.circleEvent?.title ||
    booking.circleEvents?.title ||
    (Array.isArray(booking.circle_events) ? booking.circle_events[0]?.title : null) ||
    (Array.isArray(booking.circleEvents) ? booking.circleEvents[0]?.title : null) ||
    "Untitled circle";

  const resolvedZoomLink =
    booking.zoom_link ||
    booking.zoomLink ||
    booking.meeting_link ||
    booking.meetingLink ||
    booking.join_url ||
    booking.joinUrl ||
    booking.zoom_join_url ||
    booking.zoomJoinUrl ||
    booking.zoom?.join_url ||
    booking.zoom?.joinUrl ||
    circle.zoom_link ||
    circle.zoomLink ||
    circle.meeting_link ||
    circle.meetingLink ||
    circle.join_url ||
    circle.joinUrl ||
    circle.zoom_join_url ||
    circle.zoomJoinUrl ||
    booking.circle_event?.zoom_link ||
    booking.circle_event?.meeting_link ||
    booking.circle_event?.join_url ||
    booking.circle_events?.zoom_link ||
    booking.circle_events?.meeting_link ||
    booking.circle_events?.join_url ||
    booking.circleEvent?.zoom_link ||
    booking.circleEvent?.meeting_link ||
    booking.circleEvent?.join_url ||
    booking.circleEvents?.zoom_link ||
    booking.circleEvents?.meeting_link ||
    booking.circleEvents?.join_url ||
    (Array.isArray(booking.circle_events)
      ? booking.circle_events[0]?.zoom_link || booking.circle_events[0]?.meeting_link || booking.circle_events[0]?.join_url
      : null) ||
    (Array.isArray(booking.circleEvents)
      ? booking.circleEvents[0]?.zoom_link || booking.circleEvents[0]?.meeting_link || booking.circleEvents[0]?.join_url
      : null) ||
    null;

  const rawZoomStatus =
    booking.zoom_status ||
    booking.zoomStatus ||
    booking.zoom_lifecycle_status ||
    booking.zoomLifecycleStatus ||
    booking.zoom_state ||
    booking.zoomState ||
    booking.meeting_status ||
    booking.meetingStatus ||
    booking.zoom?.status ||
    booking.zoom_snapshot_status ||
    booking.zoomSnapshotStatus ||
    "";

  const resolvedZoomMessage =
    booking.zoom_message || booking.zoomMessage || booking.zoom?.message || booking.notes || booking.reason || booking.admin_reason || "";

  const resolvedZoomPassword =
    booking.zoom_password ||
    booking.zoomPassword ||
    booking.zoom_passcode ||
    booking.zoomPasscode ||
    booking.zoom?.password ||
    booking.zoom?.passcode ||
    null;

  const resolvedZoomMeetingId =
    booking.zoom_meeting_id || booking.zoomMeetingId || booking.zoom?.meeting_id || booking.zoom?.meetingId || null;

  const resolvedBookingStatus = String(booking.booking_status || booking.status || "pending").toLowerCase();

  const resolvedZoomStatus = String(
    rawZoomStatus || (resolvedBookingStatus === "approved" && resolvedZoomLink ? "active" : "pending")
  ).toLowerCase();

  const resolvedSnapshotSynced =
    parseBooleanFlag(
      booking.zoom_snapshot_synced ??
        booking.zoomSnapshotSynced ??
        booking.snapshot_synced ??
        booking.snapshotSynced ??
        booking.zoom_sync_status ??
        booking.zoomSyncStatus ??
        booking.sync_status ??
        booking.syncStatus ??
        booking.zoom?.snapshot_synced ??
        booking.zoom?.snapshotSynced ??
        booking.zoom?.sync_status ??
        booking.zoom?.syncStatus,
      ["synced", "available"],
      ["unsynced", "missing", "pending"]
    ) ??
    null;

  const resolvedJoinEnabled =
    parseBooleanFlag(
      booking.join_enabled ??
        booking.joinEnabled ??
        booking.is_join_enabled ??
        booking.isJoinEnabled ??
        booking.join?.enabled ??
        booking.join?.is_enabled ??
        booking.join?.isEnabled
    ) ?? null;

  const resolvedCanJoin =
    parseBooleanFlag(
      booking.can_join ??
        booking.canJoin ??
        booking.join_available ??
        booking.joinAvailable ??
        booking.join?.can_join ??
        booking.join?.canJoin ??
        booking.join?.available
    ) ?? null;

  const resolvedJoinMessage =
    booking.join_message || booking.joinMessage || booking.join?.message || booking.zoom_message || booking.zoomMessage || "";

  const resolvedJoinLockReason =
    booking.join_lock_reason || booking.joinLockReason || booking.lock_reason || booking.lockReason || booking.join?.lock_reason || booking.join?.lockReason || "";

  const resolvedJoinLockedAt =
    booking.join_locked_at || booking.joinLockedAt || booking.locked_at || booking.lockedAt || booking.join?.locked_at || booking.join?.lockedAt || null;

  const resolvedSnapshotUpdatedAt =
    booking.snapshot_updated_at ||
    booking.snapshotUpdatedAt ||
    booking.zoom_snapshot_updated_at ||
    booking.zoomSnapshotUpdatedAt ||
    booking.zoom_synced_at ||
    booking.zoomSyncedAt ||
    booking.synced_at ||
    booking.syncedAt ||
    booking.zoom?.snapshot_updated_at ||
    booking.zoom?.snapshotUpdatedAt ||
    booking.zoom?.synced_at ||
    booking.zoom?.syncedAt ||
    null;

  return {
    id: booking.id || booking.booking_id || booking._id,
    user_id: booking.user_id || user.id || user.user_id,
    circle_id:
      booking.circle_id ||
      booking.circleId ||
      booking.circle_event_id ||
      booking.circleEventId ||
      circle.circle_id ||
      circle.circleId ||
      circle.id ||
      circle._id ||
      circle.circle_event_id ||
      circle.circleEventId ||
      null,
    status: resolvedBookingStatus,
    booking_status: resolvedBookingStatus,
    reason: booking.reason || booking.admin_reason || "",
    notes: booking.notes || "",
    approved_at: booking.approved_at || booking.approvedAt || "",
    zoom_link: resolvedZoomLink,
    zoom_status: resolvedZoomStatus,
    zoom_message: resolvedZoomMessage,
    zoom_password: resolvedZoomPassword,
    zoom_meeting_id: resolvedZoomMeetingId,
    zoom_start_time: booking.zoom_start_time || booking.zoomStartTime || booking.zoom?.start_time || booking.zoom?.startTime || null,
    zoom_duration: Number(booking.zoom_duration || booking.zoomDuration || booking.zoom?.duration || 0),
    zoom_updated_at: booking.zoom_updated_at || booking.zoomUpdatedAt || booking.zoom?.updated_at || booking.zoom?.updatedAt || null,
    zoom_snapshot_synced: resolvedSnapshotSynced,
    zoom_snapshot_updated_at: resolvedSnapshotUpdatedAt,
    join_enabled: resolvedJoinEnabled,
    can_join: resolvedCanJoin,
    join_message: resolvedJoinMessage,
    join_lock_reason: resolvedJoinLockReason,
    join_locked_at: resolvedJoinLockedAt,
    created_at: booking.created_at || booking.createdAt || "",
    meeting_date: booking.meeting_date || circle.meeting_date || "",
    start_time: booking.start_time || circle.start_time || "",
    end_time: booking.end_time || circle.end_time || "",
    circle_title: resolvedCircleTitle,
    user_name:
      booking.user_name ||
      [user.first_name || user.firstName || "", user.last_name || user.lastName || ""].join(" ").trim() ||
      user.name ||
      "Member",
    email: booking.email || user.email || "",
  };
};