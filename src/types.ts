export type Language = 'en' | 'bn';

export type RouterType = 'ac5' | 'f3' | 'netis' | 'auto';

export type LogoStyle = 'custom_photo' | 'pro_minimal' | 'sonic_beacon' | 'cyber_orbit';

export interface Device {
  mac: string;
  name: string;
  hostname: string;
  remark: string;
  ip: string;
  band: '2.4G' | '5G' | 'wired';
  online: boolean;
  blocked: boolean;
  downKBps: number;
  upKBps: number;
  limitDownKBps: number;
  limitUpKBps: number;
  secondsConnected: number;
  isMe?: boolean;
  isKnown?: boolean;
  deviceType?: 'phone' | 'laptop' | 'tv' | 'gaming' | 'iot' | 'speaker' | 'generic';
}

export interface RouterProfile {
  id: string;
  name: string;
  model: string;
  type: RouterType;
  url: string;
  active: boolean;
  ip: string;
  gateway: string;
  dns: string;
  linkMbps: number;
  wanStatus: 'ok' | 'connecting' | 'no_internet' | 'unplugged';
}

export interface WifiConfig {
  ssid24: string;
  ssid5: string;
  security: string;
  hidden24: boolean;
  hidden5: boolean;
  guest: {
    enabled: boolean;
    ssid: string;
    hasPassword: boolean;
    speedKBps: number;
    durationMinutes: number;
  };
}

export interface AccessListConfig {
  mode: 'deny' | 'pass'; // deny = blacklist, pass = whitelist
  macs: string[];
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  type: 'in' | 'out' | 'block' | 'unblock' | 'limit' | 'ai' | 'warning';
  title: string;
  description: string;
}

export interface IspContact {
  name: string;
  phone: string;
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  actionTaken?: {
    type: string;
    details: string;
    success: boolean;
  };
}

export interface NetworkDiagnostics {
  connectedSsid: string;
  deviceIp: string;
  subnetMask: string;
  gatewayIp: string;
  primaryDns: string;
  linkSpeed: string;
  frequency: string;
}
