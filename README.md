## Proffesional referral system

This is a professional referral system that rewards users for bringing in new members. The system operates through a combination of database management, scheduled tasks, and business logic.

Key components of our referral system include:

- Users: Users can be identified using  their Ids, names, email addresses.

- Referral Codes: A referral code is generated for each user. These codes are used to track and credit referrals. A user can share their referral code with others to sign up using the code, it's recorded as a successful referral.

- Referral Count: A track record is kept for the number of successful referrals for each user. Once a user reaches a certain threshold (e.g., 5 referrals), they become eligible for rewards.

- Wallets: Users have virtual wallets associated with their accounts. When they refer others, they earn bonuses, which are credited to their wallets. These wallets store the user's bonus balance.

- Cron Jobs: A cron job is used to automate the referral system's operations. The cron jobs periodically check for qualified users and process rewards.

### Here's how the system works:

- The findQualifiedUsers cron job identifies users who have reached the referral threshold (e.g., 5 referrals) and marks their referrals as 'processing.' This prevents double rewards for the same referral.

- The payQualifiedUsers cron job checks for referrals that are marked as 'processing' and verifies if the referred user has the required number of referrals. If they do, it credits the user's wallet with a predefined bonus amount. It also updates the referral status to 'paid' and stops further processing.

The technology stack  used include NestJS, TypeORM, and Mysql for efficient management of user data, referrals, and wallets. I also used scheduled tasks provided by the NestJS Schedule library to automate the process.


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## Stay in touch

- Author - [Efe Stephen Ebieroma](https://www.linkedin.com/in/efe-ebieroma-800512150/)
