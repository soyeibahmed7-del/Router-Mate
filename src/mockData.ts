import { Device, RouterProfile, WifiConfig, ActivityEvent, IspContact } from './types';

export const initialRouters: RouterProfile[] = [
  {
    id: 'r-ac5',
    name: 'Home Fiber Core',
    model: 'Tenda AC5 (Dual-Band AC1200)',
    type: 'ac5',
    url: 'http://192.168.0.1',
    active: true,
    ip: '103.114.98.42',
    gateway: '103.114.98.1',
    dns: '1.1.1.1, 8.8.8.8',
    linkMbps: 1000,
    wanStatus: 'ok',
  },
  {
    id: 'r-f3',
    name: 'Upstairs Repeater',
    model: 'Tenda F3 (300Mbps N)',
    type: 'f3',
    url: 'http://192.168.1.1',
    active: false,
    ip: '192.168.0.25',
    gateway: '192.168.0.1',
    dns: '1.1.1.1',
    linkMbps: 100,
    wanStatus: 'ok',
  },
  {
    id: 'r-netis',
    name: 'Garage Gateway',
    model: 'Netis WF2409E',
    type: 'netis',
    url: 'http://192.168.2.1',
    active: false,
    ip: '192.168.0.26',
    gateway: '192.168.0.1',
    dns: '8.8.4.4',
    linkMbps: 100,
    wanStatus: 'ok',
  }
];

export const initialDevices: Device[] = [
  {
    mac: 'd8:3a:dd:21:4a:12',
    name: "Soyeib's Admin Phone",
    hostname: 'Galaxy-S24-Ultra',
    remark: "Soyeib's Admin Phone",
    ip: '192.168.0.100',
    band: '5G',
    online: true,
    blocked: false,
    downKBps: 1840,
    upKBps: 240,
    limitDownKBps: 0,
    limitUpKBps: 0,
    secondsConnected: 14200,
    isMe: true,
    isKnown: true,
    deviceType: 'phone'
  },
  {
    mac: 'f4:d4:88:51:7c:99',
    name: 'MacBook Pro 16" M3',
    hostname: 'mbp-workstation',
    remark: 'MacBook Pro 16" M3',
    ip: '192.168.0.102',
    band: '5G',
    online: true,
    blocked: false,
    downKBps: 4250,
    upKBps: 890,
    limitDownKBps: 0,
    limitUpKBps: 0,
    secondsConnected: 28400,
    isMe: false,
    isKnown: true,
    deviceType: 'laptop'
  },
  {
    mac: 'b8:27:eb:92:1f:33',
    name: 'Living Room Sony Bravia TV',
    hostname: 'SONY-BRAVIA-4K',
    remark: 'Living Room Sony Bravia TV',
    ip: '192.168.0.105',
    band: '5G',
    online: true,
    blocked: false,
    downKBps: 2950,
    upKBps: 60,
    limitDownKBps: 0,
    limitUpKBps: 0,
    secondsConnected: 9800,
    isMe: false,
    isKnown: true,
    deviceType: 'tv'
  },
  {
    mac: '70:9e:29:43:55:18',
    name: 'PlayStation 5 Console',
    hostname: 'PS5-LivingRoom',
    remark: 'PlayStation 5 Console',
    ip: '192.168.0.108',
    band: 'wired',
    online: true,
    blocked: false,
    downKBps: 6800,
    upKBps: 340,
    limitDownKBps: 0,
    limitUpKBps: 0,
    secondsConnected: 18400,
    isMe: false,
    isKnown: true,
    deviceType: 'gaming'
  },
  {
    mac: 'cc:50:e3:19:80:aa',
    name: 'iPad Pro (Study)',
    hostname: 'iPad-Pro-12',
    remark: 'iPad Pro (Study)',
    ip: '192.168.0.114',
    band: '5G',
    online: true,
    blocked: false,
    downKBps: 320,
    upKBps: 45,
    limitDownKBps: 0,
    limitUpKBps: 0,
    secondsConnected: 4300,
    isMe: false,
    isKnown: true,
    deviceType: 'phone'
  },
  {
    mac: '18:65:90:3c:44:a2',
    name: 'Nest Audio Smart Speaker',
    hostname: 'Google-Nest-Hub',
    remark: 'Nest Audio Smart Speaker',
    ip: '192.168.0.120',
    band: '2.4G',
    online: true,
    blocked: false,
    downKBps: 120,
    upKBps: 15,
    limitDownKBps: 0,
    limitUpKBps: 0,
    secondsConnected: 86400,
    isMe: false,
    isKnown: true,
    deviceType: 'speaker'
  },
  {
    mac: '44:67:55:8f:90:12',
    name: 'Tuya Smart RGB Bulbs Controller',
    hostname: 'ESP_8F9012',
    remark: 'Tuya Smart RGB Bulbs Controller',
    ip: '192.168.0.125',
    band: '2.4G',
    online: true,
    blocked: false,
    downKBps: 18,
    upKBps: 8,
    limitDownKBps: 0,
    limitUpKBps: 0,
    secondsConnected: 142000,
    isMe: false,
    isKnown: true,
    deviceType: 'iot'
  },
  {
    mac: '2c:54:91:88:fe:6b',
    name: 'Unknown Android Device',
    hostname: 'android-2c549188fe6b',
    remark: 'Unknown Android Device',
    ip: '192.168.0.145',
    band: '2.4G',
    online: true,
    blocked: false,
    downKBps: 450,
    upKBps: 80,
    limitDownKBps: 0,
    limitUpKBps: 0,
    secondsConnected: 620,
    isMe: false,
    isKnown: false,
    deviceType: 'phone'
  },
  {
    mac: '8c:85:90:11:33:44',
    name: "Neighbor's Suspicious Device",
    hostname: 'redmi-note-9',
    remark: "Neighbor's Suspicious Device",
    ip: '192.168.0.199',
    band: '2.4G',
    online: false,
    blocked: true,
    downKBps: 0,
    upKBps: 0,
    limitDownKBps: 0,
    limitUpKBps: 0,
    secondsConnected: 0,
    isMe: false,
    isKnown: false,
    deviceType: 'phone'
  }
];

export const initialWifiConfig: WifiConfig = {
  ssid24: 'RouterMate-Home-2.4G',
  ssid5: 'RouterMate-Home-5G',
  security: 'WPA2-PSK (AES)',
  hidden24: false,
  hidden5: false,
  guest: {
    enabled: true,
    ssid: 'RouterMate-Guest-Free',
    hasPassword: true,
    speedKBps: 2048, // 2MBps cap
    durationMinutes: 480
  }
};

export const initialEvents: ActivityEvent[] = [
  {
    id: 'ev-1',
    timestamp: 'Just now',
    type: 'ai',
    title: 'AI Network Health Checked',
    description: 'Autonomous health check confirmed 0 packet loss on WAN interface.'
  },
  {
    id: 'ev-2',
    timestamp: '12 mins ago',
    type: 'in',
    title: 'PlayStation 5 Console linked',
    description: 'Gigabit wired ethernet connection established (1000 Mbps full duplex).'
  },
  {
    id: 'ev-3',
    timestamp: '48 mins ago',
    type: 'block',
    title: 'Blocked Suspicious Device',
    description: "Neighbor's Suspicious Device (8c:85:90:11:33:44) blacklisted by admin."
  },
  {
    id: 'ev-4',
    timestamp: '2 hours ago',
    type: 'limit',
    title: 'Guest Bandwidth Throttle active',
    description: 'RouterMate-Guest-Free capped at 2.0 Mbps maximum throughput.'
  }
];

export const initialIsp: IspContact = {
  name: 'Amber IT / Link3 Broadband',
  phone: '01711223344'
};
