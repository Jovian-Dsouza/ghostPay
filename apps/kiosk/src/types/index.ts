
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  KEYPAD = 'KEYPAD',
  TOKEN_SELECTION = 'TOKEN_SELECTION',
  PAYMENT_QR = 'PAYMENT_QR',
  HISTORY = 'HISTORY',
  SETTINGS = 'SETTINGS'
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  customerName?: string;
  cryptoType: string;
  tokenMint?: string;
}

export interface MerchantProfile {
  name: string;
  storeId: string;
  totalSales: number;
  currency: string;
}

export const TOKEN_MINTS: Record<string, string> = {
  SOL: 'Native',
  RADR: 'CzFvsLdUazabdiu9TYXujj4EY495fG7VgJJ3vQs6bonk',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  ORE: 'oreoU2P8bN6jkk3jbaiVxYnG1dCXcYxwhwyK9jSybcp',
  BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  JIM: 'H9muD33usLGYv1tHvxCVpFwwVSn27x67tBQYH1ANbonk',
  GODL: 'GodL6KZ9uuUoQwELggtVzQkKmU1LfqmDokPibPeDKkhF',
  HUSTLE: 'HUSTLFV3U5Km8u66rMQExh4nLy7unfKHedEXVK1WgSAG',
  ZEC: '2fbBGNkpmPmPa3aTMqHV4czFUWshofxbAmrbyaVZmy7q',
  CRT: 'CRTx1JouZhzSU6XytsE42UQraoGqiHgxabocVfARTy2s',
  BLACKCOIN: 'J3rYdme789g1zAysfbH9oP4zjagvfVM2PX7KJgFDpump',
  GIL: 'CyUgNnKPQLqFcheyGV8wmypnJqojA7NzsdJjTS4nUT2j',
  ANON: 'D25bi7oHQjqkVrzbfuM6k2gzVNHTSpBLhtakDCzCCDUB',
  WLFI: 'WLFinEv6ypjkczcS83FZqFpgFZYwQXutRbxGe7oC16g',
  USD1: 'USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB',
  AOL: '2oQNkePakuPbHzrVVkQ875WHeewLHCd2cAwfwiLQbonk',
  IQLABS: '3uXACfojUrya7VH51jVC1DCHq3uzK4A7g469Q954LABS',
  SANA: '5dpN5wMH8j8au29Rp91qn4WfNq6t6xJfcjQNcFeDJ8Ct',
  POKI: '6vK6cL9C66Bsqw7SC2hcCdkgm1UKBDUE6DCYJ4kubonk',
  RAIN: '3iC63FgnB7EhcPaiSaC51UkVweeBDkqu17SaRyy2pump',
  HOSICO: 'Dx2bQe2UPv4k3BmcW8G2KhaL5oKsxduM5XxLSV3Sbonk',
  SKR: 'SKRbvo6Gf7GondiT3BbTfuRDPqLWei4j2Qy2NPGZhW3',
};
