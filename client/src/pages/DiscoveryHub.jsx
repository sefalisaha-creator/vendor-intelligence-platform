import React, { useState, useEffect } from "react";
import { useVendors } from "../context/VendorContext";
import { useAuth } from "../context/AuthContext";
import VendorCard from "../components/vendors/VendorCard";
import {
  Building2,
  ShieldAlert,
  Award,
  SlidersHorizontal,
} from "lucide-react";

const DiscoveryHub = () => {
  // Pulling running global search queries right out of the context stream
  const { vendors, loading, error, refreshVendors, searchQuery } = useVendors();
  const { user } = useAuth();
  const [filters, setFilters] = useState({ city: "", category: "" });

  const isAdmin = user?.role === "Admin";

  // Phase 1: Security Shield - Segment archived data away from general employee visibility
  const permissionPool = isAdmin 
    ? vendors 
    : vendors.filter((v) => v.status !== "Archived");

  // Phase 2: Live Text Filtering - Evaluate matching entities across names reactively
  const visibleVendors = permissionPool.filter((vendor) => 
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  // Compute operational statistics strictly based on the role permission baseline scope
  const totalActive = permissionPool.filter(
    (v) => v.status === "Active" || v.status === "Strategic Partner"
  ).length;
  const totalEscalations = permissionPool.filter(
    (v) => v.status === "Escalated"
  ).length;
  const strategicPartners = permissionPool.filter(
    (v) => v.status === "Strategic Partner"
  ).length;

  useEffect(() => {
    refreshVendors(filters);
  }, [filters, refreshVendors]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (loading)
    return (
      <div className="text-sm font-medium text-slate-500 animate-pulse">
        Syncing platform directories...
      </div>
    );
  if (error)
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
        {error}
      </div>
    );

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Vendor Discovery Hub
          </h1>
          {isAdmin && (
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded uppercase">
              Admin View Mode
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Cross-department internal directory mapping institutional supplier analytics.
        </p>
      </div>

      {/* KPI Analytical Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/80 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Operational Pool
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">
              {totalActive}{" "}
              <span className="text-xs text-slate-400 font-normal">Active</span>
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/80 flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Critical Red Flags
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">
              {totalEscalations}{" "}
              <span className="text-xs text-slate-400 font-normal">
                Escalated
              </span>
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/80 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Strategic Tier
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">
              {strategicPartners}{" "}
              <span className="text-xs text-slate-400 font-normal">Allies</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Interactive Regional/Category Select Dropdowns Deck */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/80 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider border-r pr-4 border-slate-200 h-6">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full sm:w-auto flex-1">
          <select
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="">All Regions / Cities</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Pune">Pune</option>
          </select>

          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="">All Services Categories</option>
            <option value="Facility Management">Facility Management</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Logistics">Logistics</option>
            <option value="Hospitality">Hospitality</option>
            <option value="Legal Services">Legal Services</option>
          </select>
        </div>
      </div>

      {/* Dynamic Result Panel Layout Grid */}
      {visibleVendors.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium">
          {searchQuery ? `No vendor records matched your search phrase: "${searchQuery}"` : "No matching institutional suppliers found in this workspace view scope."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleVendors.map((vendor) => (
            <VendorCard key={vendor._id || vendor.id} vendor={vendor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscoveryHub;