const express = require('express');
const router = express.Router();
const { Users, UserInfos, UserHistories, sequelize } = require('../models');
const { Transaction } = require('sequelize');
const authMiddleware = require('../middlewares/auth-middleware');

// 회원가입
router.post('/users', async (req, res) => {
  const { email, password, name, age, gender, profileImage } = req.body;
  const isExistUser = await Users.findOne({ where: { email } });

  if (isExistUser) {
    return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
  }

  // MySQL과 연결된 sequelize connection에서 transaction을 생성합니다.
  const t = await sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED, // 트랜잭션 격리 수준을 설정합니다.
  });

  try {
    // Users 테이블에 사용자를 추가합니다.
    const user = await Users.create(
      { email, password },
      { transaction: t } // transaction을 사용합니다.
    );

    // UserInfos 테이블에 사용자 정보를 추가합니다.
    const userInfo = await UserInfos.create(
      {
        UserId: user.userId, // 생성한 유저의 userId를 바탕으로 사용자 정보를 생성합니다.
        name,
        age,
        gender: gender.toUpperCase(), // 성별을 대문자로 변환합니다.
        profileImage,
      },
      { transaction: t } // transaction을 사용합니다.
    );

    // 트랜잭션을 사용한 모든 로직을 Commit, DB에 반영합니다.
    await t.commit();
  } catch (transactionError) {
    // 에러가 발생하였다면, 트랜잭션을 사용한 모든 쿼리를 Rollback, DB에 반영하지 않습니다.
    console.error(transactionError);
    await t.rollback();
    return res
      .status(400)
      .json({ errorMessage: `유저 생성에 실패하였습니다.` });
  }

  return res.status(201).json({ message: '회원가입이 완료되었습니다.' });
});

// 사용자 이름 변경 API
router.put('/users/name', authMiddleware, async (req, res) => {
  const { name } = req.body;
  const { userId } = res.locals.user;

  const userInfo = await UserInfos.findOne({ where: { userId } });
  const beforeName = userInfo.name;

  // 트랜잭션으로 비즈니스 로직 수행
  const t = await sequelize.transaction({
    // 격리수준
    isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
  });

  try {
    // 사용자 정보 테이블에 있는 이름변경
    await UserInfos.upadate(
      { name: name },
      {
        whre: { userId },
        transaction: t, // 트랜잭션을 통해 쿼리를 수행한다.
      }
    );

    // 사용자의 변경된 이름 내역을 UserHistoreis 테이블에 삽입
    await UserHistories.create(
      {
        UserId: userId,
        beforeName: beforeName,
        afterName: name,
      },
      { transaction: t } // 트랜잭션을 통해 쿼리를 수행한다.
    );

    await t.commit(); // 모든 비즈니스로직이 성공했따면 , DB에 반영하세요
  } catch (transactionError) {
    console.error(transactionError);
    await t.rollback(); // 비즈니스로직이 실패했다면 ROLLBACK
    return res
      .status(400)
      .json({ errorMessage: '유저 이름 변경에 실패했습니다.' });
  }

  return res.status(200).json({ message: '유저 이름 변경에 성공하였습니다.' });
});

module.exports = router;
