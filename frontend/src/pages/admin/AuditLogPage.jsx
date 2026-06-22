import { useCallback, useEffect, useMemo, useState } from "react";
import { Filter, RefreshCw } from "lucide-react";

import AuditLogTable from "../../components/admin/AuditLogTable.jsx";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import Loader from "../../components/ui/Loader.jsx";
import Select from "../../components/ui/Select.jsx";
import { auditLogService } from "../../services/auditLogService.js";

function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  });
  const [filters, setFilters] = useState({
    user_id: "",
    action: "",
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const params = useMemo(
    () => ({
      page: pagination.page,
      limit: pagination.limit,
      user_id: appliedFilters.user_id || undefined,
      action: appliedFilters.action || undefined,
    }),
    [appliedFilters, pagination.limit, pagination.page],
  );

  const loadAuditLogs = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await auditLogService.getAuditLogs(params);
      setLogs(response.data || []);
      setPagination((currentPagination) => ({
        ...currentPagination,
        ...(response.pagination || {}),
      }));
    } catch (error) {
      setLogs([]);
      setErrorMessage(error.message || "Audit log gagal dimuat.");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    loadAuditLogs();
  }, [loadAuditLogs]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((currentFilters) => ({ ...currentFilters, [name]: value }));
  };

  const handleLimitChange = (event) => {
    setPagination((currentPagination) => ({
      ...currentPagination,
      page: 1,
      limit: Number(event.target.value),
    }));
  };

  const handleApplyFilters = (event) => {
    event.preventDefault();
    setPagination((currentPagination) => ({ ...currentPagination, page: 1 }));
    setAppliedFilters(filters);
  };

  const handleResetFilters = () => {
    const nextFilters = { user_id: "", action: "" };
    setFilters(nextFilters);
    setAppliedFilters(nextFilters);
    setPagination((currentPagination) => ({ ...currentPagination, page: 1 }));
  };

  const handlePageChange = (nextPage) => {
    setPagination((currentPagination) => ({
      ...currentPagination,
      page: Math.min(Math.max(nextPage, 1), currentPagination.total_pages || 1),
    }));
  };

  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="section-kicker">Monitoring</p>
          <h1 className="mb-0 text-3xl font-semibold tracking-normal">Audit Log</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Telusuri aktivitas admin berdasarkan user, action, alamat IP, dan waktu kejadian.
          </p>
        </div>
        <Button
          className="w-full md:w-auto"
          disabled={isLoading}
          icon={<RefreshCw size={16} />}
          onClick={loadAuditLogs}
          type="button"
          variant="outline"
        >
          Refresh
        </Button>
      </div>

      {errorMessage ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      <Card className="p-5">
        <form className="grid gap-3 md:grid-cols-[180px_1fr_140px_auto_auto]" onSubmit={handleApplyFilters}>
          <Input
            label="User ID"
            min="1"
            name="user_id"
            onChange={handleFilterChange}
            placeholder="1"
            type="number"
            value={filters.user_id}
          />
          <Input
            label="Action"
            name="action"
            onChange={handleFilterChange}
            placeholder="login, upload_document"
            value={filters.action}
          />
          <Select label="Limit" onChange={handleLimitChange} value={pagination.limit}>
            <option value="10">10 data</option>
            <option value="25">25 data</option>
            <option value="50">50 data</option>
            <option value="100">100 data</option>
          </Select>
          <div className="flex items-end">
            <Button className="w-full" icon={<Filter size={16} />} type="submit">
              Filter
            </Button>
          </div>
          <div className="flex items-end">
            <Button className="w-full" onClick={handleResetFilters} type="button" variant="outline">
              Reset
            </Button>
          </div>
        </form>
      </Card>

      {isLoading ? <Loader label="Memuat audit log" /> : null}
      <AuditLogTable isLoading={isLoading} logs={logs} />

      <Card className="flex flex-col gap-3 p-4 text-sm md:flex-row md:items-center md:justify-between">
        <span className="text-muted-foreground">
          Total {pagination.total || 0} log, halaman {pagination.page || 1} dari {pagination.total_pages || 1}
        </span>
        <div className="flex gap-2">
          <Button
            disabled={isLoading || pagination.page <= 1}
            onClick={() => handlePageChange(pagination.page - 1)}
            type="button"
            variant="outline"
          >
            Sebelumnya
          </Button>
          <Button
            disabled={isLoading || pagination.page >= (pagination.total_pages || 1)}
            onClick={() => handlePageChange(pagination.page + 1)}
            type="button"
            variant="outline"
          >
            Berikutnya
          </Button>
        </div>
      </Card>
    </section>
  );
}

export default AuditLogPage;
