import { PrismaClient, BillType } from '../generated/prisma';
const prisma = new PrismaClient();

async function main() {
  const serviceProviders = [
    {
      name: 'Vietnam Electricity (EVN)',
      code: 'EVN',
      billTypes: ['electricity'],
      accountNumber: '1000000001',
    },
    {
      name: 'Ho Chi Minh City Water Supply (SAWACO)',
      code: 'SAWACO',
      billTypes: ['water'],
      accountNumber: '1000000002',
    },
    {
      name: 'Viettel Telecom',
      code: 'VIETTEL',
      billTypes: ['telecom', 'internet', 'tv'],
      accountNumber: '1000000003',
    },
    {
      name: 'VNPT',
      code: 'VNPT',
      billTypes: ['telecom', 'internet', 'tv'],
      accountNumber: '1000000004',
    },
    {
      name: 'FPT Telecom',
      code: 'FPT',
      billTypes: ['internet', 'tv'],
      accountNumber: '1000000005',
    },
    {
      name: 'CMC Telecom',
      code: 'CMC',
      billTypes: ['internet'],
      accountNumber: '1000000006',
    },
    {
      name: 'HTV - Ho Chi Minh City Television',
      code: 'HTV',
      billTypes: ['tv'],
      accountNumber: '1000000007',
    },
  ];

  for (const sp of serviceProviders) {
    await prisma.serviceProvider.upsert({
      where: { code: sp.code },
      update: {
        accountNumber: sp.accountNumber,
      },
      create: {
        name: sp.name,
        code: sp.code,
        billTypes: sp.billTypes.map((type) => type as BillType),
        accountNumber: sp.accountNumber,
      },
    });
    console.log(`✅ Created/Updated: ${sp.name} (${sp.code})`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
