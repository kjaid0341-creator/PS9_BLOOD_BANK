/**
 * Utility: Blood Donation Eligibility Calculator
 *
 * Evaluates donor medical eligibility based on standard blood banking regulations:
 * 1. Age criteria: Donors must be between 18 and 65 years old.
 * 2. Donation interval: A minimum configured recovery gap (default 90 days) must have
 *    elapsed since the donor's previous donation date.
 *
 * Calculates precise next eligible donation date and descriptive disqualification reasons.
 */

const calculateEligibility = (dob, lastDonationDate, minGapDays = 90) => {
  const now = new Date();
  const reasons = [];

  // 1. Validate Date of Birth
  if (!dob) {
    return {
      isEligible: false,
      age: 0,
      reasons: ['Date of birth is required to determine eligibility.'],
      nextEligibleDate: null,
    };
  }

  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) {
    return {
      isEligible: false,
      age: 0,
      reasons: ['Invalid date of birth provided.'],
      nextEligibleDate: null,
    };
  }

  if (birthDate > now) {
    return {
      isEligible: false,
      age: 0,
      reasons: ['Date of birth cannot be in the future.'],
      nextEligibleDate: null,
    };
  }

  // Calculate chronological age taking into account month and day
  let age = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
    age--;
  }

  let nextEligibleDate = null;

  // Age verification
  if (age < 18) {
    reasons.push(`Donor must be at least 18 years old (current age: ${age}).`);
    // Projected eligibility date is their 18th birthday
    const eighteenthBirthday = new Date(
      birthDate.getFullYear() + 18,
      birthDate.getMonth(),
      birthDate.getDate()
    );
    nextEligibleDate = eighteenthBirthday;
  } else if (age > 65) {
    reasons.push(`Donor must be 65 years or younger (current age: ${age}).`);
    nextEligibleDate = null; // Permanently ineligible by age limit
  }

  // 2. Donation interval verification
  if (lastDonationDate) {
    const lastDate = new Date(lastDonationDate);
    if (!isNaN(lastDate.getTime())) {
      if (lastDate > now) {
        reasons.push('Last recorded donation date cannot be in the future.');
      } else {
        const gapMs = Number(minGapDays) * 24 * 60 * 60 * 1000;
        const gapEligibleTime = new Date(lastDate.getTime() + gapMs);

        if (now < gapEligibleTime) {
          const daysRemaining = Math.ceil((gapEligibleTime - now) / (1000 * 60 * 60 * 24));
          reasons.push(
            `At least ${minGapDays} days must pass between donations. ${daysRemaining} day(s) remaining.`
          );

          // If gap date is later than age-based date, update nextEligibleDate
          if (!nextEligibleDate || gapEligibleTime > nextEligibleDate) {
            nextEligibleDate = gapEligibleTime;
          }
        }
      }
    }
  }

  const isEligible = reasons.length === 0;

  return {
    isEligible,
    age,
    reasons,
    nextEligibleDate: isEligible ? now : nextEligibleDate,
  };
};

module.exports = { calculateEligibility };
