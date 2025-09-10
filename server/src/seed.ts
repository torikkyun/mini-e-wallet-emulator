import { PrismaClient, BillType } from '../generated/prisma';
const prisma = new PrismaClient();

async function main() {
  const serviceProviders = [
    {
      name: 'Vietnam Electricity (EVN)',
      code: 'EVN',
      billTypes: ['electricity'],
    },
    {
      name: 'Ho Chi Minh City Water Supply (SAWACO)',
      code: 'SAWACO',
      billTypes: ['water'],
    },
    {
      name: 'Viettel Telecom',
      code: 'VIETTEL',
      billTypes: ['telecom', 'internet', 'tv'],
    },
    {
      name: 'VNPT',
      code: 'VNPT',
      billTypes: ['telecom', 'internet', 'tv'],
    },
    {
      name: 'FPT Telecom',
      code: 'FPT',
      billTypes: ['internet', 'tv'],
    },
    {
      name: 'CMC Telecom',
      code: 'CMC',
      billTypes: ['internet'],
    },
    {
      name: 'HTV - Ho Chi Minh City Television',
      code: 'HTV',
      billTypes: ['tv'],
    },
  ];

  for (const sp of serviceProviders) {
    await prisma.serviceProvider.upsert({
      where: { code: sp.code },
      update: {},
      create: {
        name: sp.name,
        code: sp.code,
        billTypes: sp.billTypes.map((type) => type as BillType),
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
