import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navbar, NavTab } from './components/Navbar';
import { OverviewView } from './components/OverviewView';
import { DevicesView } from './components/DevicesView';
import { WifiView } from './components/WifiView';
import { AiView } from './components/AiView';
import { ActivityView } from './components/ActivityView';
import { SettingsView } from './components/SettingsView';
import { HelpModal } from './components/HelpModal';
import { LogoUploaderModal } from './components/LogoUploaderModal';
import { NetworkDiagnosticsModal } from './components/NetworkDiagnosticsModal';
import { 
  initialDevices, 
  initialRouters, 
  initialWifiConfig, 
  initialEvents, 
  initialIsp 
} from './mockData';
import { 
  Device, 
  RouterProfile, 
  WifiConfig, 
  AccessListConfig, 
  ActivityEvent, 
  IspContact, 
  Language,
  LogoStyle,
  NetworkDiagnostics
} from './types';
import { translations } from './translations';

export const App: React.FC = () => {
  // Navigation & Language
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('routermate_lang') as Language) || 'en';
  });

  // Custom Logo Upload state
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(() => {
    return localStorage.getItem('routermate_custom_logo') || null;
  });
  const [showLogoUploader, setShowLogoUploader] = useState<boolean>(false);
  const [showDiagnostics, setShowDiagnostics] = useState<boolean>(false);

  // State data
  const [routers, setRouters] = useState<RouterProfile[]>(() => {
    const saved = localStorage.getItem('routermate_routers');
    return saved ? JSON.parse(saved) : initialRouters;
  });
  const [activeRouterId, setActiveRouterId] = useState<string>('r-ac5');

  const [devices, setDevices] = useState<Device[]>(() => {
    const saved = localStorage.getItem('routermate_devices');
    return saved ? JSON.parse(saved) : initialDevices;
  });

  const [wifiConfig, setWifiConfig] = useState<WifiConfig>(() => {
    const saved = localStorage.getItem('routermate_wifi');
    return saved ? JSON.parse(saved) : initialWifiConfig;
  });

  const [accessList, setAccessList] = useState<AccessListConfig>(() => {
    const saved = localStorage.getItem('routermate_acl');
    return saved ? JSON.parse(saved) : { mode: 'deny', macs: ['8c:85:90:11:33:44'] };
  });

  const [events, setEvents] = useState<ActivityEvent[]>(() => {
    const saved = localStorage.getItem('routermate_events');
    return saved ? JSON.parse(saved) : initialEvents;
  });

  const [ispContact, setIspContact] = useState<IspContact>(() => {
    const saved = localStorage.getItem('routermate_isp');
    return saved ? JSON.parse(saved) : initialIsp;
  });

  const [isSimulated, setIsSimulated] = useState<boolean>(true);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  // Diagnostics for "Your Wi-Fi" modal
  const [diagnostics] = useState<NetworkDiagnostics>({
    connectedSsid: 'RouterMate-Home-5G',
    deviceIp: '192.168.0.100',
    subnetMask: '255.255.255.0',
    gatewayIp: '192.168.0.1',
    primaryDns: '1.1.1.1 (Cloudflare)',
    linkSpeed: '866 Mbps (AC Full Duplex)',
    frequency: '5180 MHz (Channel 36)',
  });

  // Traffic history streaming
  const [trafficHistory, setTrafficHistory] = useState<
    { down: number; up: number; time: string }[]
  >([
    { down: 12.4, up: 1.8, time: '2m' },
    { down: 14.1, up: 2.2, time: '1m45s' },
    { down: 11.8, up: 1.5, time: '1m30s' },
    { down: 16.5, up: 2.8, time: '1m15s' },
    { down: 18.2, up: 3.1, time: '1m' },
    { down: 15.0, up: 2.4, time: '45s' },
    { down: 14.2, up: 2.0, time: '30s' },
    { down: 16.8, up: 2.6, time: '15s' },
    { down: 16.2, up: 2.5, time: 'now' },
  ]);

  // Persist state
  useEffect(() => {
    localStorage.setItem('routermate_lang', lang);
  }, [lang]);

  useEffect(() => {
    if (customLogoUrl) {
      localStorage.setItem('routermate_custom_logo', customLogoUrl);
    } else {
      localStorage.removeItem('routermate_custom_logo');
    }
  }, [customLogoUrl]);

  useEffect(() => {
    localStorage.setItem('routermate_devices', JSON.stringify(devices));
  }, [devices]);

  useEffect(() => {
    localStorage.setItem('routermate_wifi', JSON.stringify(wifiConfig));
  }, [wifiConfig]);

  useEffect(() => {
    localStorage.setItem('routermate_acl', JSON.stringify(accessList));
  }, [accessList]);

  useEffect(() => {
    localStorage.setItem('routermate_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('routermate_isp', JSON.stringify(ispContact));
  }, [ispContact]);

  // Active router object
  const activeRouter = routers.find((r) => r.id === activeRouterId) || routers[0];

  // Calculate live total speeds
  const onlineActiveDevices = devices.filter((d) => d.online && !d.blocked);
  const totalDownMbps = onlineActiveDevices.reduce(
    (acc, d) => acc + (d.downKBps * 8) / 1000,
    0
  );
  const totalUpMbps = onlineActiveDevices.reduce(
    (acc, d) => acc + (d.upKBps * 8) / 1000,
    0
  );

  // Live simulation tick: subtly fluctuate bandwidth to make UI feel truly live
  useEffect(() => {
    if (!isSimulated) return;

    const interval = setInterval(() => {
      setDevices((prevDevices) =>
        prevDevices.map((d) => {
          if (!d.online || d.blocked) return d;
          const delta = (Math.random() - 0.48) * 150;
          const nextDown = Math.max(20, Math.min(8000, Math.round(d.downKBps + delta)));
          const nextUp = Math.max(5, Math.min(2000, Math.round(d.upKBps + (delta * 0.3))));
          return { ...d, downKBps: nextDown, upKBps: nextUp };
        })
      );

      setTrafficHistory((prev) => {
        const nextDown = Number(totalDownMbps.toFixed(1));
        const nextUp = Number(totalUpMbps.toFixed(1));
        const updated = [...prev.slice(1), { down: nextDown, up: nextUp, time: 'now' }];
        return updated;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isSimulated, totalDownMbps, totalUpMbps]);

  // Actions
  const handleToggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'bn' : 'en'));
  };

  const handleBlockDevice = (mac: string) => {
    const target = devices.find((d) => d.mac === mac);
    if (!target) return;

    if (target.isMe) {
      alert(translations[lang].wifi_acl_self_warning);
      return;
    }

    const willBlock = !target.blocked;

    setDevices((prev) =>
      prev.map((d) => (d.mac === mac ? { ...d, blocked: willBlock } : d))
    );

    if (willBlock) {
      if (!accessList.macs.includes(mac)) {
        setAccessList((prev) => ({ ...prev, macs: [...prev.macs, mac] }));
      }
    } else {
      setAccessList((prev) => ({
        ...prev,
        macs: prev.macs.filter((m) => m !== mac),
      }));
    }

    const newEvent: ActivityEvent = {
      id: `ev-${Date.now()}`,
      timestamp: 'Just now',
      type: willBlock ? 'block' : 'unblock',
      title: willBlock ? `Blocked ${target.name}` : `Unblocked ${target.name}`,
      description: willBlock
        ? `${target.name} (${target.mac}) has been severed from internet access.`
        : `${target.name} (${target.mac}) was restored to normal access.`,
    };

    setEvents((prev) => [newEvent, ...prev]);
  };

  const handleRenameDevice = (mac: string, newName: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.mac === mac ? { ...d, name: newName, remark: newName } : d))
    );

    const newEvent: ActivityEvent = {
      id: `ev-${Date.now()}`,
      timestamp: 'Just now',
      type: 'in',
      title: `Device Renamed: ${newName}`,
      description: `Hardware remark updated for MAC address ${mac}.`,
    };

    setEvents((prev) => [newEvent, ...prev]);
  };

  const handleSetLimit = (mac: string, mbps: number) => {
    const target = devices.find((d) => d.mac === mac);
    if (!target) return;

    const limitKBps = mbps > 0 ? Math.round(mbps * 125) : 0;

    setDevices((prev) =>
      prev.map((d) =>
        d.mac === mac ? { ...d, limitDownKBps: limitKBps, limitUpKBps: limitKBps } : d
      )
    );

    const newEvent: ActivityEvent = {
      id: `ev-${Date.now()}`,
      timestamp: 'Just now',
      type: 'limit',
      title: `Bandwidth Limit Set: ${mbps === 0 ? 'Unlimited' : `${mbps} Mbps`}`,
      description: `Speed cap adjusted for ${target.name}.`,
    };

    setEvents((prev) => [newEvent, ...prev]);
  };

  const handleToggleKnown = (mac: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.mac === mac ? { ...d, isKnown: !d.isKnown } : d))
    );
  };

  const handleMarkAllKnown = () => {
    setDevices((prev) =>
      prev.map((d) => (d.online ? { ...d, isKnown: true } : d))
    );

    const newEvent: ActivityEvent = {
      id: `ev-${Date.now()}`,
      timestamp: 'Just now',
      type: 'ai',
      title: 'Audited & Marked All Online Devices as Trusted',
      description: 'All currently connected devices verified into trusted registry.',
    };

    setEvents((prev) => [newEvent, ...prev]);
  };

  const handleSelectRouter = (id: string) => {
    setActiveRouterId(id);
    setRouters((prev) =>
      prev.map((r) => ({ ...r, active: r.id === id }))
    );
  };

  const handleResetApp = () => {
    localStorage.clear();
    setDevices(initialDevices);
    setRouters(initialRouters);
    setWifiConfig(initialWifiConfig);
    setEvents(initialEvents);
    setIspContact(initialIsp);
    setAccessList({ mode: 'deny', macs: ['8c:85:90:11:33:44'] });
    setActiveRouterId('r-ac5');
    setCustomLogoUrl(null);
  };

  // Health score calculation
  const blockedCount = devices.filter((d) => d.blocked).length;
  const unknownCount = devices.filter((d) => d.online && !d.isKnown && !d.isMe).length;
  const healthScore = Math.max(60, 100 - unknownCount * 8 - (totalDownMbps > 80 ? 10 : 0));

  return (
    <div className="min-h-screen bg-[#070e1c] text-[#e8f1ff] flex flex-col font-sans">
      {/* Header Bar */}
      <Header
        lang={lang}
        onToggleLang={handleToggleLang}
        activeRouter={activeRouter}
        isSimulated={isSimulated}
        onToggleSim={() => setIsSimulated(!isSimulated)}
        onOpenHelp={() => setShowHelp(true)}
        totalDownMbps={totalDownMbps}
        totalUpMbps={totalUpMbps}
        logoStyle="pro_minimal"
        customLogoUrl={customLogoUrl}
        onOpenLogoUploader={() => setShowLogoUploader(true)}
        onOpenDiagnostics={() => setShowDiagnostics(true)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Navbar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          lang={lang}
          onlineCount={onlineActiveDevices.length}
          blockedCount={blockedCount}
          healthScore={healthScore}
        />

        {/* Content View Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-24 md:pb-12">
          {currentTab === 'overview' && (
            <OverviewView
              lang={lang}
              activeRouter={activeRouter}
              devices={devices}
              totalDownMbps={totalDownMbps}
              totalUpMbps={totalUpMbps}
              trafficHistory={trafficHistory}
              onNavigate={setCurrentTab}
              onBlockDevice={handleBlockDevice}
            />
          )}

          {currentTab === 'devices' && (
            <DevicesView
              lang={lang}
              devices={devices}
              onBlockDevice={handleBlockDevice}
              onRenameDevice={handleRenameDevice}
              onSetLimit={handleSetLimit}
              onToggleKnown={handleToggleKnown}
            />
          )}

          {currentTab === 'wifi' && (
            <WifiView
              lang={lang}
              wifiConfig={wifiConfig}
              onUpdateWifi={setWifiConfig}
              accessList={accessList}
              onUpdateAccessList={setAccessList}
              devices={devices}
            />
          )}

          {currentTab === 'ai' && (
            <AiView
              lang={lang}
              devices={devices}
              totalDownMbps={totalDownMbps}
              healthScore={healthScore}
              onBlockDevice={handleBlockDevice}
              onMarkAllKnown={handleMarkAllKnown}
            />
          )}

          {currentTab === 'activity' && (
            <ActivityView
              lang={lang}
              events={events}
              onClearEvents={() => setEvents([])}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              lang={lang}
              onSetLang={setLang}
              routers={routers}
              onSelectRouter={handleSelectRouter}
              ispContact={ispContact}
              onUpdateIsp={setIspContact}
              isSimulated={isSimulated}
              onToggleSim={() => setIsSimulated(!isSimulated)}
              onResetApp={handleResetApp}
              customLogoUrl={customLogoUrl}
              onOpenLogoUploader={() => setShowLogoUploader(true)}
              onOpenDiagnostics={() => setShowDiagnostics(true)}
            />
          )}
        </main>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <HelpModal
          lang={lang}
          onClose={() => setShowHelp(false)}
          ispPhone={ispContact.phone}
        />
      )}

      {/* Custom Logo Photo Uploader Modal */}
      <LogoUploaderModal
        isOpen={showLogoUploader}
        onClose={() => setShowLogoUploader(false)}
        currentLogoUrl={customLogoUrl}
        onSaveLogo={(url) => setCustomLogoUrl(url)}
        lang={lang}
      />

      {/* "Your Wi-Fi" Interface Diagnostics Modal */}
      <NetworkDiagnosticsModal
        isOpen={showDiagnostics}
        onClose={() => setShowDiagnostics(false)}
        lang={lang}
        diagnostics={diagnostics}
      />
    </div>
  );
};
