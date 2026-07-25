'use client';

import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { AnalyticsCards } from '../components/AnalyticsCards';
import { ContactImporter } from '../components/ContactImporter';
import { ContactTable } from '../components/ContactTable';
import { MessageComposer } from '../components/MessageComposer';
import { LiveProgress } from '../components/LiveProgress';
import { HistoryTable } from '../components/HistoryTable';
import { SettingsPanel } from '../components/SettingsPanel';
import { LogsConsole } from '../components/LogsConsole';
import { QrModal } from '../components/QrModal';
import { CampaignModal } from '../components/CampaignModal';
import { QrCode, Smartphone, Users, Send, Rocket, History, ArrowRight } from 'lucide-react';
import { MediaAttachment } from './types';

export default function DashboardPage() {
  const { activeTab, setActiveTab, status, contacts, setIsQrModalOpen } = useApp();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [composerMessage, setComposerMessage] = useState('');
  const [composerMedia, setComposerMedia] = useState<MediaAttachment | null>(null);

  const handleOpenCampaignModal = (template: string, media?: MediaAttachment | null) => {
    setComposerMessage(template);
    setComposerMedia(media || null);
    setIsCampaignModalOpen(true);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      {/* Collapsible SaaS Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* SaaS Top Header */}
        <Header />

        {/* Dynamic View Scroll Container */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Analytics Metric Cards */}
              <AnalyticsCards />

              {/* Call-to-action Banner if disconnected */}
              {!status.connected && (
                <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-900/40 via-brand-800/20 to-slate-900 border border-brand-500/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-glow">
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl bg-brand-500 text-white shadow-glow">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Connect your WhatsApp Account
                      </h3>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Scan QR Code to authenticate your device and start automated bulk dispatches.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsQrModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-xs shadow-glow flex items-center gap-2 transition-all flex-shrink-0"
                  >
                    Open QR Scanner <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Quick Workflow Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ContactImporter />
                <LiveProgress />
              </div>

              {/* Contacts Table Overview */}
              <ContactTable />
            </div>
          )}

          {/* Connection View Tab */}
          {activeTab === 'connection' && (
            <div className="max-w-3xl space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-brand-500" /> WhatsApp Authentication Status
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage your active LocalAuth session and inspect hardware parameters.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => setIsQrModalOpen(true)}
                    className="px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-xs shadow-glow flex items-center gap-2 transition-all"
                  >
                    <Smartphone className="w-4 h-4" />{' '}
                    {status.connected ? 'View Connected Session' : 'Scan WhatsApp QR Code'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Contacts Import Tab */}
          {activeTab === 'contacts' && (
            <div className="space-y-6">
              <ContactImporter />
              <ContactTable />
            </div>
          )}

          {/* Message Composer Tab */}
          {activeTab === 'compose' && (
            <MessageComposer onOpenCampaignModal={handleOpenCampaignModal} />
          )}

          {/* Live Campaigns Tab */}
          {activeTab === 'campaigns' && <LiveProgress />}

          {/* History Tab */}
          {activeTab === 'history' && <HistoryTable />}

          {/* System Logs Tab */}
          {activeTab === 'logs' && <LogsConsole />}

          {/* Settings Tab */}
          {activeTab === 'settings' && <SettingsPanel />}
        </main>
      </div>

      {/* QR Code Modal Overlay */}
      <QrModal />

      {/* Campaign Launcher Modal Overlay */}
      <CampaignModal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        messageTemplate={composerMessage}
        media={composerMedia}
      />
    </div>
  );
}
