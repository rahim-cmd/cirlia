import { useEffect, useMemo, useState } from "react";
import { Pencil, PlusCircle, Trash2, Users } from "lucide-react";
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
import { normalizeUserRecord } from "../utils/entities";

const initialForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  role: "user",
};

export default function AdminUsers() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
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

  useEffect(() => {
    let ignore = false;

    const loadInitialUsers = async () => {
      try {
        const payload = await apiClient.get(API_ENDPOINTS.users.list, { requiresAuth: true });

        if (!ignore) {
          setUsers(extractList(payload).map(normalizeUserRecord));
          setError("");
        }
      } catch (requestError) {
        if (!ignore) {
          setError(formatApiError(requestError, "Unable to load users."));
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadInitialUsers();

    return () => {
      ignore = true;
    };
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    setError("");

    try {
      const payload = await apiClient.get(API_ENDPOINTS.users.list, { requiresAuth: true });
      setUsers(extractList(payload).map(normalizeUserRecord));
    } catch (requestError) {
      setError(formatApiError(requestError, "Unable to load users."));
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => [user.first_name, user.last_name, user.email, user.phone, user.role].join(" ").toLowerCase().includes(query));
  }, [users, search]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(initialForm);
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = async (userId) => {
    setFieldErrors({});
    setIsSaving(true);

    try {
      const payload = await apiClient.get(API_ENDPOINTS.users.byId(userId), { requiresAuth: true });
      const user = normalizeUserRecord(extractItem(payload));
      setEditingId(user.id);
      setForm({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        password: "",
        role: user.role,
      });
      setIsModalOpen(true);
    } catch (requestError) {
      toast.error(formatApiError(requestError, "Unable to load user details."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setFieldErrors({});

    try {
      const payload = { ...form };

      if (!payload.password) {
        delete payload.password;
      }

      if (editingId) {
        await apiClient.put(API_ENDPOINTS.users.byId(editingId), payload, { requiresAuth: true });
        toast.success("User updated successfully.");
      } else {
        await apiClient.post(API_ENDPOINTS.users.list, payload, { requiresAuth: true });
        toast.success("User created successfully.");
      }

      setIsModalOpen(false);
      await loadUsers();
    } catch (requestError) {
      setFieldErrors(getFieldErrors(requestError));
      toast.error(formatApiError(requestError, "Unable to save user."));
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
      await apiClient.delete(API_ENDPOINTS.users.byId(deleteTarget.id), { requiresAuth: true });
      toast.success("User deleted successfully.");
      setDeleteTarget(null);
      await loadUsers();
    } catch (requestError) {
      toast.error(formatApiError(requestError, "Unable to delete user."));
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      key: "name",
      label: "Member",
      render: (user) => (
        <div>
          <p className="font-semibold">{`${user.first_name} ${user.last_name}`.trim() || "Unnamed user"}</p>
          <p className="mt-1 text-xs text-[#6b716d]">{user.email}</p>
        </div>
      ),
    },
    { key: "phone", label: "Phone" },
    {
      key: "role",
      label: "Role",
      render: (user) => <StatusBadge status={user.role} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (user) => (
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => openEditModal(user.id)} className="inline-flex items-center gap-2 rounded-full border border-[#e5d8cc] px-3 py-2 text-xs font-semibold text-[#314131]">
            <Pencil size={14} /> Edit
          </button>
          <button type="button" onClick={() => setDeleteTarget(user)} className="inline-flex items-center gap-2 rounded-full border border-[#e9c3b9] px-3 py-2 text-xs font-semibold text-[#9d4327]">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminShell
      title="Manage users"
      subtitle="Create, update, and remove members from the live users endpoints with role-aware access."
      actions={
        <button type="button" onClick={openCreateModal} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#314131]">
          <PlusCircle size={16} /> New user
        </button>
      }
    >
      <div className="rounded-[28px] border border-[#efe7dc] bg-white p-4">
        <div className="flex items-center gap-3 rounded-[22px] border border-[#e3d7ca] bg-[#fcf7f1] px-4 py-3">
          <Users size={18} className="text-[#8b6e63]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users by name, email, phone, or role"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {isLoading ? <LoadingState label="Loading users..." /> : null}
      {!isLoading && error ? <ErrorState message={error} onRetry={loadUsers} /> : null}
      {!isLoading && !error ? <DataTable columns={columns} rows={filteredUsers} emptyMessage="No users found." /> : null}

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit user" : "Create user"}
        description="The form posts directly to the admin users endpoints. Leave password blank when editing if you do not want to change it."
        footer={[
          <button key="cancel" type="button" onClick={() => setIsModalOpen(false)} className="rounded-full border border-[#ded3c7] px-5 py-3 text-sm font-semibold text-[#314131]">
            Cancel
          </button>,
          <button key="save" type="submit" form="user-form" disabled={isSaving} className="rounded-full bg-[#314131] px-5 py-3 text-sm font-semibold text-white disabled:opacity-70">
            {isSaving ? "Saving..." : editingId ? "Update user" : "Create user"}
          </button>,
        ]}
      >
        <form id="user-form" onSubmit={handleSave} className="grid gap-4 md:grid-cols-2">
          {[
            ["first_name", "First name", "text"],
            ["last_name", "Last name", "text"],
            ["email", "Email", "email"],
            ["phone", "Phone", "tel"],
            ["password", editingId ? "Password (optional)" : "Password", "password"],
          ].map(([key, label, type]) => (
            <label key={key} className="block">
              <span className="mb-2 block text-sm font-semibold text-[#314131]">{label}</span>
              <input
                type={type}
                value={form[key]}
                onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                className="w-full rounded-2xl border border-[#e3d7ca] bg-[#fcf7f1] px-4 py-3 outline-none"
                required={!editingId || key !== "password"}
              />
              {fieldErrors[key] ? <p className="mt-2 text-xs text-[#a14a2a]">{fieldErrors[key]}</p> : null}
            </label>
          ))}

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-[#314131]">Role</span>
            <select
              value={form.role}
              onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
              className="w-full rounded-2xl border border-[#e3d7ca] bg-[#fcf7f1] px-4 py-3 outline-none"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {fieldErrors.role ? <p className="mt-2 text-xs text-[#a14a2a]">{fieldErrors.role}</p> : null}
          </label>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete user"
        description={`Delete ${deleteTarget ? `${deleteTarget.first_name} ${deleteTarget.last_name}`.trim() || deleteTarget.email : "this user"}? This cannot be undone.`}
        confirmLabel="Delete user"
        confirmVariant="danger"
        isBusy={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </AdminShell>
  );
}