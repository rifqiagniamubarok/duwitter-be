import { prisma } from '../src/lib/prisma';
import { payload_bank_account_examples } from './accounts/bank';
import { payload_digital_bank_account_examples } from './accounts/digital-bank';
import { payload_ewallet_account_examples } from './accounts/ewallet';

async function main() {
  const icon_url = '/public/account-icons/';
  // Collect all promises
  const banks = payload_bank_account_examples.map((item) => {
    const { name, currency, icon, color, bg_color } = item;
    const full_icon = icon_url + 'bank/' + icon;
    return prisma.account_example.upsert({
      where: { name: item.name },
      update: { currency, icon: full_icon, type: 'bank' },
      create: {
        name,
        type: 'bank',
        currency,
        icon: full_icon,
        color,
        bg_color,
      },
    });
  });

  const digital_banks = payload_digital_bank_account_examples.map((item) => {
    const { name, currency, icon, color, bg_color } = item;
    const full_icon = icon_url + 'digital-bank/' + icon;
    return prisma.account_example.upsert({
      where: { name: item.name },
      update: { currency, icon: full_icon, type: 'digital-bank' },
      create: {
        name,
        type: 'digital-bank',
        currency,
        icon: full_icon,
        color,
        bg_color,
      },
    });
  });
  const ewallets = payload_ewallet_account_examples.map((item) => {
    const { name, currency, icon, color, bg_color } = item;
    const full_icon = icon_url + 'ewallet/' + icon;
    return prisma.account_example.upsert({
      where: { name: item.name },
      update: { currency, icon: full_icon, type: 'ewallet' },
      create: {
        name,
        type: 'ewallet',
        currency,
        icon: full_icon,
        color,
        bg_color,
      },
    });
  });

  // Wait for all promises to resolve
  await Promise.all(banks);
  await Promise.all(digital_banks);
  await Promise.all(ewallets);
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
