import 'dotenv/config';
import { db } from '../api/lib/db';
import { referralCodes } from '../api/lib/schema';
import { eq } from 'drizzle-orm';

interface ReferralCode {
  code: string;
  creatorTelegram: string;
  discountPercent?: number;
  commissionPercent?: number;
  isActive?: boolean;
}

async function addReferralCodes(codes: ReferralCode[]) {
  try {
    console.log('Adding referral codes...');
    
    for (const code of codes) {
      // Check if code already exists
      const existing = await db.select().from(referralCodes).where(eq(referralCodes.code, code.code));
      
      if (existing.length > 0) {
        console.log(`Skipping ${code.code} - already exists`);
        continue;
      }
      
      // Add new code
      await db.insert(referralCodes).values({
        code: code.code,
        creatorTelegram: code.creatorTelegram,
        discountPercent: code.discountPercent || 5,
        commissionPercent: code.commissionPercent || 10,
        isActive: code.isActive ?? true
      });
      
      console.log(`Added referral code: ${code.code}`);
    }
    
    console.log('Finished adding referral codes');
  } catch (error) {
    console.error('Error adding referral codes:', error);
  } finally {
    process.exit();
  }
}

// Add your referral codes here
const codesToAdd: ReferralCode[] = [
  {
    code: 'PROF0X',
    creatorTelegram: '@Prof0xx',
    discountPercent: 10,
    commissionPercent: 0
  },
  {
    code: '0XVIC',
    creatorTelegram: '@vicdegen',
    discountPercent: 5,
    commissionPercent: 10
  },
  {
    code: '0XGEM',
    creatorTelegram: '@vicdegen',
    discountPercent: 5,
    commissionPercent: 10
  },
  {
    code: 'CRYPTO5',
    creatorTelegram: '@vicdegen',
    discountPercent: 5,
    commissionPercent: 10
  }
];

addReferralCodes(codesToAdd); 