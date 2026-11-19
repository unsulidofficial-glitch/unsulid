'use client';

import React, { useState, useEffect } from 'react';
import { FileText, RefreshCw, Clock, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminAuditLogsClient() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = () => {
    setLoading(true);
    api.admin
      .getAuditLogs()
      .then((res) => {
        if (res?.logs) setLogs(res.logs);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C6A15B] font-bold block mb-1">
            IMMUTABLE SECURITY TRAIL
          </span>
          <h1 className="font-serif text-3xl font-medium text-white">System Audit Logs</h1>
          <p className="text-xs text-white/50 font-sans mt-1">
            Tamper-evident administrative action log recording every price, shipping, coupon, and status change.
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Logs Table */}
      <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead className="text-white/40 uppercase tracking-wider text-[10px] border-b border-white/10">
            <tr>
              <th className="pb-3">Timestamp</th>
              <th className="pb-3">Administrator</th>
              <th className="pb-3">Action</th>
              <th className="pb-3">Entity Affected</th>
              <th className="pb-3">Audit Details (Before → After)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-white/40">
                  No administrative actions logged yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 font-mono text-[11px] text-white/60 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>

                  <td className="py-4 font-mono text-white font-semibold">
                    {log.adminEmail}
                  </td>

                  <td className="py-4">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#5B0F18] text-[#C6A15B] uppercase">
                      {log.action}
                    </span>
                  </td>

                  <td className="py-4 font-mono text-white/80">
                    {log.entityType} #{log.entityId}
                  </td>

                  <td className="py-4 max-w-md">
                    <details className="text-[11px] text-white/70 font-mono cursor-pointer">
                      <summary className="hover:text-[#C6A15B]">View Modification Diff</summary>
                      <div className="mt-2 p-2.5 rounded-lg bg-black/80 border border-white/10 overflow-x-auto max-h-40">
                        {log.previousValue && (
                          <div className="text-red-400 mb-1">
                            <strong>Previous: </strong>
                            <code>{JSON.stringify(log.previousValue, null, 2)}</code>
                          </div>
                        )}
                        {log.newValue && (
                          <div className="text-emerald-400">
                            <strong>New Value: </strong>
                            <code>{JSON.stringify(log.newValue, null, 2)}</code>
                          </div>
                        )}
                      </div>
                    </details>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

