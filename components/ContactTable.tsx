'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Filter, 
  CheckSquare, 
  Square, 
  AlertTriangle, 
  CheckCircle2, 
  UserX,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../app/context/AppContext';
import { Contact } from '../app/types';

export const ContactTable: React.FC = () => {
  const { 
    contacts, 
    updateContact, 
    deleteContact, 
    bulkDeleteContacts, 
    toggleSelectContact, 
    toggleSelectAllContacts, 
    clearContacts 
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'valid' | 'invalid'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Filter contacts
  const filteredContacts = contacts.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.originalPhone.includes(search);
    const matchesStatus = statusFilter === 'all' ? true : c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredContacts.length / pageSize) || 1;
  const paginatedContacts = filteredContacts.slice((page - 1) * pageSize, page * pageSize);

  const selectedCount = contacts.filter(c => c.selected && c.status === 'valid').length;
  const validTotal = contacts.filter(c => c.status === 'valid').length;

  const startInlineEdit = (contact: Contact) => {
    setEditingId(contact.id);
    setEditName(contact.name);
    setEditPhone(contact.phone);
  };

  const saveInlineEdit = (id: string) => {
    updateContact(id, { name: editName, phone: editPhone, status: 'valid' });
    setEditingId(null);
  };

  const handleBulkDeleteSelected = () => {
    const selectedIds = contacts.filter(c => c.selected).map(c => c.id);
    if (selectedIds.length > 0) {
      bulkDeleteContacts(selectedIds);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      {/* Table Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search & Status Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or number..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              All ({contacts.length})
            </button>
            <button
              onClick={() => setStatusFilter('valid')}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === 'valid'
                  ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Valid ({validTotal})
            </button>
            <button
              onClick={() => setStatusFilter('invalid')}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === 'invalid'
                  ? 'bg-white dark:bg-slate-800 text-rose-500 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Invalid ({contacts.length - validTotal})
            </button>
          </div>
        </div>

        {/* Selection & Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleSelectAllContacts(selectedCount < validTotal)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-1.5 transition-colors"
          >
            {selectedCount === validTotal && validTotal > 0 ? (
              <CheckSquare className="w-4 h-4 text-brand-500" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            {selectedCount === validTotal && validTotal > 0 ? 'Unselect All' : 'Select All Valid'}
          </button>

          {selectedCount > 0 && (
            <button
              onClick={handleBulkDeleteSelected}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Selected ({selectedCount})
            </button>
          )}

          {contacts.length > 0 && (
            <button
              onClick={clearContacts}
              className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-950 text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="p-3.5 w-12 text-center">Select</th>
              <th className="p-3.5">Contact Name</th>
              <th className="p-3.5">Phone Number (E.164)</th>
              <th className="p-3.5">Validation Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {paginatedContacts.length > 0 ? (
              paginatedContacts.map((contact) => {
                const isEditing = editingId === contact.id;

                return (
                  <tr
                    key={contact.id}
                    className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${
                      contact.selected ? 'bg-brand-500/[0.03]' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={!!contact.selected}
                        disabled={contact.status === 'invalid'}
                        onChange={() => toggleSelectContact(contact.id)}
                        className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500/50 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 cursor-pointer"
                      />
                    </td>

                    {/* Name */}
                    <td className="p-3.5 font-medium text-slate-900 dark:text-white">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs w-full"
                        />
                      ) : (
                        contact.name
                      )}
                    </td>

                    {/* Phone Number */}
                    <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs w-full"
                        />
                      ) : (
                        contact.phone || contact.originalPhone
                      )}
                    </td>

                    {/* Validation Status */}
                    <td className="p-3.5">
                      {contact.status === 'valid' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Valid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                          <AlertTriangle className="w-3 h-3" /> {contact.validationReason || 'Invalid Number'}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right space-x-1">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveInlineEdit(contact.id)}
                            className="p-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startInlineEdit(contact)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteContact(contact.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  <UserX className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  No contacts found matching criteria. Upload an Excel file to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-2 text-xs text-slate-500 dark:text-slate-400">
        <span>
          Showing {filteredContacts.length > 0 ? (page - 1) * pageSize + 1 : 0} to{' '}
          {Math.min(page * pageSize, filteredContacts.length)} of {filteredContacts.length} contacts
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
