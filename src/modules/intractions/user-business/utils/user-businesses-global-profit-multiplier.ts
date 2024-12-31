import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const getUserBusinessesGlobalProfitMultiplier = ({
  user_id,
}: {
  user_id: number;
}) => {
  const authUser = prisma.user.findUnique({
    where: { id: user_id },
    include: {
      userBusinesses: {
        include: {
          business: true,
        },
      },
    },
  });
  Logger.log(authUser);
  // const achievementMultipliers = calculateAchievementMultipliers(
  //   userBusinesss.map((u: UserBusinessInfo) => ({
  //     business_id: u.business_id,
  //     level: u.level,
  //   })),
  // );

  // // Get cricket multipliers
  // const cricketCount = authUser?.cricketAttributes?.cricketAmount ?? 0;
  // const cricketMultipliers = calculateCricketMultipliers(cricketCount);

  // // Get referral multipliers
  // const directInvites = authUser?.referralStats?.directInviteCount ?? 0;
  // const downlineInvites = authUser?.referralStats?.downlineInviteCount ?? 0;
  // const referralMultipliers = calculateReferralMultipliers(
  //   directInvites,
  //   downlineInvites,
  // );

  // // Get pets multipliers
  // const petMultipliers = calculateUserPetsBusinesssMultiplier(authUser ?? null);

  // // Combine all multipliers
  // const combinedMultipliers: { [key: number]: number } = {};
  // Object.keys(achievementMultipliers).forEach((id) => {
  //   const numId = Number(id);
  //   combinedMultipliers[numId] =
  //     achievementMultipliers[numId] *
  //     cricketMultipliers[numId] *
  //     referralMultipliers[numId] *
  //     petMultipliers;
  // });

  // return {
  //   achievementMultipliers,
  //   cricketMultipliers,
  //   referralMultipliers,
  //   multipliers: combinedMultipliers,
  // };
};
