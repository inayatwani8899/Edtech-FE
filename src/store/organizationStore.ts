import { create } from "zustand";
import api from "../api/axios";
import { GenericResponse } from "@/types/types";

// Define the Organization interface based on API schema
export interface Organization {
  id: number;
  userId?: number;
  instituteName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  documentUrl?: string;
  email: string;
  contactNumber: string;
  website: string;
  organizationType: string;
  approxStudentCount: number;
  isVerified: boolean;
  isActive: boolean;
  status?: string; // e.g. Completed, Pending, Verified, Rejected
  onboardingStage?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  tenantDb?: string;
  tenantDatabase?: string;
  documents?: any[];
  logoPath?: string;
  siteMessage?: string;
}

interface OrganizationResponseData {
  organizations: Organization[];
  totalCount: number;
}

interface OrganizationState {
  organizations: Organization[];
  organization: Organization | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  limit: number;
  totalCount: number;
  searchTerm: string;
  debouncedSearchTerm: string;
  selectedOrgId: string | null;
  deleteOpen: boolean;
  
  // Custom filters
  statusFilter: string; // "All", "Completed", "Pending", "Verified", "Rejected"
  approvalFilter: string; // "All", "Approved", "Not Approved"
  documentFilter: string; // "All", "Documents Completed", "Documents Pending"
  detailsFilter: string; // "All", "Details Completed", "Incomplete"
  configFilter: string; // "All", "Configured", "Not Configured"
  activeFilter: string; // "All", "Active", "Inactive"
  typeFilter: string; // "All", "School", "College", "University", "Institute"
  
  sortDirection: "asc" | "desc";

  // Actions
  fetchOrganizations: () => Promise<void>;
  fetchOrganization: (id: string) => Promise<void>;
  createOrganization: (formData: FormData) => Promise<void>;
  updateOrganization: (id: string, data: any) => Promise<void>;
  deleteOrganization: () => Promise<void>;
  verifyOrganization: (id: string) => Promise<void>;
  testDbConnection: (connectionData: any) => Promise<any>;
  setupDatabase: (orgId: string, connectionData: any) => Promise<any>;
  syncPrimaryData: (orgId: string, syncData: any) => Promise<any>;
  
  // Setter actions
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearchTerm: (term: string) => void;
  setSortDirection: (direction: "asc" | "desc") => void;
  
  // Filter setters
  setStatusFilter: (status: string) => void;
  setApprovalFilter: (approval: string) => void;
  setDocumentFilter: (doc: string) => void;
  setDetailsFilter: (details: string) => void;
  setConfigFilter: (val: string) => void;
  setActiveFilter: (val: string) => void;
  setTypeFilter: (val: string) => void;
  
  openDeleteDialog: (id: string) => void;
  closeDeleteDialog: () => void;
  clearOrganization: () => void;
}

let searchTimeout: any = null;

export const useOrganizationStore = create<OrganizationState>((set, get) => ({
  organizations: [],
  organization: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  limit: 10,
  totalCount: 0,
  searchTerm: "",
  debouncedSearchTerm: "",
  selectedOrgId: null,
  deleteOpen: false,
  
  // Filter defaults
  statusFilter: "All",
  approvalFilter: "All",
  documentFilter: "All",
  detailsFilter: "All",
  configFilter: "All",
  activeFilter: "All",
  typeFilter: "All",
  
  sortDirection: "asc",

  // Setters
  setPage: (page) => {
    set({ currentPage: page });
    get().fetchOrganizations();
  },

  setLimit: (limit) => {
    set({ limit, currentPage: 1 });
    get().fetchOrganizations();
  },

  setSearchTerm: (term) => {
    set({ searchTerm: term });
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    searchTimeout = setTimeout(() => {
      set({ debouncedSearchTerm: term, currentPage: 1 });
      get().fetchOrganizations();
    }, 500);
  },

  setSortDirection: (direction) => {
    set({ sortDirection: direction, currentPage: 1 });
    get().fetchOrganizations();
  },

  setStatusFilter: (status) => {
    set({ statusFilter: status, currentPage: 1 });
    get().fetchOrganizations();
  },

  setApprovalFilter: (approval) => {
    set({ approvalFilter: approval, currentPage: 1 });
    get().fetchOrganizations();
  },

  setDocumentFilter: (doc) => {
    set({ documentFilter: doc, currentPage: 1 });
    get().fetchOrganizations();
  },

  setDetailsFilter: (details) => {
    set({ detailsFilter: details, currentPage: 1 });
    get().fetchOrganizations();
  },

  setConfigFilter: (val) => {
    set({ configFilter: val, currentPage: 1 });
    get().fetchOrganizations();
  },

  setActiveFilter: (val) => {
    set({ activeFilter: val, currentPage: 1 });
    get().fetchOrganizations();
  },

  setTypeFilter: (val) => {
    set({ typeFilter: val, currentPage: 1 });
    get().fetchOrganizations();
  },

  openDeleteDialog: (id) => set({ selectedOrgId: id, deleteOpen: true }),
  closeDeleteDialog: () => set({ selectedOrgId: null, deleteOpen: false }),
  clearOrganization: () => set({ organization: null, error: null }),

  // Actions
  fetchOrganizations: async () => {
    set({ loading: true, error: null });
    const { 
      currentPage, 
      limit, 
      debouncedSearchTerm, 
      sortDirection,
      statusFilter,
      approvalFilter,
      documentFilter,
      detailsFilter,
      configFilter,
      activeFilter,
      typeFilter
    } = get();

    try {
      // Fetch list of organizations from the backend
      const response = await api.get<any>("/Organization", {
        params: {
          page: currentPage,
          limit,
          search: debouncedSearchTerm || undefined,
          sortDirection,
        },
      });

      // API might return standard wrapper or list directly
      let orgList: Organization[] = [];
      let total = 0;

      if (response.data?.data?.organizations) {
        orgList = response.data.data.organizations;
        total = response.data.data.totalCount || orgList.length;
      } else if (Array.isArray(response.data?.data)) {
        orgList = response.data.data;
        total = orgList.length;
      } else if (Array.isArray(response.data)) {
        orgList = response.data;
        total = orgList.length;
      }

      // Apply client-side filters since the backend lists don't support custom filters in query parameters
      let filtered = [...orgList];

      // 1. Status Filter: Completed, Pending, Verified, Rejected
      if (statusFilter !== "All") {
        filtered = filtered.filter(org => {
          const s = (org.status || "").toLowerCase();
          return s === statusFilter.toLowerCase();
        });
      }

      // 2. Approval Status Filter: Approved, Not Approved
      if (approvalFilter !== "All") {
        filtered = filtered.filter(org => {
          const approved = org.isVerified === true;
          return approvalFilter === "Approved" ? approved : !approved;
        });
      }

      // 3. Documents Status Filter: Documents Completed, Documents Pending
      if (documentFilter !== "All") {
        filtered = filtered.filter(org => {
          const hasDocs = !!(org.documentUrl || (org.documents && org.documents.length > 0));
          return documentFilter === "Documents Completed" ? hasDocs : !hasDocs;
        });
      }

      // 4. Details Completion Filter: Details Completed, Incomplete
      if (detailsFilter !== "All") {
        filtered = filtered.filter(org => {
          const isComplete = !!(
            org.instituteName &&
            org.email &&
            org.contactNumber &&
            org.address &&
            org.city &&
            org.state &&
            org.country &&
            org.postalCode
          );
          return detailsFilter === "Details Completed" ? isComplete : !isComplete;
        });
      }

      // 5. Configuration Status Filter: Configured, Not Configured
      if (configFilter !== "All") {
        filtered = filtered.filter(org => {
          const hasDb = !!(org.tenantDb || org.tenantDatabase);
          return configFilter === "Configured" ? hasDb : !hasDb;
        });
      }

      // 6. Active Status Filter: Active, Inactive
      if (activeFilter !== "All") {
        filtered = filtered.filter(org => {
          const isActive = org.isActive === true;
          return activeFilter === "Active" ? isActive : !isActive;
        });
      }

      // 7. Organization Type Filter: School, College, University, Institute
      if (typeFilter !== "All") {
        filtered = filtered.filter(org => {
          const type = (org.organizationType || "").toLowerCase();
          return type === typeFilter.toLowerCase();
        });
      }

      const calculatedTotalPages = Math.ceil(total / limit) || 1;

      set({
        organizations: filtered,
        totalPages: calculatedTotalPages,
        totalCount: total,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch organizations.",
        organizations: [],
        totalPages: 1,
        totalCount: 0,
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchOrganization: async (id) => {
    if (!id) return;
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/Organization/${id}`);
      const org = response.data?.data || response.data;
      set({ organization: org });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || "Failed to fetch organization details.",
        organization: null 
      });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  createOrganization: async (formData) => {
    set({ loading: true, error: null });
    try {
      await api.post("/Organization/register", formData, {
        headers: {
          "Content-Type": undefined,
        },
        skipToast: true,
      } as any);
      await get().fetchOrganizations();
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to register organization." });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateOrganization: async (id, data) => {
    set({ loading: true, error: null });
    try {
      let payload: any;
      let headers = {};
      if (data instanceof FormData) {
        payload = data;
        payload.set("id", String(id));
        payload.set("Id", String(id));
        headers = {
          "Content-Type": undefined,
        };
      } else {
        payload = {
          id: Number(id),
          ...data,
        };
      }
      await api.put("/Organization", payload, {
        headers,
        skipToast: true,
      } as any);
      await get().fetchOrganizations();
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to update organization." });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  deleteOrganization: async () => {
    const { selectedOrgId, fetchOrganizations, currentPage, organizations } = get();
    if (!selectedOrgId) return;
    set({ loading: true, error: null });
    try {
      await api.delete(`/Organization/${selectedOrgId}`);
      
      const remaining = organizations.filter(org => org.id !== Number(selectedOrgId));
      if (remaining.length === 0 && currentPage > 1) {
        set({ currentPage: currentPage - 1 });
      }
      
      set({ deleteOpen: false, selectedOrgId: null });
      await fetchOrganizations();
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to delete organization." });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  verifyOrganization: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/Organization/verify/${id}`);
      await get().fetchOrganizations();
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to verify organization." });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  testDbConnection: async (connectionData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/SuperAdmin/organizations/test-db-connection", connectionData, { skipToast: true } as any);
      const resData = response.data;
      if (resData && (resData.success === false || resData.code === 400 || resData.data?.success === false || resData.data?.serverConnected === false)) {
        const errMsg = resData.message || resData.data?.message || "Connection failed";
        const error = new Error(errMsg);
        (error as any).response = { data: resData };
        throw error;
      }
      return resData;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to verify database connection." });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  setupDatabase: async (orgId, connectionData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/SuperAdmin/organizations/${orgId}/setup-database`, connectionData, { skipToast: true } as any);
      const resData = response.data;
      if (resData && (resData.success === false || resData.code === 400 || resData.data?.success === false)) {
        const errMsg = resData.message || resData.data?.message || "Database setup failed";
        const error = new Error(errMsg);
        (error as any).response = { data: resData };
        throw error;
      }
      await get().fetchOrganizations();
      return resData;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to setup tenant database." });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  syncPrimaryData: async (orgId, syncData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/TenantSync/sync-primary-data/${orgId}`, syncData, { skipToast: true } as any);
      const resData = response.data;
      if (resData && (resData.success === false || resData.code === 400 || resData.data?.success === false)) {
        const errMsg = resData.message || resData.data?.message || "Synchronization failed";
        const error = new Error(errMsg);
        (error as any).response = { data: resData };
        throw error;
      }
      await get().fetchOrganizations();
      return resData;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to synchronize primary database." });
      throw err;
    } finally {
      set({ loading: false });
    }
  }
}));
